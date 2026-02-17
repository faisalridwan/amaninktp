'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, Copy, RefreshCw, Check, Type } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { toPng } from 'html-to-image'

export default function LatexEditorPage() {
    const [latex, setLatex] = useState('E = mc^2')
    const [previewKey, setPreviewKey] = useState(0) // Force re-render on change
    const [copied, setCopied] = useState(false)
    const previewRef = useRef(null)

    // Render LaTeX when input changes
    useEffect(() => {
        const renderLatex = () => {
            if (previewRef.current) {
                try {
                    katex.render(latex, previewRef.current, {
                        throwOnError: false,
                        displayMode: true,
                        output: 'html'
                    })
                } catch (e) {
                    console.error('KaTeX Render Error:', e)
                }
            }
        }
        renderLatex()
    }, [latex])

    const handleDownload = async () => {
        if (!previewRef.current) return
        try {
            const dataUrl = await toPng(previewRef.current, { backgroundColor: '#ffffff', pixelRatio: 3 })
            const link = document.createElement('a')
            link.download = 'equation.png'
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Failed to download image', err)
        }
    }

    const copyLatex = () => {
        navigator.clipboard.writeText(latex)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>♾️ LaTeX Equation <span>Editor</span></h1>
                        <p className={styles.heroSubtitle}>
                            Tulis rumus matematika kompleks dan simpan sebagai gambar transparan berkualitas tinggi.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        {/* Input Section */}
                        <div className={styles.inputSection}>
                            <div className={styles.sectionHeader}>
                                <h3><Type size={18} /> LaTeX Code</h3>
                                <button className={styles.btnSecondary} onClick={copyLatex} style={{ padding: '4px 8px', fontSize: '12px' }}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Disalin' : 'Salin Kode'}
                                </button>
                            </div>
                            <textarea
                                className={styles.latexInput}
                                value={latex}
                                onChange={(e) => setLatex(e.target.value)}
                                placeholder="\int_0^\infty x^2 dx"
                            />
                        </div>

                        {/* Preview Section */}
                        <div className={styles.previewSection}>
                            <div className={styles.sectionHeader}>
                                <h3><RefreshCw size={18} /> Preview & Export</h3>
                            </div>
                            <div className={styles.previewContainer}>
                                <div ref={previewRef} className={styles.previewContent}></div>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={handleDownload} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
                                    <Download size={18} /> Download PNG
                                </button>
                            </div>
                        </div>
                    </div>

                    <TrustSection />
                    <GuideSection toolId="latex-editor" />
                </div>
            </main>
            <Footer />
        </>
    )
}
