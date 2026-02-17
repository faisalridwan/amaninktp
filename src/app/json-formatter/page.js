'use client'

import { useState } from 'react'
import { Copy, Braces, Minimize2, Check, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function JsonFormatterPage() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    const formatJson = (space) => {
        try {
            if (!input.trim()) return
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed, null, space))
            setError(null)
        } catch (e) {
            setError(e.message)
            setOutput('')
        }
    }

    const minifyJson = () => {
        try {
            if (!input.trim()) return
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed))
            setError(null)
        } catch (e) {
            setError(e.message)
            setOutput('')
        }
    }

    const copyToClipboard = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const loadSample = () => {
        const sample = {
            "project": "Amanin Data",
            "version": 1.9,
            "features": ["Watermark", "Signature", "Encryption"],
            "secure": true,
            "author": {
                "name": "Faisal",
                "role": "Developer"
            }
        }
        setInput(JSON.stringify(sample))
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>📋 JSON Formatter <span>& Validator</span></h1>
                        <p className={styles.heroSubtitle}>
                            Validasi, format, dan minify data JSON Anda dengan mudah.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        {/* Input Pane */}
                        <div className={styles.pane}>
                            <div className={styles.paneHeader}>
                                <span className={styles.paneTitle}>Input JSON</span>
                                <div className={styles.paneControls}>
                                    <button className={styles.btnAction} onClick={loadSample}>Sample</button>
                                    <button className={styles.btnAction} onClick={() => setInput('')}>Clear</button>
                                </div>
                            </div>
                            <textarea
                                className={styles.editor}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste JSON here..."
                            />
                        </div>

                        {/* Output Pane */}
                        <div className={styles.pane}>
                            <div className={styles.paneHeader}>
                                <span className={styles.paneTitle}>Output</span>
                                <div className={styles.paneControls}>
                                    <button className={styles.btnAction} onClick={() => formatJson(2)}>Format (2)</button>
                                    <button className={styles.btnAction} onClick={() => formatJson(4)}>Format (4)</button>
                                    <button className={styles.btnAction} onClick={minifyJson}><Minimize2 size={14} /> Minify</button>
                                    <button className={`${styles.btnAction} ${styles.btnPrimary}`} onClick={copyToClipboard}>
                                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            {error ? (
                                <div className={styles.errorMsg}>
                                    <AlertTriangle size={20} />
                                    <span>Invalid JSON: {error}</span>
                                </div>
                            ) : (
                                <textarea
                                    className={styles.editor}
                                    value={output}
                                    readOnly
                                    placeholder="Result will appear here..."
                                />
                            )}
                        </div>
                    </div>

                    <TrustSection />
                    <GuideSection toolId="json-formatter" />
                </div>
            </main>
            <Footer />
        </>
    )
}
