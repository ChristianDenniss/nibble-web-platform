/**
 * AppToaster — mounts the app-wide `react-hot-toast` `<Toaster>`, top-center. Every toast is
 * rendered via `toast.custom()` in `utils/notify.tsx` with built-in swipe-to-dismiss, so this
 * only sets shared behavior - position and duration - not per-type styling, which lives in
 * `notify.tsx` instead.
 * Lives in `components/overlays/`; rendered a single time in `main.tsx`.
 */
import { Toaster } from 'react-hot-toast'

export default function AppToaster() {
  return <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
}
