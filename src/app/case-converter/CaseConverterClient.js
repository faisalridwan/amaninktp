'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'
import { Copy, Trash2, Check } from 'lucide-react'

export default function CaseConverterClient() {
    const [text, setText] = useState('')
    const [copied, setCopied] = useState(false)

    const transform = (type) => {
        let newText = text
        switch (type) {
            case 'upper':
                newText = text.toUpperCase()
                break
            case 'lower':
                newText = text.toLowerCase()
                break
            case 'title':
                newText = text.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase())
                break
            case 'sentence':
                newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase())
                break
            case 'camel':
                newText = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                break
            case 'snake':
                newText = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('_') || text
                break
            case 'kebab':
                 newText = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('-') || text
                break
            case 'alternating':
                newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
                break
            default:
                break
        }
        setText(newText)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.heroTitle}>🔠 Case <span>Converter</span></h1>
                <p className={styles.description}>
                    Ubah format teks Anda menjadi berbagai gaya penulisan secara instan.
                </p>

                <div className={styles.toolContainer}>
                    <textarea 
                        className={styles.textArea} 
                        placeholder="Ketik atau tempel teks Anda di sini..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <div className={styles.controls}>
                        <button className={styles.button} onClick={() => transform('upper')}>UPPERCASE</button>
                        <button className={styles.button} onClick={() => transform('lower')}>lowercase</button>
                        <button className={styles.button} onClick={() => transform('title')}>Title Case</button>
                        <button className={styles.button} onClick={() => transform('sentence')}>Sentence case</button>
                        <button className={styles.button} onClick={() => transform('camel')}>camelCase</button>
                        <button className={styles.button} onClick={() => transform('snake')}>snake_case</button>
                         <button className={styles.button} onClick={() => transform('kebab')}>kebab-case</button>
                        <button className={styles.button} onClick={() => transform('alternating')}>aLtErNaTiNg</button>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.clearButton} onClick={() => setText('')}>
                            <Trash2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
                            Bersihkan
                        </button>
                        <button className={styles.copyButton} onClick={copyToClipboard}>
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Tersalin!' : 'Salin Teks'}
                        </button>
                    </div>
                </div>

                <TrustSection />
                <GuideSection linkHref="/guide#case-converter" />
            </main>
            <Footer />
        </div>
    )
}
