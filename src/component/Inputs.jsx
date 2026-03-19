import React from 'react'
import ResCard from './ResCard'
import { useState, useEffect } from 'react'
const Inputs = ({ setGender, setOccasion, setDesc, setBody,setBudget ,onSubmit, data }) => {
    const [open, setOpen] = useState(false)
    const [body, setBodyLocal] = useState('')
    const [expand , setExpand] = useState(false)
    const [loading, setLoading] = useState(false)


  const types = [
    { value: 'slim', label: 'Slim' },
    { value: 'avg', label: 'Average' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'muscular', label: 'Muscular' },
    { value: 'heavy', label: 'Broad' }
  ]
  const handleSubmit = () =>{
    setExpand(true)
    setLoading(true)
    onSubmit()
  }
  useEffect(()=>{
    if (data) setLoading(false)
  },[data])
  return (
    <>



        <div className={`stick ${expand? 'expand': ''}`}>
          <div className="cent">
            {expand && loading&& <h1>Loading</h1>}
            {expand && !loading && <ResCard data={data}/> }
          </div>


            <div className="flex">
              <div className="inputs">
                <div className="box">
                  <div className="label">Gender: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setGender(e.target.value)} />

                </div>
                <div className="box">
                  <div className="label">Budget: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setBudget(e.target.value)} />

                </div>

                <div className="box">
                  <div className="label">BodyType: </div>
                  <div className="custom-select">
                    <div className="selected" onClick={() => setOpen(!open)}>
                      {body || 'Select...'}
                      <span className={`arrow ${open ? 'up' : ''}`}>▾</span>
                    </div>
                    {open && (
                      <div className="options">
                        {types.map((e) => (
                          <div
                            key={e.value}
                            className="option"
                            onClick={() => { 
                                setBody(e.value)  
                                setBodyLocal(e.value)     
                                setOpen(false) }}
                            >
                            {e.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
                <div className="box">
                  <div className="label">Occasion: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setOccasion(e.target.value)} />
                </div>
              </div>

            

            <div className="desc">
              <input type="text" placeholder='Any preferences for outfits?? ' onChange={(e) => setDesc(e.target.value)} />
              <button className="btn" onClick={handleSubmit}>
                Style me
              </button>
            </div>
          </div>
        </div>
        
    </>
  )
}

export default Inputs