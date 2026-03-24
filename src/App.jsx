import { useState } from 'react'
import './App.css'
import Background from './component/Background'
import Hero from './component/Hero'
import ResCard from './component/ResCard'
import Inputs from './component/Inputs'
import axios from 'axios'
import heic2any from 'heic2any'

export default function App() {
  const [occasion,      setOccasion]      = useState('')
  const [gender,        setGender]        = useState('')
  const [budget,        setBudget]        = useState('')
  const [desc,          setDesc]          = useState('')
  const [body,          setBody]          = useState('')
  const [sent,          setSent]          = useState(false)
  const [data,          setData]          = useState(null)
  const [load,          setLoad]          = useState(false)
  const [avatarImage,   setAvatarImage]   = useState(null)
  const [tryOnData,     setTryOnData]     = useState(null)
  const [tryOnLoad,     setTryOnLoad]     = useState(false)

  async function Fetch() {
    const res = await axios.post('https://stylist-tdo3.onrender.com/gen', {
      gender, body_type: body, occasion, desc, budget,
    })
    console.log('API response:', res.data)
    setData(res.data)
    setTryOnData(null)
    setLoad(false)
  }

  async function FetchTryOn() {
    if (!avatarImage) return
    setTryOnLoad(true)
    const file = avatarImage.files[0]
    let finalfile = file
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");
    
    if (isHeic){
      const convo = await heic2any({
        blob: file,
        toType: "image/jpeg"
      })

      finalfile = new File([convo], "converted.jpg",{
        type: "image/jpeg"
      })
    }
    
    const formData = new FormData()
    formData.append('avatar_image', finalfile)
    formData.append('avatar_sex',   gender)
    formData.append('gender',       gender)
    formData.append('body',         body)
    formData.append('occasion',     occasion)
    formData.append('desc',         desc)
    formData.append('budget',       budget)
    const res = await axios.post('https://stylist-tdo3.onrender.com/try', formData)
    setTryOnData(res.data)
    setTryOnLoad(false)
    setData(null)
    setSent(true)
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
          {tryOnLoad && (
            <div className="loading-text">TRYING ON…</div>
          )}
          {tryOnData && !tryOnLoad && (
            <ResCard data={tryOnData} />
          )}
        </div>

        <Inputs
          setGender={setGender}
          setBody={setBody}
          setOccasion={setOccasion}
          setDesc={setDesc}
          setBudget={setBudget}
          avatarImage={avatarImage} 
          setAvatarImage={setAvatarImage}
          data={data}
          onSubmit={heightch}
          onTryOn={FetchTryOn}
        />
      </div>
    </>
  )
}