'use client'

import { useState } from 'react'
import { Newspaper, Download, Mail, Calendar, ExternalLink } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function PressPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1><Newspaper size={32} /> Pers & Media</h1>
                    <p>Informasi untuk jurnalis dan partner media</p>
                </header>

                <section className={`neu-card no-hover ${styles.section}`}>
                    <h2>Tentang AmaninKTP</h2>
                    <p>
                        AmaninKTP adalah aplikasi web gratis buatan Indonesia yang membantu masyarakat melindungi dokumen identitas
                        seperti KTP, SIM, dan paspor dari penyalahgunaan digital dengan menambahkan watermark.
                    </p>
                    <p>
                        Berbeda dengan layanan lain, AmaninKTP berjalan 100% di browser pengguna tanpa mengupload gambar ke server manapun,
                        menjamin privasi dan keamanan data pengguna.
                    </p>
                </section>

                <section className={`neu-card no-hover ${styles.section}`}>
                    <h2>Statistik</h2>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>100%</span>
                            <span className={styles.statLabel}>Client-Side</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>Data Disimpan</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>Gratis</span>
                            <span className={styles.statLabel}>Selamanya</span>
                        </div>
                    </div>
                </section>

                <section className={`neu-card no-hover ${styles.section}`}>
                    <h2>Media Kit</h2>
                    <p>Download logo, screenshot, dan aset media untuk keperluan publikasi.</p>
                    <a href="#" className={styles.downloadBtn}>
                        <Download size={18} /> Download Media Kit
                    </a>
                </section>

                <section className={`neu-card no-hover ${styles.section}`}>
                    <h2>Kontak Media</h2>
                    <p>Untuk pertanyaan media dan wawancara, silakan hubungi:</p>
                    <a href="mailto:press@qreatip.com" className={styles.emailLink}>
                        <Mail size={18} /> press@qreatip.com
                    </a>
                </section>

                <section className={styles.timeline}>
                    <h2><Calendar size={24} /> Rilis Terbaru</h2>
                    <div className={styles.timelineItem}>
                        <span className={styles.date}>Februari 2026</span>
                        <h4>Peluncuran AmaninKTP v2.0</h4>
                        <p>Fitur baru termasuk crop gambar, drag & drop, export PDF, dan desain yang lebih bersih.</p>
                    </div>
                    <div className={styles.timelineItem}>
                        <span className={styles.date}>Januari 2026</span>
                        <h4>Peluncuran AmaninKTP v1.0</h4>
                        <p>Versi pertama dengan fitur watermark dasar dan tanda tangan digital.</p>
                    </div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
