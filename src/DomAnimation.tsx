import { useRef } from "react"
import { interpolator, useAnimation, useObservable } from "./useAnimation/useAnimation"
import KEYS from "./useInput/keys"
import { useKeyDown } from "./useInput/keyStream"
import { useMouseMoveNormalised } from "./useInput/mouseStream"

const IndependentAnimator = () => {
  const target = useRef<HTMLDivElement>(null)

  const scale = useObservable(1)
  useAnimation(scale, interpolator(0, 1, "easeInOutCubic"), 250, (v) => {
    if (target.current) {
      target.current.style.transformOrigin = "center"
      target.current.style.transform = `scale(${v})`
    }
  })

  const opacity = useObservable(1)
  useAnimation(opacity, interpolator(0, 1, "linear"), 10, (v) => {
    if (target.current) {
      target.current.style.opacity = `${v}`
    }
  })

  useKeyDown(KEYS.up_arrow, () => {
    scale.swap((s) => s + 2)
  })

  useKeyDown(KEYS.down_arrow, () => {
    scale.swap((s) => s - 2)
  })

  return <div ref={target} style={{ width: "32px", height: "32px", backgroundColor: "red" }} />
}

const DomAnimation = () => {
  const items = [...Array(500)].map((_, i) => i)

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", height: "100%", justifyContent: "center" }}>
      {items.map((i) => (
        <IndependentAnimator key={i} />
      ))}
    </div>
  )
}

export default DomAnimation
