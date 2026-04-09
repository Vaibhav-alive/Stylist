import React from 'react'
import Background from './Background'
import Hero from './Hero'
import ResCard from './ResCard'
import Inputs from './Inputs'
import axios from 'axios'
import heic2any from 'heic2any'
import { useState } from 'react'


const Home = () => {
    const [occasion, setOccasion] = useState('')
    const [gender, setGender] = useState('')
    const [budget, setBudget] = useState('')
    const [desc, setDesc] = useState('')
    const [body, setBody] = useState('')
    const [sent, setSent] = useState(false)
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [avatarImage, setAvatarImage] = useState(null)
    const [tryOnData, setTryOnData] = useState([])
    const [tryOnLoad, setTryOnLoad] = useState(false)
    const message = [
      'waking up server....',
      'Producing Results...'
    ]
    const [error, SetError] = useState(null)
    const [msgind, setMsgind] = useState(0)
    async function Fetch() {
      try {
        const res = await axios.post('https://stylist-tdo3.onrender.com/gen', {
          gender, body_type: body, occasion, desc, budget,
        })
        console.log('API response:', res.data)
        setData(prev => [...prev, res.data])
        // setTryOnData()
        setLoad(false)
  
      }
      catch (error) {
        SetError(`Sorry something went wrong, ${error}`)
      }
  
    }
  
    async function FetchTryOn() {
  
      if (!avatarImage) return 
        setTryOnLoad(true)
        setData([])
        setSent(true)
       const interval = setInterval(() => {
        setMsgind(prev => prev + 1)
      }, 2000)
        try {
      const file = avatarImage
      let finalfile = file
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");
     
      if (isHeic) {
        const convo = await heic2any({
          blob: file,
          toType: "image/jpeg"
        })
  
        finalfile = new File([convo], "converted.jpg", {
          type: "image/jpeg"
        })
      }
      const formData = new FormData()
      formData.append('avatar_image', finalfile)
      formData.append('avatar_sex', gender)
      formData.append('gender', gender)
      formData.append('body', body)
      formData.append('occasion', occasion)
      formData.append('desc', desc)
      formData.append('budget', budget)
      const res = await axios.post('https://stylist-tdo3.onrender.com/try', formData)
      setTryOnData(prev=> [...prev, res.data])
      console.log(tryOnData)
      setTryOnLoad(false)
      clearInterval(interval)
    }
    catch (error) {
      setTryOnLoad(false)
  
      clearInterval(interval)
      SetError(`Sorry! something went wrong, ${error}`)
    }
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
            <div className="loading-text">{message[msgind]}</div>
          )}
          {sent && !load && data.length > 0 && !error && (
            <div className="flex">
              {data.map((data, index)=>(
                <ResCard key={index} data={data}/>
              ))}
            </div>
          )}
          {error && (
            <div className="error">{error}</div>
          )}
          {tryOnLoad && (
            <div className="loading-text">{message[msgind]}</div>
          )}
          {tryOnData.length > 0 && !tryOnLoad && (
            <div className="flex">  
              {tryOnData.map((data, index)=> <ResCard key={index} data={data}/>)}
            </div>
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

export default Home