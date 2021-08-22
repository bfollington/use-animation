import { useRef } from "react"
import { interpolator, useAnimation, useObservable } from "./useAnimation/useAnimation"
import KEYS from "./useInput/keys"
import { useKeyDown } from "./useInput/keyStream"

const DomAnimation = () => {
  const target = useRef<HTMLDivElement>(null)

  const scale = useObservable(1)
  useAnimation(scale, interpolator(0, 1, "easeInOutCubic"), 250, (v) => {
    if (target.current) {
      target.current.style.transformOrigin = "center"
      target.current.style.transform = `scale(${v})`
    }
  })

  useKeyDown(KEYS.up_arrow, () => {
    scale.swap((s) => s + 2)
  })

  useKeyDown(KEYS.down_arrow, () => {
    scale.swap((s) => s - 2)
  })

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "center" }}>
      <div ref={target} style={{ width: "32px", height: "32px", backgroundColor: "red" }} />
    </div>
  )
}

export default DomAnimation
