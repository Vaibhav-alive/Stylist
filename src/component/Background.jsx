import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300)
    cam.position.set(0, 0, 16)

    scene.add(new THREE.AmbientLight(0x6a5cff, 0.45))
    const dl = new THREE.DirectionalLight(0xb18cfe, 1.3)
    dl.position.set(6, 8, 6); scene.add(dl)
    const dl2 = new THREE.DirectionalLight(0x8844ff, 0.5)
    dl2.position.set(-8, -5, 4); scene.add(dl2)
    const pl = new THREE.PointLight(0xb18cfe, 1.8, 30)
    pl.position.set(0, 0, 6); scene.add(pl)

    const bigOrb = new THREE.Mesh(
      new THREE.SphereGeometry(10, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x6b21d6, emissive: 0x4a0eaa, emissiveIntensity: 0.5,
        roughness: 0.2, metalness: 0.5, transparent: true, opacity: 0.1,
      })
    )
    bigOrb.position.set(0, -12, -6); scene.add(bigOrb)

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.2, 1),
      new THREE.MeshBasicMaterial({ color: 0x7b42dc, wireframe: true, transparent: true, opacity: 0.06 })
    )
    ico.position.set(2, 0, -10); scene.add(ico)

    const COLS = [0xb18cfe, 0x7b42dc, 0x8b5cf6, 0xc084fc, 0x4f46e5, 0x9333ea]
    const gems = []
    const gemData = [
      [-8, 2, -4, .55, 0], [7, 3, -3, .45, 1], [-5, -1, -2, .38, 2],
      [9, -2, -5, .62, 3], [-10, .8, -6, .32, 4], [5, 5, -7, .48, 5],
      [-3, 4, -3, .28, 1], [11, 1, -4, .40, 2], [-9, -3, -5, .44, 0],
      [1, -5, -2, .33, 3], [8, -5, -7, .58, 4], [-7, 5, -8, .50, 5],
      [0, 6, -6, .42, 0], [-12, 0, -3, .35, 2], [12, -1, -6, .38, 1],
      [-4, -6, -4, .30, 3], [3, 7, -8, .45, 4], [-6, -1, -1, .25, 5]
    ]
    gemData.forEach(([x, y, z, s, ci]) => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(s, 0),
        new THREE.MeshStandardMaterial({
          color: COLS[ci], emissive: COLS[ci], emissiveIntensity: 0.3,
          roughness: 0.08, metalness: 0.88, transparent: true, opacity: 0.8,
        })
      )
      m.position.set(x, y, z)
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      scene.add(m)
      gems.push({
        m,
        rs: { x: (Math.random() - .5) * .01, y: (Math.random() - .5) * .014, z: (Math.random() - .5) * .008 },
        fa: .15 + Math.random() * .28, ff: .4 + Math.random() * .65,
        ph: Math.random() * Math.PI * 2, by: y, bx: x,
      })
    })

    const N = 380, pp = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pp[i * 3]     = (Math.random() - .5) * 50
      pp[i * 3 + 1] = (Math.random() - .5) * 28
      pp[i * 3 + 2] = (Math.random() - .5) * 22 - 8
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xb18cfe, size: 0.07, transparent: true, opacity: 0.45 }))
    scene.add(pts)

    const mouse = { x: 0, y: 0 }, smooth = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - .5) * 2
      mouse.y = (e.clientY / window.innerHeight - .5) * 2
    }
    window.addEventListener('mousemove', onMove)
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight
      cam.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      smooth.x += (mouse.x - smooth.x) * .04
      smooth.y += (mouse.y - smooth.y) * .04
      cam.position.x = smooth.x * 1.4
      cam.position.y = -smooth.y * .8 + .5
      pts.rotation.y = t * .016; pts.rotation.x = t * .007
      ico.rotation.x = t * .065; ico.rotation.y = t * .045
      bigOrb.rotation.y = t * .035
      pl.position.x = Math.sin(t * .6) * 4
      pl.position.y = Math.cos(t * .4) * 3
      gems.forEach(g => {
        g.m.rotation.x += g.rs.x; g.m.rotation.y += g.rs.y; g.m.rotation.z += g.rs.z
        g.m.position.y = g.by + Math.sin(t * g.ff + g.ph) * g.fa
        g.m.position.x = g.bx + Math.sin(t * .2 + g.ph) * .1
      })
      renderer.render(scene, cam)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material.dispose()
      })
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}