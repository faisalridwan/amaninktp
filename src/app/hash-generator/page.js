
'use client'

import { useState } from 'react'
import { Copy, File, Check, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'
import UploadArea from '@/components/UploadArea'
import CryptoJS from 'crypto-js'

export default function HashGeneratorPage() {
    const [activeTab, setActiveTab] = useState('text') // text, file
    const [inputText, setInputText] = useState('')
    const [file, setFile] = useState(null)
    const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '' })
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState('')

    const calculateHashes = (text) => {
        setHashes({
            md5: CryptoJS.MD5(text).toString(),
            sha1: CryptoJS.SHA1(text).toString(),
            sha256: CryptoJS.SHA256(text).toString(),
            sha512: CryptoJS.SHA512(text).toString()
        })
    }

    const handleTextChange = (e) => {
        const text = e.target.value
        setInputText(text)
        calculateHashes(text)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFile(file)
            setLoading(true)
            const reader = new FileReader()
            reader.onload = (event) => {
                const wordArray = CryptoJS.lib.WordArray.create(event.target.result)
                setHashes({
                    md5: CryptoJS.MD5(wordArray).toString(),
                    sha1: CryptoJS.SHA1(wordArray).toString(),
                    sha256: CryptoJS.SHA256(wordArray).toString(),
                    sha512: CryptoJS.SHA512(wordArray).toString()
                })
                setLoading(false)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(''), 2000)
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>#️⃣ Generator Hash <span>Kripto</span></h1>
                        <p className={styles.heroSubtitle}>
                            Generate MD5, SHA-1, SHA-256, dan SHA-512 checksum untuk teks atau file.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        <div className={styles.inputSection}>
                            <div className={styles.tabs}>
                                <button className={`${styles.tab} ${activeTab === 'text' ? styles.active : ''}`} onClick={() => setActiveTab('text')}>Text Input</button>
                                <button className={`${styles.tab} ${activeTab === 'file' ? styles.active : ''}`} onClick={() => setActiveTab('file')}>File Input</button>
                            </div>

                            {activeTab === 'text' ? (
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Ketik teks di sini..."
                                    value={inputText}
                                    onChange={handleTextChange}
                                />
                            ) : (
                                <div>
                                    {loading && <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#4a5568' }}>Processing...</p>}
                                    <UploadArea
                                        onFileSelect={handleFileChange}
                                        title={file ? file.name : "Upload File untuk Hash"}
                                        subtitle={file ? "Klik untuk ganti file" : "Generate checksum untuk file apapun"}
                                        formats={['ALL FILES']}
                                        icon={File}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.outputSection}>
                            {['MD5', 'SHA1', 'SHA256', 'SHA512'].map(algo => (
                                <div key={algo} className={styles.hashResult}>
                                    <span className={styles.hashLabel}>{algo}</span>
                                    <div className={styles.hashValue}>
                                        {activeTab === 'file' && loading ? (
                                            <span style={{ color: '#aaa' }}>Calculating...</span>
                                        ) : (
                                            <span style={{ color: hashes[algo.toLowerCase()] ? '' : '#aaa' }}>
                                                {hashes[algo.toLowerCase()] || '...'}
                                            </span>
                                        )}
                                        <button className={styles.copyBtn} onClick={() => copyToClipboard(hashes[algo.toLowerCase()], algo)}>
                                            {copied === algo ? <Check size={16} color="green" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <TrustSection />
                    <GuideSection toolId="hash-generator" />
                </div>
            </main>
            <Footer />
        </>
    )
}
