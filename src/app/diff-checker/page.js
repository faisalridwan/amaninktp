'use client'

import { useState } from 'react'
import {
    FileDiff, ArrowLeftRight, Trash2, CheckCircle, AlertCircle, Shield
} from 'lucide-react'
import * as Diff from 'diff'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function DiffCheckerPage() {
    const [original, setOriginal] = useState('')
    const [modified, setModified] = useState('')
    const [diffResult, setDiffResult] = useState([])
    const [hasCompared, setHasCompared] = useState(false)

    const handleCompare = () => {
        if (!original && !modified) return

        // Use diffWords for granular comparison
        const diff = Diff.diffWords(original, modified)
        setDiffResult(diff)
        setHasCompared(true)
    }

    const handleClear = () => {
        setOriginal('')
        setModified('')
        setDiffResult([])
        setHasCompared(false)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        ⚖️ Bandingkan Teks <span>(Diff)</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Bandingkan dua teks dan lihat perbedaannya secara instan.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Comparison
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        <div className={styles.inputCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>Teks Asli</span>
                            </div>
                            <textarea
                                className={styles.textArea}
                                value={original}
                                onChange={(e) => setOriginal(e.target.value)}
                                placeholder="Masukkan teks asli di sini..."
                            />
                        </div>

                        <div className={styles.inputCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>Teks Modifikasi</span>
                            </div>
                            <textarea
                                className={styles.textArea}
                                value={modified}
                                onChange={(e) => setModified(e.target.value)}
                                placeholder="Masukkan teks yang sudah diubah di sini..."
                            />
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button className={styles.clearBtn} onClick={handleClear}>
                            <Trash2 size={20} /> Bersihkan
                        </button>
                        <button className={styles.compareBtn} onClick={handleCompare}>
                            <ArrowLeftRight size={20} /> Bandingkan Teks
                        </button>
                    </div>

                    {hasCompared && (
                        <div className={styles.resultContainer}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>Hasil Perbandingan</span>
                                {diffResult.length === 1 && !diffResult[0].added && !diffResult[0].removed ? (
                                    <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <CheckCircle size={16} /> Identik
                                    </span>
                                ) : (
                                    <span style={{ color: 'orange', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <AlertCircle size={16} /> Ditemukan Perbedaan
                                    </span>
                                )}
                            </div>
                            <div className={styles.resultContent}>
                                {diffResult.map((part, index) => {
                                    const color = part.added ? 'added' : part.removed ? 'removed' : 'neutral'
                                    return (
                                        <span key={index} className={part.added || part.removed ? styles[color] : ''}>
                                            {part.value}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    <TrustSection />
                    <GuideSection toolId="diff-checker" />
                </div>
            </main>
            <Footer />
        </>
    )
}
