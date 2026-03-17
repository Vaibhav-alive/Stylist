import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import Pill from './component/Pill'
import Cube from './component/Cube'
import axios from 'axios'


function App() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [glide, setGlide] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [gender, setGender] = useState('');
  const [body, setBody] = useState('');
  const [desc, setDesc] = useState('')
  const [sent, setSent] = useState(false)
  const [data, setData] = useState(null)
  const [load, setLoad] = useState(false)

  const [heightval, setHeightval] = useState(`${window.innerHeight * 0.3}px`)
  const widthval = `${window.innerWidth - 100}px`

  const options = {
    Gender: ['male', 'female'],
    Body_type: ['athletic', 'slim']
  }
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  useEffect(() => {
    const drift = 15;
    const speed = 0.04;

    const move = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2;
      const ny = (e.clientY / window.innerHeight) * 2;
      target.current = { x: nx * drift, y: ny * drift };
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * speed;
      current.current.y += (target.current.y - current.current.y) * speed;
      setOffset({ ...current.current });
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(rafId.current);
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setGlide(!glide), 800)
    return () => clearTimeout(timer)
  }, [])
  const gradient = [
    'linear-gradient(135deg, #B18CFE 0%, #7B42DC 100%)',
    'linear-gradient(135deg, #20002C 0%, #4A148C 100%)',
    'linear-gradient(135deg, #00FFA6 0%, #8BFF00 100%)',
    'linear-gradient(135deg, #7B42D6 0%, #5A2EB0 100%)',
    'linear-gradient(135deg, #5C1A1B 0%, #2C0B0E 100%)',
    'linear-gradient(135deg, #221784 0%, #3F2BF2 100%)',
    'linear-gradient(135deg, #BF00FF 0%, #730099 100%)'
  ]
  const pills = useMemo(() => ({
    bl: Array.from({ length: 8 }, () => ({
      top: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 2}%`,
      left: `${Math.random() * 80}%`,
      transform: `scale(${0.7 + Math.random() * 0.6})`,
      grad: gradient[Math.floor(Math.random() * gradient.length)],
    })),
    br: Array.from({ length: 8 }, () => ({
      top: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 2}%`,
      left: `${Math.random() * 80}%`,
      transform: `scale(${0.7 + Math.random() * 0.6})`,
      grad: gradient[Math.floor(Math.random() * gradient.length)],
    })),
    tl: Array.from({ length: 12 }, () => ({
      top: `${Math.random() * 50}%`,
      left: `${Math.random() * 50}%`,
      transform: `scale(${0.7 + Math.random() * 0.6})`,
      grad: gradient[Math.floor(Math.random() * gradient.length)],
    })),
    tr: Array.from({ length: 6 }, () => ({
      top: `${Math.random() * 50}%`,
      right: `${Math.random() * 50}%`,
      transform: `scale(${0.7 + Math.random() * 0.6})`,
      grad: gradient[Math.floor(Math.random() * gradient.length)],
    })),
    cubeGrads: [
      gradient[Math.floor(Math.random() * gradient.length)],
      gradient[Math.floor(Math.random() * gradient.length)],
    ]
  }), [])

  async function Fetch() {
    const res = await axios.post('http://127.0.0.1:8000/gen', {
      gender: gender,
      body_type: body,
      occasion: occasion,
      desc: desc
    })
    setData(res.data)
    setLoad(false)
  }

  function heightch() {
    setHeightval(`${window.innerHeight - 100}px`)
    setSent(true)
    setLoad(true)
    Fetch()
  }

  return (
    <>
      <div className="bg" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        <div className="bl">
          {pills.bl.map((p, i) => <Pill key={i} {...p} />)}
          <Cube grad={pills.cubeGrads[0]} />
        </div>
        <div className="br">
          {pills.br.map((p, i) => <Pill key={i} {...p} />)}
          <Cube grad={pills.cubeGrads[1]} />
        </div>
        <div className="tl">
          {pills.tl.map((p, i) => <Pill key={i} {...p} />)}
        </div>
        <div className="tr">
          {pills.tr.map((p, i) => <Pill key={i} {...p} />)}
        </div>
      </div>

      <div className="screen" />
      <div className="main">
        <div className="prompt-ar"
          style={{
            height: heightval,
            width: widthval
          }}
        >
          {
            !sent && (
              <h1>Hi there its Elio</h1>
            )
          }

          {
            sent && (
              <div className="content">
                {
                  load && (
                    <h1>Loading</h1>
                  )
                }
                {
                  !load && data && (
                    <div className="res">
                      
                      <img src={`data:image/jpeg;base64,${data.img}`} alt="" />
                      <p>{data.outfit}</p>
                    </div>

                  )
                }

              </div>
            )
          }
        </div>
        <div className="stick">

          {
            !sent && (
              <div className="inputs">
                <div className="box">
                  <div className="label">Gender: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setGender(e.target.value)} />
                  |
                </div>

                <div className="box">
                  <div className="label">BodyType: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setBody(e.target.value)} />
                  |
                </div>
                <div className="box">
                  <div className="label">Occasion: </div>
                  <input type="text" placeholder='here...' className='drop' onChange={(e) => setOccasion(e.target.value)} />
                </div>
              </div>

            )
          }

          <div className="desc">
            <input type="text" placeholder='Any desc you wanna add?? ' onChange={(e) => setDesc(e.target.value)} />
            <button className="btn" onClick={heightch}>
              ↑
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
