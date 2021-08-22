// Based on https://codepen.io/al-ro/pen/jJJygQ by al-ro, but rewritten in react-three-fiber
import { useLoader } from "@react-three/fiber"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { combineLatest, interval } from "rxjs"
import { map, sampleTime } from "rxjs/operators"
import * as THREE from "three"
import "./materials/ShinyMaterial"
import bg from "./resources/seamless8.png"
import { interpolator, sequence, useAnimation, useObservable } from "./useAnimation/useAnimation"
import KEYS from "./useInput/keys"
import { useKeyDown, useKeyHeld } from "./useInput/keyStream"
import { mousemovenormalised$, useMouseMoveNormalised } from "./useInput/mouseStream"

export default function Wall(props: any) {
  const material = useRef()
  const mesh = useRef()
  const [texture] = useLoader(THREE.TextureLoader, [bg])
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const anim = sequence(interpolator(0, 1.2, "easeOutCubic"), interpolator(1.2, 1, "easeOutCubic"))

  const angle = useObservable(0)
  useAnimation(angle, interpolator(0, 1, "easeOutQuad"), 250, (v) => {
    const m = mesh.current as any
    m.rotation.x = v
    m.rotation.y = v
  })

  const xscale = useObservable(1)
  useAnimation(
    xscale,
    anim,
    500,
    useCallback((v) => {
      const m = mesh.current as any
      m.scale.z = v
    }, []),
  )

  const yscale = useObservable(1)
  useAnimation(
    yscale,
    anim,
    500,
    useCallback((v) => {
      const m = mesh.current as any
      m.scale.y = v
    }, []),
  )

  useKeyDown(KEYS.up_arrow, () => {
    yscale.swap((s) => s + 0.1)
  })

  useKeyDown(KEYS.down_arrow, () => {
    yscale.swap((s) => s - 0.1)
  })

  useKeyHeld(KEYS.left_arrow, 50, () => {
    angle.swap((s) => s - 0.05)
  })

  useKeyHeld(KEYS.right_arrow, 50, () => {
    angle.swap((s) => s + 0.05)
  })

  useMouseMoveNormalised(([x, y]) => {
    yscale.set(y * 4 + 0.5)
    xscale.set(x * 4 + 0.5)
  }, 50)

  // useEffect(() => {
  //   const s = combineLatest([
  //     mousemovenormalised$.pipe(
  //       sampleTime(100),
  //       map(([x]) => Math.PI * 2 * Math.sin(x * Math.PI)),
  //     ),
  //     interval(100),
  //   ])
  //     .pipe(map(([angle, time]) => angle + time / 5.0))
  //     .subscribe(angle.set)
  //   return () => s.unsubscribe()
  // }, [angle])

  useEffect(() => {
    const s = interval(500)
      .pipe(map((t) => Math.random() * Math.PI * 2))
      .subscribe(angle.set)
    return () => s.unsubscribe()
  }, [angle])

  return (
    <group {...props}>
      <mesh ref={mesh}>
        {/* <torusKnotGeometry args={[1, 1, 50]} /> */}
        {/* <icosahedronGeometry args={[3, 10]} /> */}
        <boxGeometry args={[4, 4]} />
        {/* <shinyMaterial ref={material} noiseTexture={texture} /> */}
        {/* <meshLambertMaterial color="red" /> */}
        <meshPhongMaterial color={props.color || "white"} />
      </mesh>
    </group>
  )
}
