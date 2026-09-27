/**
 * useDragScroll — click-and-drag horizontal scrolling for overflow-x rails (carousels, chip rows, tab bars).
 * Touch and pen keep the browser's native swipe + momentum; this only adds the missing mouse gesture,
 * so the same rail can be dragged in a narrow desktop window or device emulation.
 * A drag past the threshold swallows the trailing click, so releasing over a card never navigates.
 *
 * Returns a callback ref (React 19 ref cleanup), so rails that mount late — after a loader or an
 * empty state — still get wired. Pass an existing ref to keep using the node elsewhere.
 */
import { useCallback, type RefCallback, type RefObject } from 'react'

const DRAG_THRESHOLD_PX = 6
// How far (ms of release velocity) the rail keeps gliding after a flick before snapping.
// Keep this deliberately modest: the rail should feel light and responsive, not runaway.
const MOMENTUM_MS = 180
const MOMENTUM_DURATION_MS = 360
const VELOCITY_SAMPLE_MS = 90
// A pause longer than this before release means the user stopped deliberately: no glide.
const MOMENTUM_IDLE_MS = 80

export function useDragScroll<T extends HTMLElement>(ref?: RefObject<T | null>): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      if (ref) ref.current = node
      if (!node) return
      const detach = attachDragScroll(node)
      return () => {
        if (ref) ref.current = null
        detach()
      }
    },
    [ref],
  )
}

function attachDragScroll(el: HTMLElement): () => void {
  let pointerId: number | null = null
  let dragging = false
  let suppressClick = false
  let startX = 0
  let startScroll = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let velocitySamples: Array<{ x: number; time: number }> = []
  let momentumFrame: number | null = null

  const stopMomentum = () => {
    if (momentumFrame !== null) {
      cancelAnimationFrame(momentumFrame)
      momentumFrame = null
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    if (el.scrollWidth <= el.clientWidth) return
    stopMomentum()
    // A new drag should always start from the exact current position, without a
    // snap animation fighting the pointer.
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
    pointerId = e.pointerId
    startX = lastX = e.clientX
    lastTime = e.timeStamp
    startScroll = el.scrollLeft
    velocity = 0
    velocitySamples = [{ x: e.clientX, time: e.timeStamp }]
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    const dx = e.clientX - startX
    if (!dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
      dragging = true
      el.setPointerCapture(e.pointerId)
      // Mandatory snap would yank every programmatic scrollLeft back to a snap point mid-drag.
      el.style.scrollSnapType = 'none'
      el.style.scrollBehavior = 'auto'
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
    }
    const dt = e.timeStamp - lastTime
    if (dt > 0) {
      velocitySamples.push({ x: e.clientX, time: e.timeStamp })
      velocitySamples = velocitySamples.filter((sample) => e.timeStamp - sample.time <= VELOCITY_SAMPLE_MS)
      const oldest = velocitySamples[0]
      velocity = oldest && e.timeStamp > oldest.time
        ? (e.clientX - oldest.x) / (e.timeStamp - oldest.time)
        : (e.clientX - lastX) / dt
    }
    lastX = e.clientX
    lastTime = e.timeStamp
    el.scrollLeft = startScroll - dx
  }

  const glide = (initialVelocity: number) => {
    const start = el.scrollLeft
    const distance = initialVelocity * MOMENTUM_MS
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / MOMENTUM_DURATION_MS, 1)
      // Ease-out cubic: the motion starts with the release velocity and gently
      // loses speed instead of stopping in a second snap/smooth-scroll jump.
      const easedProgress = 1 - (1 - progress) ** 3
      el.scrollLeft = start - distance * easedProgress

      if (progress < 1) {
        momentumFrame = requestAnimationFrame(tick)
      } else {
        momentumFrame = null
        el.style.scrollSnapType = ''
        el.style.scrollBehavior = ''
      }
    }

    momentumFrame = requestAnimationFrame(tick)
  }

  const onPointerEnd = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    pointerId = null
    if (!dragging) {
      // The pointer may have been pressed while a glide was running but never
      // crossed the drag threshold. Restore the normal rail behavior for the
      // next native scroll/click.
      el.style.scrollSnapType = ''
      el.style.scrollBehavior = ''
      return
    }
    dragging = false
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    el.style.cursor = ''
    el.style.userSelect = ''
    const releaseVelocity = e.timeStamp - lastTime > MOMENTUM_IDLE_MS ? 0 : velocity
    if (releaseVelocity === 0) {
      el.style.scrollSnapType = ''
      el.style.scrollBehavior = ''
    } else {
      glide(releaseVelocity)
    }
    // The click (if any) fires synchronously after pointerup; clear the flag once it has passed.
    suppressClick = true
    window.setTimeout(() => { suppressClick = false }, 0)
  }

  const onClickCapture = (e: MouseEvent) => {
    if (!suppressClick) return
    suppressClick = false
    e.preventDefault()
    e.stopPropagation()
  }

  // Links and images are natively draggable; that HTML5 drag would hijack the gesture.
  const onDragStart = (e: DragEvent) => e.preventDefault()

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerEnd)
  el.addEventListener('pointercancel', onPointerEnd)
  el.addEventListener('click', onClickCapture, true)
  el.addEventListener('dragstart', onDragStart)
  return () => {
    stopMomentum()
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerEnd)
    el.removeEventListener('pointercancel', onPointerEnd)
    el.removeEventListener('click', onClickCapture, true)
    el.removeEventListener('dragstart', onDragStart)
  }
}
