// ==========================================
// USER STORAGE — SUPABASE INTEGRATION
// ==========================================

import { supabase, isSupabaseEnabled } from './supabase'

const USERS_KEY = 'sv_users'
const STUDENT_KEY = 'sv_student'
const PROGRESS_KEY = 'sv_progress'

export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email) {
  if (!email) return null
  const users = getAllUsers()
  return users.find(
    u => u.email?.toLowerCase().trim() === 
         email.toLowerCase().trim()
  ) || null
}

// =============================================
// USER REGISTRATION
// =============================================
export async function registerUser(userData) {
  const user = {
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password,
    standard: parseInt(userData.standard) || 9,
  }

  // Try Supabase first
  if (isSupabaseEnabled) {
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

      if (existing) {
        return { success: false, reason: 'Email already registered' }
      }

      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single()

      if (error) throw error

      // Save locally too for session
      saveStudentLocal(data)
      return { success: true, user: data }
    } catch (err) {
      console.error('Supabase register error:', err)
      // Fall through to localStorage
    }
  }

  // localStorage fallback
  const users = getAllUsers()
  const exists = users.find(u => u.email === user.email)
  if (exists) return { success: false, reason: 'Email already registered' }

  const newUser = { ...user, id: Date.now().toString(), createdAt: Date.now() }
  users.push(newUser)
  saveAllUsers(users)
  saveStudentLocal(newUser)
  return { success: true, user: newUser }
}

// =============================================
// LOGIN
// =============================================
export async function loginUser(email, password) {
  const cleanEmail = email?.toLowerCase().trim()
  if (!cleanEmail || !password) return null

  // Try Supabase first
  if (isSupabaseEnabled) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('password', password)
        .single()

      if (error || !data) {
        return loginFromLocal(cleanEmail, password)
      }

      saveStudentLocal(data)
      return data
    } catch (err) {
      console.error('Supabase login error:', err)
      return loginFromLocal(cleanEmail, password)
    }
  }

  return loginFromLocal(cleanEmail, password)
}

function loginFromLocal(email, password) {
  const users = getAllUsers()
  const user = users.find(
    u => u.email?.toLowerCase() === email && u.password === password
  )
  if (!user) {
    console.log('Login: user/password not found locally')
    return null
  }
  saveStudentLocal(user)
  return user
}

// =============================================
// UPDATE PASSWORD
// =============================================
export async function updatePassword(email, newPassword) {
  const cleanEmail = email?.toLowerCase().trim()

  if (isSupabaseEnabled) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('email', cleanEmail)

      if (error) throw error
    } catch (err) {
      console.error('Supabase updatePassword error:', err)
    }
  }

  // Always update localStorage too
  const users = getAllUsers()
  const idx = users.findIndex(u => u.email?.toLowerCase() === cleanEmail)
  if (idx !== -1) {
    users[idx].password = newPassword
    users[idx].updatedAt = Date.now()
    saveAllUsers(users)
  }

  const current = getStudent()
  if (current?.email?.toLowerCase() === cleanEmail) {
    saveStudentLocal({ ...current, password: newPassword })
  }

  if (idx !== -1) return { success: true }
  if (isSupabaseEnabled) return { success: true } // Assuming success if reached here via Supabase
  return { success: false, reason: 'User not found locally' }
}

// =============================================
// PROGRESS
// =============================================
export function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) || {}
    
    // Auto-patch any raw numbers to objects to prevent UI breaking
    Object.keys(parsed).forEach(key => {
      if (typeof parsed[key] === 'number') {
        parsed[key] = { lastScore: parsed[key], bestScore: parsed[key] }
      }
    })
    
    return parsed
  } catch {
    return {}
  }
}

export async function saveTopicResult(topicId, score) {
  // Always save locally first (instant)
  const localProgress = getProgress()
  const prev = localProgress[topicId] || {}
  
  // If it was somehow a number from previous bug, recover it
  const prevBest = typeof prev === 'number' ? prev : (prev.bestScore || 0)
  const bestScore = Math.max(prevBest, score)

  localProgress[topicId] = {
    lastScore: score,
    bestScore: bestScore
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(localProgress))

  // Then sync to Supabase
  if (isSupabaseEnabled) {
    const student = getStudent()
    if (!student?.id) return

    console.log('Supabase sync triggered for topic:', topicId, 'score:', score, 'user:', student.id)
    try {
      const { data, error } = await supabase
        .from('progress')
        .upsert({
          user_id: student.id,
          topic_id: topicId,
          score: bestScore, // store best score in cloud
          attempted_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,topic_id'
        })
        .select()
        
      if (error) {
        console.error('Supabase saveProgress error:', error)
      } else {
        console.log('Supabase saveProgress success:', data)
      }
    } catch (err) {
      console.error('Supabase saveProgress exception:', err)
    }
  }
}

export async function loadProgressFromSupabase() {
  if (!isSupabaseEnabled) return null

  const student = getStudent()
  if (!student?.id) return null

  try {
    const { data, error } = await supabase
      .from('progress')
      .select('topic_id, score')
      .eq('user_id', student.id)

    if (error) throw error

    const localProgress = getProgress()
    const mergedProgress = { ...localProgress }

    data.forEach(row => {
      const prev = mergedProgress[row.topic_id] || {}
      const prevLast = typeof prev === 'number' ? prev : prev.lastScore
      const prevBest = typeof prev === 'number' ? prev : (prev.bestScore || 0)
      
      mergedProgress[row.topic_id] = {
        lastScore: prevLast !== undefined ? prevLast : row.score,
        bestScore: Math.max(prevBest, row.score)
      }
    })

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(mergedProgress))
    return mergedProgress
  } catch (err) {
    console.error('Supabase loadProgress error:', err)
    return null
  }
}

// =============================================
// LOCAL SESSION HELPERS
// =============================================
function saveStudentLocal(student) {
  if (!student) {
    localStorage.removeItem(STUDENT_KEY)
    return
  }
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
}

export function getStudent() {
  try {
    return JSON.parse(localStorage.getItem(STUDENT_KEY) || 'null')
  } catch { return null }
}

export function saveStudent(student) {
  saveStudentLocal(student)
}

export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY)
}

// ==========================================
// DATA MIGRATION — run once on app startup
// Fixes any old format user data
// ==========================================
export function migrateUserData() {
  try {
    const users = getAllUsers()
    if (users.length === 0) return
    
    let changed = false
    const fixed = users.map(user => {
      const fixedUser = { ...user }
      
      if (fixedUser.email) {
        const clean = fixedUser.email.toLowerCase().trim()
        if (clean !== fixedUser.email) {
          fixedUser.email = clean
          changed = true
        }
      }
      
      Object.keys(fixedUser).forEach(key => {
        if (fixedUser[key] === undefined) {
          delete fixedUser[key]
          changed = true
        }
      })
      
      return fixedUser
    })
    
    if (changed) {
      saveAllUsers(fixed)
      console.log('User data migrated successfully')
    }
  } catch (e) {
    console.error('Migration error:', e)
  }
}

// ==========================================
// DEBUG HELPER
// ==========================================
export function debugUsers() {
  const users = getAllUsers()
  console.log('=== ALL USERS IN STORAGE ===')
  users.forEach(u => {
    console.log({
      email: u.email,
      name: u.name,
      passwordLength: u.password?.length,
      class: u.standard
    })
  })
  console.log('Current student:', getStudent()?.email)
  console.log('============================')
}

if (typeof window !== 'undefined') {
  window.debugLearnova = debugUsers
}
