'use client'

import { useState } from 'react'
import { Library, Package, ExternalLink, Code2, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function LibrariesPage() {
    const libraries = [
        {
            name: 'Next.js',
            ver: '15.1.0',
            desc: 'Framework React utama untuk performa, routing, dan optimasi SEO.',
            link: 'https://nextjs.org',
            github: 'https://github.com/vercel/next.js',
            icon: Globe
        },
        {
            name: 'React',
            ver: '19.0.0',
            desc: 'Library JavaScript untuk membangun antarmuka pengguna berbasis komponen.',
            link: 'https://react.dev',
            github: 'https://github.com/facebook/react',
            icon: Code2
        },
        {
            name: 'Lucide React',
            ver: '0.563.0',
            desc: 'Koleksi icon open-source yang ringan, konsisten, dan mudah digunakan.',
            link: 'https://lucide.dev',
            github: 'https://github.com/lucide-icons/lucide',
            icon: Package
        },
        {
            name: 'jsPDF',
            ver: '4.1.0',
            desc: 'Library untuk pembuatan dokumen PDF langsung di sisi klien (browser).',
            link: 'https://artskydj.github.io/jsPDF',
            github: 'https://github.com/parallax/jsPDF',
            icon: Library
        },
        {
            name: 'PDF.js',
            ver: '5.4.624',
            desc: 'Library standar untuk membaca dan merender file PDF di web.',
            link: 'https://mozilla.github.io/pdf.js',
            github: 'https://github.com/mozilla/pdf.js',
            icon: Library
        },
        {
            name: 'qrcode.react',
            ver: '4.2.0',
            desc: 'Komponen React untuk menghasilkan kode QR yang elegan dan fungsional.',
            link: 'https://zpao.github.io/qrcode.react',
            github: 'https://github.com/zpao/qrcode.react',
            icon: Code2
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}><Library size={32} /> Perpustakaan</h1>
                    <p className={styles.heroSubtitle}>
                        AmaninKTP dibangun dengan teknologi open-source terbaik.
                    </p>
                </header>

                <div className={styles.grid}>
                    {libraries.map((lib, index) => (
                        <div key={index} className={`neu-card no-hover ${styles.card}`}>
                            <div className={styles.cardHeader}>
                                <lib.icon size={28} className={styles.icon} />
                                <div>
                                    <h2>{lib.name}</h2>
                                    <span className={styles.version}>v{lib.ver}</span>
                                </div>
                            </div>
                            <p className={styles.desc}>{lib.desc}</p>
                            <div className={styles.links}>
                                <a href={lib.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    Visit Website <ExternalLink size={14} />
                                </a>
                                <a href={lib.github} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                                    <Code2 size={14} /> View Source
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    )
}
