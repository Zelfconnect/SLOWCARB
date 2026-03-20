import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Analytics/SpeedInsights render outside the hydration boundary
// to avoid hydration mismatches (they inject scripts dynamically)
const appTree = (
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)

const root = document.getElementById('root')!
if (root.hasChildNodes()) {
  hydrateRoot(root, appTree)
} else {
  createRoot(root).render(appTree)
}

// Render analytics outside the hydrated tree
const analyticsRoot = document.createElement('div')
document.body.appendChild(analyticsRoot)
createRoot(analyticsRoot).render(
  <>
    <Analytics />
    <SpeedInsights />
  </>,
)

async function clearDevelopmentServiceWorkerState() {
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(
    registrations
      .filter((registration) => {
        try {
          return new URL(registration.scope).origin === window.location.origin
        } catch {
          return false
        }
      })
      .map((registration) => registration.unregister()),
  )

  if (!('caches' in window)) return

  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith('slowcarb-'))
      .map((cacheName) => caches.delete(cacheName)),
  )
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
      return
    }

    clearDevelopmentServiceWorkerState().catch((error) => {
      console.warn('Failed to clear development service worker state', error)
    })
  })
}
