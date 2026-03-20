import { useState } from 'react'
import './App.css'
import Background from './component/Background'
import Hero from './component/Hero'
import ResCard from './component/ResCard'
import Inputs from './component/Inputs'
import axios from 'axios'

export default function App() {
  const [occasion, setOccasion] = useState('')
  const [gender,   setGender]   = useState('')
  const [budget,   setBudget]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [body,     setBody]     = useState('')
  const [sent,     setSent]     = useState(false)
  const [data,     setData]     = useState(null)
  const [load,     setLoad]     = useState(false)

  async function Fetch() {
    const res = await axios.post('https://stylist-tdo3.onrender.com/gen', {
      gender, body_type: body, occasion, desc, budget,
    })
    console.log('API response:', res.data)
    setData(res.data)
    setLoad(false)
  }

  function heightch() {
    setSent(true)
    setLoad(true)
    Fetch()
  }

  return (
    <>
      <Background />
     

      <div className="main">
        <div className="prompt-ar">
          {!sent && <Hero />}
          {sent && load && (
            <div className="loading-text">STYLING…</div>
          )}
          {sent && !load && data && (
            <ResCard data={data} />
          )}
        </div>

        <Inputs
          setGender={setGender}
          setBody={setBody}
          setOccasion={setOccasion}
          setDesc={setDesc}
          setBudget={setBudget}
          data={data}
          onSubmit={heightch}
        />
      </div>
    </>
  )
}