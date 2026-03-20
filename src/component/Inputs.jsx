import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import ResCard from './ResCard'

const types = [
  { value: 'slim', label: 'Slim' },
  { value: 'avg', label: 'Average' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'heavy', label: 'Broad' }
]

const Inputs = ({ setGender, setOccasion, setDesc, setBody, setBudget, onSubmit, data }) => {
  const [open, setOpen] = useState(false)
  const [body, setBodyLocal] = useState('')
  const [expand, setExpand] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef(null)

  const handleSubmit = () => {
    setExpand(true)
    setLoading(true)
    onSubmit()
  }

  useEffect(() => {
    if (data) setLoading(false)
  }, [data])

  useEffect(() => {
    if (!open) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setDropPos({
        top: rect.top - 8,
        left: rect.left,
        width: Math.max(rect.width, 130)
      })
    }
    const close = (e) => {
      if (!triggerRef.current?.closest('.box')?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const dropdown = open && ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: dropPos.top,
        left: dropPos.left,
        width: dropPos.width,
        transform: 'translateY(-100%)',
        zIndex: 9999,
        background: 'rgba(18,18,18,0.98)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(177,140,254,0.1)',
        animation: 'popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)'
      }}
    >
      {types.map((e) => (
        <div
          key={e.value}
          className="option"
          onMouseDown={(ev) => {
            ev.preventDefault()
            setBody(e.value)
            setBodyLocal(e.value)
            setOpen(false)
          }}
        >
          {e.label}
        </div>
      ))}
    </div>,
    document.body
  )

  return (
    <>
      <div className={`stick ${expand ? 'expand' : ''}`}>
        <div className="cent">
          {expand && loading && <h1>Loading</h1>}
          {expand && !loading && <ResCard data={data} />}
        </div>

        <div className="flex">
          <div className="inputs">
            <div className="box">
              <div className="label">Gender:</div>
              <input type="text" placeholder="here..." className="drop" onChange={(e) => setGender(e.target.value)} />
            </div>
            <div className="box">
              <div className="label">Budget:</div>
              <input type="text" placeholder="here..." className="drop" onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="box">
              <div className="label">BodyType:</div>
              <div className="custom-select" ref={triggerRef}>
                <div className="selected" onClick={() => setOpen(!open)}>
                  {body || 'Select...'}
                  <span className={`arrow ${open ? 'up' : ''}`}>▾</span>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="label">Occasion:</div>
              <input type="text" placeholder="here..." className="drop" onChange={(e) => setOccasion(e.target.value)} />
            </div>
          </div>

          {dropdown}

          <div className="desc">
            <input type="text" placeholder="Any preferences for outfits??" onChange={(e) => setDesc(e.target.value)} />
            <button className="btn" onClick={handleSubmit}>Style me</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Inputs