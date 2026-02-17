'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, MapPin, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        window.location.href = `mailto:faisalridwann@gmail.com?subject=Contact from ${formData.name}&body=${formData.message}`
    }

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>📧 Hubungi <span>Kami</span></h1>
                    <p className={styles.heroSubtitle}>Saran, masukan, atau kolaborasi? Kami siap mendengar.</p>
                </header>

                <div className={styles.contentGrid}>
                    {/* Contact Info */}
                    <div className={`neu-card no-hover ${styles.infoCard}`}>
                        <h2>Informasi Kontak</h2>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <Mail className={styles.icon} size={20} />
                                <div>
                                    <h3>Email</h3>
                                    <a href="mailto:faisalridwann@gmail.com">faisalridwann@gmail.com</a>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <Globe className={styles.icon} size={20} />
                                <div>
                                    <h3>Website</h3>
                                    <a href="https://qreatip.com" target="_blank" rel="noopener noreferrer">qreatip.com</a>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <MapPin className={styles.icon} size={20} />
                                <div>
                                    <h3>Lokasi</h3>
                                    <p>Jakarta, Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`neu-card no-hover ${styles.formCard}`}>
                        <h2>Kirim Pesan</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Nama</label>
                                <input
                                    type="text"
                                    placeholder="Nama Anda"
                                    required
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="email@contoh.com"
                                    required
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pesan</label>
                                <textarea
                                    placeholder="Tulis pesan Anda disini..."
                                    required
                                    rows={5}
                                    className={styles.textarea}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                <Send size={16} /> Kirim Pesan
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}
