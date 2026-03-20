import { useEffect, useRef } from 'react'

export default function Hero() {
  const wordRef   = useRef(null)
  const bottomRef = useRef(null)

  // Subtle 3D tilt on mouse move
  useEffect(() => {
    const onMove = (e) => {
      if (!bottomRef.current) return
      const rx = ((e.clientY / window.innerHeight) - 0.5) * 4
      const ry = -((e.clientX / window.innerWidth)  - 0.5) * 6
      bottomRef.current.style.transform =
        `perspective(1000px) rotateX(${rx * 0.35}deg) rotateY(${ry * 0.35}deg)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!wordRef.current) return
      wordRef.current.style.transform =
        `translate(-50%, calc(-50% + ${window.scrollY * 0.25}px))`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="hero-inner">


      <div className="hero-word" ref={wordRef}>STYLE</div>
 

   
      <div className="hero-bottom" ref={bottomRef}>
        <div className="hero-tagline">AI-Powered Personal Stylist</div>
        <h1 className="hero-heading">
          Style Smarter<br/>
          with <em className="accent-em">Elio</em>
        </h1>
        <div className="hero-meta">
          <span className="meta-dot"/>
          <span className="meta-text">Personalised</span>
          <span className="meta-dot"/>
          <span className="meta-text">Budget-Aware</span>
          <span className="meta-dot"/>
          <span className="meta-text">Any Occasion</span>
        </div>
      </div>

    </div>
  )
}