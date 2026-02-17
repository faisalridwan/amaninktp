'use client'

import { useState, useEffect } from 'react'
import { Copy, Plus, Trash2, RotateCcw, Monitor, Smartphone, Layout } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function CssGradientPage() {
    const [colors, setColors] = useState([
        { color: '#8ec5fc', stop: 0 },
        { color: '#e0c3fc', stop: 100 }
    ])
    const [angle, setAngle] = useState(135)
    const [type, setType] = useState('linear') // linear, radial
    const [cssCode, setCssCode] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Sort colors by stop
        const sortedColors = [...colors].sort((a, b) => a.stop - b.stop)
        const colorString = sortedColors.map(c => `${c.color} ${c.stop}%`).join(', ')
        
        let code = ''
        if (type === 'linear') {
            code = `background: linear-gradient(${angle}deg, ${colorString});`
        } else {
            code = `background: radial-gradient(circle, ${colorString});`
        }
        setCssCode(code)
    }, [colors, angle, type])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const addColor = () => {
        if (colors.length >= 5) return
        setColors([...colors, { color: '#ffffff', stop: 50 }])
    }

    const removeColor = (index) => {
        if (colors.length <= 2) return
        const newColors = colors.filter((_, i) => i !== index)
        setColors(newColors)
    }

    const updateColor = (index, field, value) => {
        const newColors = [...colors]
        newColors[index][field] = value
        setColors(newColors)
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>🌈 Generator Gradasi <span>CSS</span></h1>
                        <p className={styles.heroSubtitle}>
                            Buat gradasi warna CSS modern yang indah secara visual dan salin kodenya.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        {/* Control Panel */}
                        <div className={styles.controlPanel}>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Type</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className={styles.btnAction} style={{ background: type === 'linear' ? '#3182ce' : '', color: type === 'linear' ? 'white' : '' }} onClick={() => setType('linear')}>Linear</button>
                                    <button className={styles.btnAction} style={{ background: type === 'radial' ? '#3182ce' : '', color: type === 'radial' ? 'white' : '' }} onClick={() => setType('radial')}>Radial</button>
                                </div>
                            </div>

                            {type === 'linear' && (
                                <div className={styles.controlGroup}>
                                    <label className={styles.label}>Angle ({angle}°)</label>
                                    <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className={styles.slider} />
                                </div>
                            )}

                            <div className={styles.controlGroup}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label className={styles.label} style={{ marginBottom: 0 }}>Colors</label>
                                    <button onClick={addColor} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3182ce' }}><Plus size={18} /></button>
                                </div>
                                {colors.map((c, i) => (
                                    <div key={i} className={styles.inputRow}>
                                        <input type="color" value={c.color} onChange={(e) => updateColor(i, 'color', e.target.value)} className={styles.colorInput} />
                                        <input type="range" min="0" max="100" value={c.stop} onChange={(e) => updateColor(i, 'stop', parseInt(e.target.value))} className={styles.slider} />
                                        <span style={{ fontSize: '12px', width: '30px' }}>{c.stop}%</span>
                                        {colors.length > 2 && (
                                            <button onClick={() => removeColor(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e53e3e' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <button className={styles.btnAction} onClick={() => { setAngle(Math.floor(Math.random() * 360)); setColors([{ color: '#'+Math.floor(Math.random()*16777215).toString(16), stop: 0 }, { color: '#'+Math.floor(Math.random()*16777215).toString(16), stop: 100 }]) }}>
                                <RotateCcw size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Randomize
                            </button>
                        </div>

                        {/* Preview Panel */}
                        <div className={styles.previewPanel}>
                            <div className={styles.gradientPreview} style={{ background: cssCode.replace('background: ', '').replace(';', '') }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontWeight: 700, fontSize: '1.5rem' }}>
                                    Preview Text
                                </div>
                            </div>
                            <div className={styles.codeBox}>
                                <code>{cssCode}</code>
                                <button className={styles.copyBtn} onClick={copyToClipboard}>
                                    <Copy size={16} /> {copied ? 'Copied!' : 'Copy CSS'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <TrustSection />
                    <GuideSection toolId="css-gradient" />
                </div>
            </main>
            <Footer />
        </>
    )
}
