'use client'

import { useState, useRef } from 'react'
import { QrCode, Download, RefreshCcw, Share2, Copy, Check, Type, Link as LinkIcon, Wifi, Shield } from 'lucide-react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function QRCodePage() {
    const [text, setText] = useState('https://amanindata.qreatip.com')
    const [qrColor, setQrColor] = useState('#000000')
    const [bgColor, setBgColor] = useState('#ffffff')
    const [size, setSize] = useState(256)
    const [includeIcon, setIncludeIcon] = useState(false)
    const [copied, setCopied] = useState(false)
    const qrRef = useRef(null)

    const downloadQR = () => {
        const canvas = document.getElementById('qr-canvas')
        if (!canvas) return

        const pngUrl = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `qrcode-amanindata.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        <QrCode size={32} /> QR Code <span>Generator</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Buat kode QR kustom untuk URL, teks, atau WiFi secara instan dan aman.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        {/* Left: Preview */}
                        <div className={styles.previewSection}>
                            <div className={`neu-card no-hover ${styles.qrCard}`}>
                                <div className={styles.qrWrapper} ref={qrRef}>
                                    <QRCodeCanvas
                                        id="qr-canvas"
                                        value={text}
                                        size={size}
                                        fgColor={qrColor}
                                        bgColor={bgColor}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                                <div className={styles.previewActions}>
                                    <button onClick={downloadQR} className={styles.btnPrimary}>
                                        <Download size={18} /> Download PNG
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className={styles.controlsSection}>
                            <div className={`neu-card no-hover ${styles.controlCard}`}>
                                <div className={styles.inputGroup}>
                                    <label>Isi Konten (URL atau Teks)</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Masukkan URL atau teks di sini..."
                                        />
                                        <button onClick={copyToClipboard} className={styles.iconBtn} title="Salin Konten">
                                            {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.settingsGrid}>
                                    <div className={styles.inputGroup}>
                                        <label>Warna QR</label>
                                        <input
                                            type="color"
                                            value={qrColor}
                                            onChange={(e) => setQrColor(e.target.value)}
                                            className={styles.colorPicker}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Warna Background</label>
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className={styles.colorPicker}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Ukuran: {size}px</label>
                                    <input
                                        type="range"
                                        min="128"
                                        max="512"
                                        step="16"
                                        value={size}
                                        onChange={(e) => setSize(parseInt(e.target.value))}
                                        className={styles.rangeInput}
                                    />
                                </div>

                                <div className={styles.infoBox}>
                                    <Sparkles size={16} />
                                    <p>Gunakan tingkat koreksi kesalahan (Error Correction) tinggi untuk memastikan QR tetap terbaca meski kotor atau lecet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TrustSection />
                <GuideSection toolId="qrcode" />
            </main>

            <Footer />
        </>
    )
}

const Sparkles = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
)
