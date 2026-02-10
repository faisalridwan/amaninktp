'use client'

import { History, GitBranch, Sparkles, Shield, Monitor, Smartphone, Globe, Heart, Minimize2, EyeOff, Scissors, Layout, QrCode, ScissorsLineDashed, Move, RotateCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function ChangelogPage() {
    const changelog = [
        {
            version: '1.2.0',
            date: '10 Februari 2026',
            title: 'AI Background Removal & Advanced Photo Gen',
            description: 'Update besar untuk pengolahan gambar dan dokumen. Menghadirkan AI Background Remover dan fitur-fitur manipulasi PDF baru.',
            changes: [
                { icon: Scissors, text: 'Background Remover: Hapus latar belakang foto otomatis menggunakan AI langsung di browser.' },
                { icon: Layout, text: 'Advanced Photo Gen: Fitur resize cerdas dengan DPI kontrol dan preset ukuran pas foto.' },
                { icon: QrCode, text: 'QR Code Generator: Buat kode QR kustom untuk URL, teks, atau WiFi (Beta).' },
                { icon: ScissorsLineDashed, text: 'Split PDF: Pisah halaman PDF menjadi dokumen terpisah dengan mudah.' },
                { icon: Move, text: 'Rearrange PDF: Atur ulang urutan halaman PDF secara visual.' },
                { icon: RotateCw, text: 'Rotate PDF: Putar halaman PDF yang miring atau terbalik permanen.' },
                { icon: Globe, text: 'Tech Stack Upgrade: Migrasi ke Next.js 16.1.6 untuk performa maksimal.' }
            ]
        },
        {
            version: '1.1.0',
            date: '9 Februari 2026',
            title: 'New Tools: Compress & Redact',
            description: 'Penambahan fitur produktivitas baru: Kompres Foto/PDF dan Sensor Data (Redaction) untuk keamanan dokumen yang lebih lengkap.',
            changes: [
                { icon: Minimize2, text: 'Kompres Foto & PDF: Perkecil ukuran dokumen Anda secara instan tanpa mengurangi kualitas terbaca.' },
                { icon: EyeOff, text: 'Redact / Sensor Data: Tutup informasi sensitif (NIK, Nama, dll) pada dokumen langsung di browser.' },
                { icon: Shield, text: 'Tetap 100% Client-Side: Fitur baru ini juga berjalan sepenuhnya di perangkat Anda, tanpa upload ke server.' }
            ]
        },
        {
            version: '1.0.0',
            date: '8 Februari 2026',
            title: 'Initial Release (Public)',
            description: 'Peluncuran perdana Amanin Data - Solusi terpadu untuk privasi dokumen identitas masyarakat Indonesia.',
            changes: [
                { icon: Sparkles, text: 'Fitur Utama: Watermark PDF dan Image serta Tanda Tangan Digital.' },
                { icon: Shield, text: 'Privasi: Seluruh pemrosesan dilakukan di sisi klien (browser), 100% tanpa upload ke server.' },
                { icon: Monitor, text: 'Desain Premium: Antarmuka Neumorphic yang modern, tenang, dan mudah digunakan.' },
                { icon: Smartphone, text: 'Responsive: Optimal digunakan di perangkat desktop, tablet, maupun smartphone.' },
                { icon: Heart, text: 'Donasi Terintegrasi: Dukung pengembangan proyek via QRIS, Bank Jago, dan PayPal.' },
                { icon: Globe, text: 'Open Source: Dibangun dengan teknologi terbaik seperti Next.js, React, dan jsPDF.' }
            ]
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}><History size={32} /> Riwayat Perubahan</h1>
                    <p className={styles.heroSubtitle}>
                        Ikuti perkembangan fitur dan pembaruan sistem Amanin Data.
                    </p>
                </header>

                <div className={styles.timeline}>
                    {changelog.map((entry, index) => (
                        <div key={index} className={styles.entry}>
                            <div className={styles.versionBadge}>
                                <GitBranch size={16} /> v{entry.version}
                            </div>
                            <div className={styles.date}>{entry.date}</div>

                            <div className={`neu-card no-hover ${styles.card}`}>
                                <h2 className={styles.title}>{entry.title}</h2>
                                <p className={styles.description}>{entry.description}</p>

                                <ul className={styles.changeList}>
                                    {entry.changes.map((change, i) => (
                                        <li key={i}>
                                            <change.icon size={18} className={styles.icon} />
                                            <span>{change.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    )
}
