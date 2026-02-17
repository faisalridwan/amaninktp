'use client'

import { useState } from 'react'
import { Shield, Lock, Eye, Server, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function PrivacyPage() {
    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>🛡️ Kebijakan <span>Privasi</span></h1>
                    <p>Terakhir diperbarui: 08 Februari 2026</p>
                </header>

                <section className={`neu-card no-hover ${styles.content}`}>
                    <div className={styles.intro}>
                        <p>
                            Di Amanin Data, privasi Anda adalah prioritas utama kami. Kami memahami bahwa dokumen identitas
                            (seperti KTP, SIM, Paspor) adalah data yang sangat sensitif. Oleh karena itu, kami merancang
                            sistem yang <strong>100% Client-Side</strong>, artinya semua pemrosesan terjadi di perangkat Anda sendiri.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.highlightCard}>
                            <Server size={32} />
                            <h3>Tanpa Server</h3>
                            <p>Gambar yang Anda upload tidak pernah dikirim atau disimpan di server kami.</p>
                        </div>
                        <div className={styles.highlightCard}>
                            <Lock size={32} />
                            <h3>Enkripsi Lokal</h3>
                            <p>Semua proses watermark dan tanda tangan dilakukan oleh browser Anda.</p>
                        </div>
                        <div className={styles.highlightCard}>
                            <Eye size={32} />
                            <h3>Tanpa Pelacakan</h3>
                            <p>Kami tidak melacak isi dokumen atau menyimpan data pribadi Anda.</p>
                        </div>
                    </div>

                    <article className={styles.policyText}>
                        <h3>1. Pengumpulan Data</h3>
                        <p>
                            Kami <strong>TIDAK</strong> mengumpulkan, menyimpan, atau mentransmisikan gambar dokumen yang Anda proses menggunakan layanan Amanin Data.
                            Semua gambar diproses secara lokal di memori browser (RAM) perangkat Anda dan akan hilang seketika saat Anda menutup tab atau merefresh halaman.
                        </p>

                        <h3>2. Penggunaan Cookie</h3>
                        <p>
                            Kami menggunakan cookie standar hanya untuk fungsionalitas dasar website (seperti mengingat preferensi dark mode jika ada)
                            dan analitik anonim (seperti Google Analytics) untuk memantau performa website. Analitik ini tidak dapat mengidentifikasi Anda secara personal
                            atau melihat dokumen Anda.
                        </p>

                        <h3>3. Tautan Pihak Ketiga</h3>
                        <p>
                            Website kami mungkin berisi tautan ke situs web lain (misalnya qreatip.com). Jika Anda mengklik tautan pihak ketiga,
                            Anda akan diarahkan ke situs tersebut. Kami sangat menyarankan Anda untuk meninjau Kebijakan Privasi setiap situs yang Anda kunjungi.
                        </p>

                        <h3>4. Keamanan Keuangan</h3>
                        <p>
                            Untuk fitur donasi, kami menggunakan payment gateway pihak ketiga yang aman. Kami tidak menyimpan informasi kartu kredit
                            atau detail pembayaran Anda di server kami.
                        </p>

                        <h3>5. Perubahan Kebijakan</h3>
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami menyarankan Anda untuk meninjau halaman ini
                            secara berkala untuk setiap perubahan. Perubahan efektif segera setelah diposting di halaman ini.
                        </p>

                        <h3>6. Hubungi Kami</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="/contact">Kontak</a> atau email ke faisalridwann@gmail.com.
                        </p>
                    </article>
                </section>
            </main>

            <Footer />
        </>
    )
}
