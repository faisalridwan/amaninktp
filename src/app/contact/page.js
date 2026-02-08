'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, MapPin, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function ContactPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1><Mail size={32} /> Hubungi Kami</h1>
                    <p>Ada pertanyaan atau saran? Kami senang mendengar dari Anda!</p>
                </header>

                <div className={styles.grid}>
                    <div className={`neu-card no-hover ${styles.card}`}>
                        <MessageSquare size={28} />
                        <h3>Email</h3>
                        <p>Untuk pertanyaan umum dan dukungan</p>
                        <a href="mailto:hello@qreatip.com" className={styles.link}>
                            hello@qreatip.com
                        </a>
                    </div>

                    <div className={`neu-card no-hover ${styles.card}`}>
                        <Globe size={28} />
                        <h3>Website</h3>
                        <p>Kunjungi website utama kami</p>
                        <a href="https://qreatip.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                            qreatip.com
                        </a>
                    </div>

                    <div className={`neu-card no-hover ${styles.card}`}>
                        <MapPin size={28} />
                        <h3>Lokasi</h3>
                        <p>Karya lokal dari Indonesia</p>
                        <span className={styles.info}>Indonesia 🇮🇩</span>
                    </div>
                </div>

                <section className={`neu-card no-hover ${styles.formSection}`}>
                    <h2><Send size={24} /> Kirim Pesan</h2>
                    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('Terima kasih! Pesan Anda akan kami balas segera.') }}>
                        <div className={styles.formRow}>
                            <div className={styles.field}>
                                <label>Nama</label>
                                <input type="text" placeholder="Nama Anda" required />
                            </div>
                            <div className={styles.field}>
                                <label>Email</label>
                                <input type="email" placeholder="email@contoh.com" required />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Subjek</label>
                            <input type="text" placeholder="Subjek pesan" required />
                        </div>
                        <div className={styles.field}>
                            <label>Pesan</label>
                            <textarea placeholder="Tulis pesan Anda..." rows={5} required />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            <Send size={16} /> Kirim Pesan
                        </button>
                    </form>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
