import React from "react"
import { fromEvent, identity, noop } from "rxjs"
import { map, pairwise, sampleTime, throttle } from "rxjs/operators"

export const mousemove$ = fromEvent<MouseEvent>(document, "mousemove").pipe(map((ev: MouseEvent) => [ev.clientX, ev.clientY]))
export const mousemovedelta$ = mousemove$.pipe(
  pairwise(),
  map(([[ax, ay], [bx, by]]) => [bx - ax, by - ay]),
)
export const mousemovenormalised$ = mousemove$.pipe(map(([x, y]) => [x / document.documentElement.clientWidth, y / document.documentElement.clientHeight]))

export function useMouseMove(sink: (p: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousemove$.pipe(throttleMs ? sampleTime(throttleMs || 0) : identity).subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}

export function useMouseMoveNormalised(sink: (p: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousemove$
      .pipe(
        throttleMs ? sampleTime(throttleMs || 0) : identity,
        map(([x, y]) => [x / document.documentElement.clientWidth, y / document.documentElement.clientHeight]),
      )
      .subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}

export function useMouseDelta(sink: (d: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousemovedelta$.pipe(throttleMs ? sampleTime(throttleMs || 0) : identity).subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}
