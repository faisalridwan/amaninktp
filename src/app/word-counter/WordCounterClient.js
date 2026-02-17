'use client'

import { useState, useMemo } from 'react'
import { Facebook, Twitter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function WordCounterClient() {
    const [text, setText] = useState('')

    const stats = useMemo(() => {
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
        const chars = text.length
        const charsNoSpace = text.replace(/\s/g, '').length
        const sentences = text.split(/[.!?]+/).filter(Boolean).length
        const paragraphs = text.split(/\n+/).filter(Boolean).length
        
        const spaces = (text.match(/ /g) || []).length
        const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length
        const nonEmptyLines = text.split(/\r\n|\r|\n/).filter(line => line.trim() !== '').length
        const pages = (words / 500).toFixed(1) // Assuming 500 words per page

        // Avg reading speed 200 wpm
        const readingTime = Math.ceil(words / 200)

        return { words, chars, charsNoSpace, sentences, paragraphs, spaces, lines, nonEmptyLines, pages, readingTime }
    }, [text])

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.heroTitle}>📝 Word Counter <span>Online</span></h1>
                <p className={styles.description}>
                    Hitung jumlah kata, karakter, dan estimasi waktu baca secara real-time.
                </p>

                <div className={styles.toolContainer}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.chars}</span></div>
                            <div className={styles.statLabel}>CHARACTERS</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.charsNoSpace}</span></div>
                            <div className={styles.statLabel}>NON BLANK CHARACTERS</div>
                        </div>
                         <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.words}</span></div>
                            <div className={styles.statLabel}>WORDS</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.spaces}</span></div>
                            <div className={styles.statLabel}>SPACES</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.sentences}</span></div>
                            <div className={styles.statLabel}>SENTENCES</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.lines}</span></div>
                            <div className={styles.statLabel}>LINES</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.nonEmptyLines}</span></div>
                            <div className={styles.statLabel}>NOT EMPTY LINES</div>
                        </div>
                         <div className={styles.statCard}>
                            <div className={styles.statValue}><span>{stats.pages}</span></div>
                            <div className={styles.statLabel}>PAGES</div>
                        </div>
                    </div>

                    <div className={styles.readingTime}>
                        Estimasi waktu baca: <span>~{stats.readingTime} menit</span>
                    </div>

                    <textarea 
                        className={styles.textArea} 
                        placeholder="Mulai mengetik atau tempel teks Anda di sini..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <div className={styles.socialGrid}>
                        <div className={styles.socialCard}>
                            <div className={styles.socialHeader}>
                                <Facebook size={20} className={styles.socialIcon} />
                                <div className={styles.socialLabel}>FACEBOOK</div>
                            </div>
                            <div className={`${styles.socialValue} ${stats.chars > 250 ? styles.limitExceeded : ''}`}>
                                {stats.chars}/250
                            </div>
                        </div>
                        <div className={styles.socialCard}>
                            <div className={styles.socialHeader}>
                                <Twitter size={20} className={styles.socialIcon} />
                                <div className={styles.socialLabel}>X</div>
                            </div>
                            <div className={`${styles.socialValue} ${stats.chars > 280 ? styles.limitExceeded : ''}`}>
                                {stats.chars}/280
                            </div>
                        </div>
                        <div className={styles.socialCard}>
                            <div className={styles.socialHeader}>
                                <svg viewBox="0 0 24 24" className={styles.socialIcon} style={{ width: 20, height: 20 }}>
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <div className={styles.socialLabel}>GOOGLE</div>
                            </div>
                            <div className={`${styles.socialValue} ${stats.chars > 300 ? styles.limitExceeded : ''}`}>
                                {stats.chars}/300
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
