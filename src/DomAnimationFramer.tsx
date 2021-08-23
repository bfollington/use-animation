import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"
import { interpolator, useAnimation, useObservable } from "./useAnimation/useAnimation"
import KEYS from "./useInput/keys"
import { useKeyDown } from "./useInput/keyStream"
import { useMouseMoveNormalised } from "./useInput/mouseStream"

const IndependentAnimator = () => {
  const scale = useSpring(1)

  useKeyDown(KEYS.up_arrow, () => {
    scale.set(scale.get() + 2)
  })

  useKeyDown(KEYS.down_arrow, () => {
    scale.set(scale.get() - 2)
  })

  return <motion.div transition={{ duration: 200 }} style={{ scale, width: "32px", height: "32px", backgroundColor: "red" }} />
}

const DomAnimationFramer = () => {
  const items = [...Array(500)].map((_, i) => i)

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", height: "100%", justifyContent: "center" }}>
      {items.map((i) => (
        <IndependentAnimator key={i} />
      ))}
    </div>
  )
}

export default DomAnimationFramer
