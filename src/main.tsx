import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios, { type AxiosError } from 'axios'
import { App } from './App'
import AppToaster from './components/overlays/AppToaster'
import { TooltipProvider } from './components/ui/tooltip'
import './styles/globals.css'

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
}

if (import.meta.env.DEV) {
  axios.interceptors.request.use((config) => {
    console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '')
    return config
  })
  axios.interceptors.response.use(
    (res) => {
      console.log(`[API] ← ${res.status} ${res.config.url}`, res.data)
      return res
    },
    (err: AxiosError<{ error?: string; details?: unknown }>) => {
      const status = err.response?.status ?? 'N/A'
      const errorType = err.response?.data?.error ?? err.constructor?.name ?? 'Error'
      const errorMessage = err.response?.data?.details
        ? JSON.stringify(err.response.data.details)
        : err.message
      console.error(`[API] ✗ ${err.config?.method?.toUpperCase()} ${err.config?.url} - ${status} ${errorType}: ${errorMessage}`)
      return Promise.reject(err)
    },
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <App />
        <AppToaster />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
