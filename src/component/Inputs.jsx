import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const BODY_TYPES = [
  { value: 'slim',     label: 'Slim' },
  { value: 'avg',      label: 'Average' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'heavy',    label: 'Broad' },
]

export default function Inputs({ setGender, setOccasion, setDesc, setBody, setBudget, onSubmit }) {
  const [open,      setOpen]      = useState(false)
  const [bodyLocal, setBodyLocal] = useState('')
  const [dropPos,   setDropPos]   = useState({ bottom: 0, left: 0, width: 140 })
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (rect) {
        
        setDropPos({
          bottom: window.innerHeight - rect.top + 8,
          left:   rect.left,
          width:  Math.max(rect.width, 140),
        })
      }
    }
    updatePos()

    const close = (e) => {
      if (!triggerRef.current?.closest('.box')?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const dropdown = open && ReactDOM.createPortal(
    <div
      className="options"
      style={{
        position: 'fixed',
        bottom:   dropPos.bottom,
        left:     dropPos.left,
        minWidth: dropPos.width,
        zIndex:   9999,
      }}
    >
      {BODY_TYPES.map(t => (
        <div
          key={t.value}
          className="option"
          onMouseDown={(e) => {
            e.preventDefault()
            setBody(t.value)
            setBodyLocal(t.label)
            setOpen(false)
          }}
        >
          {t.label}
        </div>
      ))}
    </div>,
    document.body
  )

  return (
    <div className="stick">

     
      <div className="inputs">
        <div className="box">
          <span className="label">Gender</span>
          <input type="text" placeholder="Male…" onChange={e => setGender(e.target.value)} />
        </div>

        <div className="box">
          <span className="label">Budget</span>
          <input type="text" placeholder="$100…" onChange={e => setBudget(e.target.value)} />
        </div>

        <div className="box" ref={triggerRef}>
          <span className="label">Body</span>
          <div className="custom-select">
            <div className="selected" onClick={() => setOpen(o => !o)}>
              {bodyLocal || 'Select…'}
              <span className={`arrow ${open ? 'up' : ''}`}>▾</span>
            </div>
          </div>
        </div>

        <div className="box">
          <span className="label">Occasion</span>
          <input type="text" placeholder="Casual…" onChange={e => setOccasion(e.target.value)} />
        </div>
      </div>

      {dropdown}

  
      <div className="desc">
        <input
          type="text"
          placeholder="Any preferences for outfits??"
          onChange={e => setDesc(e.target.value)}
        />
        <button onClick={onSubmit}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Style Me
        </button>
      </div>

    </div>
  )
}