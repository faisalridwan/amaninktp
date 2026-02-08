'use client'

import { useState } from 'react'
import { Library, Package, ExternalLink, FileCode, Palette, FileText, Image } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function LibrariesPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    const libraries = [
        {
            name: 'Next.js',
            version: '15.x',
            desc: 'React framework untuk web applications dengan server-side rendering dan static generation',
            url: 'https://nextjs.org',
            icon: FileCode,
            category: 'Framework'
        },
        {
            name: 'React',
            version: '19.x',
            desc: 'Library JavaScript untuk membangun user interface yang interaktif',
            url: 'https://react.dev',
            icon: FileCode,
            category: 'UI Library'
        },
        {
            name: 'Lucide React',
            version: '0.x',
            desc: 'Beautiful & consistent icon library dengan 1000+ icons SVG',
            url: 'https://lucide.dev',
            icon: Palette,
            category: 'Icons'
        },
        {
            name: 'jsPDF',
            version: '2.x',
            desc: 'Library untuk generate dokumen PDF langsung di browser client-side',
            url: 'https://github.com/parallax/jsPDF',
            icon: FileText,
            category: 'PDF'
        },
        {
            name: 'HTML5 Canvas API',
            version: 'Native',
            desc: 'Browser API untuk manipulasi gambar, drawing, dan rendering watermark',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
            icon: Image,
            category: 'Graphics'
        },
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1><Library size={32} /> Perpustakaan</h1>
                    <p>Open source libraries yang digunakan dalam pembuatan AmaninKTP</p>
                </header>

                <div className={styles.grid}>
                    {libraries.map((lib, i) => (
                        <a key={i} href={lib.url} target="_blank" rel="noopener noreferrer" className={`neu-card no-hover ${styles.card}`}>
                            <div className={styles.cardHeader}>
                                <lib.icon size={24} />
                                <span className={styles.category}>{lib.category}</span>
                            </div>
                            <h3>{lib.name}</h3>
                            <span className={styles.version}>v{lib.version}</span>
                            <p>{lib.desc}</p>
                            <span className={styles.link}>
                                Lihat <ExternalLink size={14} />
                            </span>
                        </a>
                    ))}
                </div>

                <section className={`neu-card no-hover ${styles.note}`}>
                    <Package size={20} />
                    <div>
                        <h4>100% Open Source Friendly</h4>
                        <p>AmaninKTP dibangun menggunakan teknologi open source. Semua library di atas dapat digunakan secara gratis sesuai dengan lisensi masing-masing.</p>
                    </div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
