'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadPyodideOnce, getLoadingState, PyodideInterface } from '@/lib/pyodide-loader'

interface UsePyodideState {
  isReady: boolean
  isLoading: boolean
  progress: number
  error: string | null
  pyodide: PyodideInterface | null
}

interface UsePyodideReturn extends UsePyodideState {
  loadPyodide: () => Promise<void>
}

/**
 * React Hook for loading and using Pyodide
 * Provides loading state, progress, and the Pyodide instance
 */
export function usePyodide(): UsePyodideReturn {
  const [state, setState] = useState<UsePyodideState>({
    isReady: false,
    isLoading: false,
    progress: 0,
    error: null,
    pyodide: null
  })

  const loadPyodide = useCallback(async () => {
    // Check if already loaded
    const currentState = getLoadingState()
    if (currentState.isLoading) {
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const pyodide = await loadPyodideOnce()
      setState({
        isReady: true,
        isLoading: false,
        progress: 100,
        error: null,
        pyodide
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Failed to load Pyodide: ${errorMessage}`
      }))
    }
  }, [])

  // Auto-load on mount
  useEffect(() => {
    const currentState = getLoadingState()

    // If already loaded, update state immediately
    if (currentState.progress === 100 && !currentState.error) {
      loadPyodide()
    }
  }, [loadPyodide])

  return {
    ...state,
    loadPyodide
  }
}
