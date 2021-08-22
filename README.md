# use-animation

a react hook for expressive animations, powered by rxjs

Usage: 

```tsx
import { useAnimation, useObservable, interpolator } from 'use-animation'
import { useKeyDown } from 'use-input'

const anim = interpolator(0, 1, "easeOutCubic")
const MyComponent = () => {
  const target = useRef(null)

  const scale = useObservable(1)
  useAnimation(scale, anim, 500,
    (v) => {
      target.current.style.transform = `scale(${v})`
    },
  )
  
  useKeyDown(KEYS.up_arrow, () => {
    scale.swap(s => s + 0.5)
  })
  
  return <div ref={target} style={{ width: '32px', height: '32px', backgroundColor: 'red' }} />
}
```

## Usage with react-three-fiber

```tsx
import { useObservable, interpolator } from 'use-animation'
import { useAnimation } from 'use-animation/three'
import { useKeyDown } from 'use-input'

const anim = interpolator(0, 1, "easeOutCubic")
const MyComponent = () => {
  const mesh = React.useRef(null)

  const scale = useObservable(1)
  useAnimation(scale, anim, 500,
    (v) => {
      mesh.current.scale.x = target.current.scale.y = v;
    },
  )
  
  useKeyDown(KEYS.up_arrow, () => {
    scale.swap(s => s + 0.5)
  })
  
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[4, 4]} />
      <meshPhongMaterial color={"red"} />
    </mesh>
  )
}
```

## Custom Stream Pipelines

### Setting Animated Values from Streams

```tsx

const angle = useObservable(0)
  
// ...

useEffect(() => {
  const s = interval(500)
    .pipe(map((t) => Math.random() * Math.PI * 2))
    .subscribe(angle.set)
  return () => s.unsubscribe()
}, [angle])

```

### Consuming, Merging, Summing Intent Streams

You can directly consume the source streams from `use-input`, these currently include `keydown$`, `keyup$`, `key$`, `mousemove$`, `mousemovenormalised$` and `mousemovedelta$`.

```tsx
const angle = useObservable(0)
   
// ...

useEffect(() => {
  const s = combineLatest([
    mousemovenormalised$.pipe(
      sampleTime(100),
      map(([x]) => Math.PI * 2 * Math.sin(x * Math.PI)),
    ),
    interval(100),
  ])
    .pipe(map(([angle, time]) => angle + time / 5.0))
    .subscribe(angle.set)
  return () => s.unsubscribe()
}, [angle])
```
