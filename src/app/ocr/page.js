'use client'

import { useState, useRef, useEffect } from 'react'
import { createWorker } from 'tesseract.js'
import {
    ScanText, Upload, RefreshCw, Copy, Check, Trash2,
    Image as ImageIcon, FileText, ChevronRight, Languages
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function OCRPage() {
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [text, setText] = useState('')
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [language, setLanguage] = useState('eng')
    const [copied, setCopied] = useState(false)

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) processImage(file)
    }

    const processImage = (file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setImage(file)
            setImagePreview(e.target.result)
            setText('')
            setProgress(0)
            setStatus('Ready to scan')
        }
        reader.readAsDataURL(file)
    }

    const handleScan = async () => {
        if (!image) return

        setIsProcessing(true)
        setText('')

        try {
            // Tesseract.js v6+ / v7 pattern: createWorker(langs, oem, options)
            // OEM 1 (LSTM) is default.
            const worker = await createWorker(language, 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(parseInt(m.progress * 100))
                        setStatus(`Scanning... ${parseInt(m.progress * 100)}%`)
                    } else {
                        setStatus(m.status)
                    }
                }
            })

            // Worker is already initialized with language when created this way
            const { data: { text } } = await worker.recognize(imagePreview)

            setText(text)
            setStatus('Completed')
            await worker.terminate()

        } catch (error) {
            console.error(error)
            setStatus('Error occurred during scanning')
        } finally {
            setIsProcessing(false)
        }
    }

    const handlePaste = (e) => {
        const items = e.clipboardData?.items
        if (!items) return

        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                processImage(file)
                break
            }
        }
    }

    useEffect(() => {
        document.addEventListener('paste', handlePaste)
        return () => document.removeEventListener('paste', handlePaste)
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const reset = () => {
        setImage(null)
        setImagePreview(null)
        setText('')
        setProgress(0)
        setStatus('')
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        📝 Ekstrak Teks <span>(OCR)</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ekstrak teks dari gambar secara instan. 100% Client-side privacy dengan Tesseract.js.
                    </p>
                    <div className={styles.trustBadge}>
                        <RefreshCw size={14} /> Powered by AI Tesseract.js
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        {!imagePreview ? (
                            <div className={styles.uploadArea}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="ocr-upload"
                                />
                                <label htmlFor="ocr-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    <Upload className={styles.uploadIcon} />
                                    <div className={styles.uploadText}>
                                        Klik untuk Upload Gambar
                                    </div>
                                    <div className={styles.uploadSubtext}>
                                        atau Drag & Drop / Paste (Ctrl+V) disini
                                    </div>
                                    <div className={styles.uploadSubtext} style={{ marginTop: '10px' }}>
                                        Support JPG, PNG, WebP
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className={styles.previewContainer}>
                                <div className={styles.controls}>
                                    <div className={styles.selectGroup}>
                                        <Languages size={18} />
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className={styles.languageSelect}
                                            disabled={isProcessing}
                                        >
                                            <option value="eng">English (Inggris)</option>
                                            <option value="ind">Indonesian (Indonesia)</option>
                                        </select>
                                    </div>

                                    <button
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                        onClick={handleScan}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <><RefreshCw className="spin" size={18} /> Scanning...</>
                                        ) : (
                                            <><ScanText size={18} /> Mulai Scan</>
                                        )}
                                    </button>

                                    <button
                                        className={styles.actionBtn}
                                        onClick={reset}
                                        disabled={isProcessing}
                                    >
                                        <Trash2 size={18} /> Reset
                                    </button>
                                </div>

                                {isProcessing && (
                                    <div className={styles.progressContainer}>
                                        <div className={styles.progressBarTrack}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className={styles.progressText}>
                                            {status}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.splitLayout}>
                                    <div className={styles.imagePreviewColumn}>
                                        <div className={styles.previewHeader}>
                                            <div className={styles.previewTitle}>
                                                <ImageIcon size={18} /> Original Image
                                            </div>
                                        </div>
                                        <div className={styles.imageContainer}>
                                            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                                        </div>
                                    </div>

                                    <div className={styles.textResultColumn}>
                                        <div className={styles.previewHeader}>
                                            <div className={styles.previewTitle}>
                                                <FileText size={18} /> Extracted Text
                                            </div>
                                            {text && (
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={styles.actionBtn}
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                >
                                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                                    {copied ? 'Copied' : 'Copy Text'}
                                                </button>
                                            )}
                                        </div>
                                        <div className={styles.resultContainer}>
                                            <textarea
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                className={styles.resultTextarea}
                                                placeholder="Hasil scan text akan muncul disini..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <TrustSection />
                <GuideSection toolId="ocr" />
            </main>
            <Footer />
        </>
    )
}
