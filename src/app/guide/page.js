'use client'

import { useState } from 'react'
import { BookOpen, AlertTriangle, Lightbulb, MousePointer, Info, Shield, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function GuidePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    // Using an array of objects for steps to ensure control over rendering
    const watermarkSteps = [
        {
            title: 'Buka Aplikasi & Siapkan Dokumen',
            desc: 'Akses halaman utama AmaninKTP. Anda tidak perlu mendaftar atau login. Siapkan file KTP atau dokumen penting lainnya (format JPG, PNG) yang ingin Anda beri watermark.'
        },
        {
            title: 'Upload Dokumen',
            desc: 'Klik area upload di tengah layar, atau tarik dan lepas (drag & drop) file gambar Anda ke area tersebut. Sistem akan langsung menampilkan preview dokumen Anda dengan aman (diproses di browser, tidak diupload ke server).'
        },
        {
            title: 'Crop & Potong (Opsional)',
            desc: 'Jika foto dokumen Anda terlalu lebar atau ada background yang mengganggu, aktifkan mode Crop. Tarik sudut-sudut grid untuk memotong bagian yang tidak diinginkan, lalu klik "Selesai Crop" untuk memfokuskan tampilan pada dokumen saja.'
        },
        {
            title: 'Pilih Mode Watermark',
            desc: 'Tentukan jenis perlindungan yang Anda inginkan:\n• **Mode Menyeluruh (Tiled)**: Watermark akan memenuhi seluruh halaman dengan pola berulang. Ini memberikan perlindungan maksimal karena sulit dihapus.\n• **Mode Satu Teks**: Menempatkan satu watermark di posisi spesifik yang Anda tentukan.'
        },
        {
            title: 'Isi Teks & Tujuan',
            desc: 'Ketik teks watermark Anda, misalnya "VERIFIKASI PINJOL 2024" atau "UNTUK LAMARAN KERJA". Gunakan tombol bantuan "+ Tanggal Hari Ini" untuk otomatis menambahkan tanggal saat ini agar dokumen tidak bisa disalahgunakan di masa depan.'
        },
        {
            title: 'Kustomisasi Tampilan',
            desc: 'Sesuaikan agar watermark terbaca jelas namun tidak menutupi informasi vital:\n• **Rotasi**: Miringkan teks agar menutupi area penting.\n• **Warna & Opasitas**: Pilih warna (Hitam/Putih/Merah) dan atur transparansi.\n• **Ukuran Font**: Sesuaikan besar kecilnya teks.\n• **Style**: Pilih font yang tegas dan mudah dibaca.'
        },
        {
            title: 'Download & Simpan',
            desc: 'Periksa kembali hasil watermark di preview. Jika sudah sesuai, klik tombol **Download Gambar** untuk menyimpan hasilnya ke perangkat Anda.'
        }
    ]

    const signatureSteps = [
        {
            title: 'Masuk ke Menu Tanda Tangan',
            desc: 'Klik menu **Tanda Tangan** di navigasi atas. Halaman ini didesain khusus untuk membuat tanda tangan digital dan menempelkannya ke dokumen PDF atau Gambar.'
        },
        {
            title: 'Langkah 1: Buat Tanda Tangan',
            desc: 'Di area "Buat Tanda Tangan Baru", goreskan tanda tangan Anda pada kanvas putih menggunakan mouse, trackpad, atau layar sentuh (stylus/jari). Anda bisa mengatur:\n• **Warna Pena**: Hitam, Biru, atau Merah.\n• **Ketebalan**: Geser slider untuk mengatur ketebalan garis.'
        },
        {
            title: 'Simpan Tanda Tangan',
            desc: 'Jika hasil goresan sudah sesuai, beri nama (opsional) lalu klik **Simpan Tanda Tangan**. Tanda tangan Anda akan tersimpan di daftar "Tanda Tangan Tersimpan" di bawah kanvas untuk dipakai berulang kali.'
        },
        {
            title: 'Langkah 2: Upload Dokumen',
            desc: 'Gulir ke bawah ke bagian "Tambahkan ke Dokumen". Upload file yang ingin ditandatangani (mendukung file Gambar JPG/PNG dan dokumen PDF multi-halaman). Dokumen akan muncul di area kerja.'
        },
        {
            title: 'Pilih Tanda Tangan Aktif',
            desc: 'Pilih salah satu tanda tangan dari daftar "Pilih Tanda Tangan" yang sudah Anda buat sebelumnya. Tanda tangan yang aktif akan ditandai dengan centang hijau.'
        },
        {
            title: 'Tempel Tanda Tangan (Drag-to-Select)',
            desc: 'Untuk menempelkan tanda tangan dengan presisi:\n1. Arahkan mouse ke area dokumen yang diinginkan.\n2. **Klik dan Tahan (Drag)** mouse Anda membentuk kotak seleksi.\n3. Lepaskan mouse, dan tanda tangan akan otomatis muncul pas di dalam kotak yang Anda buat.\n\nAlternatif: Klik tombol **Tambah Tanda Tangan** untuk memunculkan tanda tangan di posisi default.'
        },
        {
            title: 'Sesuaikan Posisi & Ukuran',
            desc: 'Setelah tanda tangan muncul di dokumen:\n• **Pindahkan**: Klik dan geser tanda tangan ke posisi yang tepat.\n• **Ubah Ukuran**: Tarik ujung kanan bawah tanda tangan untuk membesarkan atau mengecilkan.\n• **Hapus**: Klik tanda "X" merah jika ingin membatalkan.'
        },
        {
            title: 'Download Hasil',
            desc: 'Setelah semua tanda tangan terpasang dengan benar, klik tombol **Download PDF** (untuk file PDF) atau **Download PNG** (per halaman) untuk menyimpan dokumen yang sudah ditandatangani ke perangkat Anda.'
        }
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}><BookOpen size={32} /> Cara Pakai</h1>
                    <p className={styles.heroSubtitle}>Panduan lengkap mengamankan dokumen Anda dengan AmaninKTP</p>
                </header>

                <div className={styles.guideWrapper}>
                    {/* Sidebar Navigation */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarSticky}>
                            <h3 className={styles.sidebarTitle}>Isi Konten</h3>
                            <ul className={styles.sidebarNav}>
                                <li>
                                    <a href="#watermark-guide">
                                        <Shield size={16} /> Watermark Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#signature-guide">
                                        <MousePointer size={16} /> Tanda Tangan
                                    </a>
                                </li>
                                <li>
                                    <a href="#security-tips">
                                        <Lightbulb size={16} /> Tips Keamanan
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <div className={styles.contentArea}>
                        <div className={styles.guidesGrid}>
                            {/* Watermark Guide */}
                            <div id="watermark-guide" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Shield size={24} className={styles.iconBlue} />
                                    <h2>Panduan Watermark Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {watermarkSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/" className={styles.actionBtn}>Coba Watermark Sekarang</a>
                                </div>
                            </div>

                            {/*     Signature Guide */}
                            <div id="signature-guide" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <MousePointer size={24} className={styles.iconBlue} />
                                    <h2>Panduan Tanda Tangan</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {signatureSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/signature" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buat Tanda Tangan</a>
                                </div>
                            </div>
                        </div>

                        {/* Tips Section */}
                        <section id="security-tips" className={styles.tipsSection}>
                            <h2 className={styles.sectionTitle}><Lightbulb size={24} /> Tips Keamanan Dokumen</h2>
                            <div className={styles.tipsGrid}>
                                <div className={styles.tipCard}>
                                    <AlertTriangle size={24} className={styles.iconWarning} />
                                    <div>
                                        <h3>Jangan Polos</h3>
                                        <p>Jangan pernah mengirim foto KTP/SIM "polos" tanpa watermark ke pihak yang tidak dikenal atau via chat sembarangan.</p>
                                    </div>
                                </div>
                                <div className={styles.tipCard}>
                                    <Info size={24} className={styles.iconInfo} />
                                    <div>
                                        <h3>Tulis Tujuan Spesifik</h3>
                                        <p>Di watermark, tuliskan: "UNTUK VERIFIKASI [NAMA_APLIKASI] SAJA". Ini mempersulit penyalahgunaan untuk aplikasi lain.</p>
                                    </div>
                                </div>
                                <div className={styles.tipCard}>
                                    <CheckCircle size={24} className={styles.iconSuccess} />
                                    <div>
                                        <h3>Posisi Strategis</h3>
                                        <p>Pastikan watermark menutupi sebagian data penting (tapi tetap terbaca) agar tidak bisa dicrop atau dihapus dengan mudah.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* FAQ */}
                <section id="faq" className={styles.faqSection}>
                    <h2 className={styles.sectionTitle}>Pertanyaan Umum (FAQ)</h2>
                    <div className={styles.faqGrid}>
                        <details className={styles.faqItem}>
                            <summary>Apakah data saya disimpan di server?</summary>
                            <p><strong>Tidak sama sekali.</strong> AmaninKTP bekerja 100% di browser Anda (Client-Side). File gambar Anda tidak pernah diupload ke internet. Saat Anda menutup tab, data hilang.</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Apakah aplikasi ini gratis?</summary>
                            <p><strong>Ya, AmaninKTP 100% gratis</strong> tanpa biaya tersembunyi dan tanpa langganan. Kami berkomitmen untuk tetap menyediakan layanan ini secara gratis bagi semua pengguna.</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Apakah akan ada iklan di website ini?</summary>
                            <p>Untuk menjaga kelangsungan layanan dan biaya operasional server, <strong>kemungkinan akan ada iklan</strong> yang ditampilkan di website ini ke depannya. Namun, kami akan memastikan iklan tidak mengganggu pengalaman pengguna dan fungsi utama aplikasi tetap berjalan dengan baik.</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Bagaimana cara mendukung AmaninKTP?</summary>
                            <p>Anda dapat mendukung pengembangan AmaninKTP dengan <strong>berdonasi</strong> melalui tombol "Donasi" di menu. Dukungan Anda membantu kami membiayai server, pengembangan fitur baru, dan menjaga layanan tetap gratis untuk semua orang.</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Bagaimana cara menghapus watermark?</summary>
                            <p>Tujuan watermark adalah <strong>agar sulit dihapus</strong> demi keamanan. Kami tidak menyediakan fitur penghapus watermark.</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Apakah bisa di HP / Tablet?</summary>
                            <p>Bisa! AmaninKTP responsif dan ringan, bisa dibuka di browser Android (Chrome) maupun iOS (Safari).</p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>Kemana donasi akan digunakan?</summary>
                            <p>Donasi akan digunakan untuk: <strong>biaya server dan hosting</strong>, pengembangan fitur baru, pemeliharaan dan keamanan website, serta biaya operasional lainnya agar layanan tetap berjalan lancar.</p>
                        </details>
                    </div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
