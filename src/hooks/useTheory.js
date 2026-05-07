import { useState, useEffect } from 'react'

export function useTheory(topicId) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    cached: false
  })

  useEffect(() => {
    if (!topicId) return

    const cacheKey = `sv_theory_${topicId}`
    
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        setState({
          data: JSON.parse(cached),
          loading: false,
          error: null,
          cached: true
        })
        return
      } catch(e) {
        localStorage.removeItem(cacheKey)
      }
    }

    setState(s => ({...s, loading: true, error: null}))

    async function load() {
      try {
        const url = `/theory/${topicId}.json`
        console.log('Fetching:', url)
        
        const response = await fetch(url)
        console.log('Status:', response.status)
        
        if (!response.ok) {
          throw new Error(
            `File not found: ${url} (${response.status})`
          )
        }
        
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          throw new Error(
            `Wrong file type returned. Check that 
            public/theory/${topicId}.json exists.`
          )
        }
        
        const theory = await response.json()
        localStorage.setItem(cacheKey, JSON.stringify(theory))
        
        setState({
          data: theory,
          loading: false,
          error: null,
          cached: false
        })
      } catch(err) {
        console.error('Theory error:', err.message)
        setState({
          data: null,
          loading: false,
          error: err.message,
          cached: false
        })
      }
    }

    load()
  }, [topicId])

  const clearCache = () => {
    localStorage.removeItem(`sv_theory_${topicId}`)
    setState({ 
      data: null, 
      loading: false, 
      error: null, 
      cached: false 
    })
  }

  return { ...state, clearCache }
}
