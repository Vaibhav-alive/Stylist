import React from 'react'

const Dropdown = () => {
    const [open, setOpen] = useState(false)

    return (
    <>
        <div className="custom-select">
            <div className="selected" onClick={() => setOpen(!open)}>
            {body || 'Select...'}
            <span className={`arrow ${open ? 'up' : ''}`}>▾</span>
        </div>
        {open && (
        <div className="options">
            {types.map((e) => (
            <div key={e.value} className="option"
                onClick={() => { setBody(e.value); setOpen(false) }}>
                {e.label}
            </div>
            ))}
        </div>
        )}
        </div>
    </>
  )
}

export default Dropdown