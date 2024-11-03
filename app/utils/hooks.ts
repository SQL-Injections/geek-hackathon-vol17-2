import interact from 'interactjs'
import { CSSProperties, useEffect, useRef, useState } from 'react'

const initPosition = {
  x: 0,
  y: 0,
}

export function useInteractJS(position: Partial<typeof initPosition> = initPosition) {
  const [_position, setPosition] = useState({ ...initPosition, ...position })

  const interactRef = useRef(null)
  let { x, y } = _position

  const enable = () => {
    interact(interactRef.current as unknown as HTMLElement)
      .draggable({
        inertia: false,
      })
      .on('dragmove', (event) => {
        x += event.dx
        y += event.dy

        setPosition({
          x,
          y,
        })
      })
  }

  const disable = () => {
    interact(interactRef.current as unknown as HTMLElement).unset()
  }

  useEffect(() => {
    enable()
    return disable
  }, [])

  return {
    ref: interactRef,
    style: {
      transform: `translate3D(${_position.x}px, ${_position.y}px, 0)`,
      position: 'absolute' as CSSProperties['position'],
    },
  }
}
