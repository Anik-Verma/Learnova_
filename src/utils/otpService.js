import emailjs from '@emailjs/browser';

/**
 * EMAILJS SETUP INSTRUCTIONS:
 * 1. Go to emailjs.com and create a free account.
 * 2. Create an Email Service (Gmail recommended).
 * 3. Create an Email Template with these variables:
 *    {{to_email}} — recipient email
 *    {{otp_code}} — the 6 digit OTP
 *    {{user_name}} — student name
 * 4. Get Service ID, Template ID, and Public Key.
 * 5. Add to your .env file:
 *    VITE_EMAILJS_SERVICE_ID=your_service_id
 *    VITE_EMAILJS_TEMPLATE_ID=your_template_id
 *    VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */

const USERS_KEY = "learnova_users";
const STUDENT_KEY = "learnova_student";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email, otp) {
  const otpData = {
    otp,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
  };
  localStorage.setItem('sv_otp_' + email, JSON.stringify(otpData));
}

export function verifyOTP(email, enteredOTP) {
  const stored = localStorage.getItem('sv_otp_' + email);
  if (!stored) return { valid: false, reason: 'No OTP found' };
  
  const otpData = JSON.parse(stored);
  
  if (Date.now() > otpData.expiresAt) {
    localStorage.removeItem('sv_otp_' + email);
    return { valid: false, reason: 'OTP expired' };
  }
  
  if (otpData.otp !== enteredOTP) {
    return { valid: false, reason: 'Incorrect OTP' };
  }
  
  localStorage.removeItem('sv_otp_' + email);
  return { valid: true };
}

export async function sendOTPEmail(email, otp, name) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS not configured');
    console.log('OTP for testing:', otp);
    return { 
      success: false, 
      devMode: true,
      otp 
    };
  }
  
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        otp_code: otp,
        user_name: name || 'Student',
        expiry_time: '10 minutes'
      },
      publicKey
    );
    return { success: true };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, error: error.message };
  }
}

export function updatePassword(email, newPassword) {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
      return { success: false, reason: 'User not found' };
    }
    
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = Date.now();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Also update logged in student if applicable
    const currentStudent = JSON.parse(localStorage.getItem(STUDENT_KEY) || 'null');
    if (currentStudent && currentStudent.email.toLowerCase() === email.toLowerCase()) {
      currentStudent.password = newPassword;
      currentStudent.updatedAt = Date.now();
      localStorage.setItem(STUDENT_KEY, JSON.stringify(currentStudent));
    }
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: USERS_KEY,
      newValue: JSON.stringify(users),
      storageArea: localStorage
    }));
    
    return { success: true };
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

export function findUserByEmail(email) {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch {
    return null;
  }
}
