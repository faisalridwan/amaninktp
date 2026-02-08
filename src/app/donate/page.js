'use client'

import { Heart, HelpCircle, Shield, Globe, Zap, Coffee } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function DonatePage() {
    const faqs = [
        {
            q: "Mengapa dukungan Anda sangat berarti bagi AmaninKTP?",
            a: "AmaninKTP hadir sebagai solusi gratis dan terbuka untuk membantu masyarakat melindungi privasi dokumen mereka. Namun, operasional infrastruktur digital seperti perpanjangan nama domain (.com), biaya hosting, koneksi internet untuk development, serta pemeliharaan hardware tetap membutuhkan biaya rutin. Dukungan Anda adalah 'bahan bakar' yang memastikan alat ini tetap hidup, stabil, dan bisa terus dikembangkan untuk manfaat yang lebih luas."
        },
        {
            q: "Ke mana alokasi dana donasi disalurkan?",
            a: "Setiap Rupiah yang Anda berikan dialokasikan secara transparan untuk kebutuhan teknis proyek. Ini mencakup biaya langganan server, pembaruan keamanan sistem, riset fitur baru (seperti peningkatan algoritma watermark), serta memastikan AmaninKTP tetap kompatibel dengan berbagai perangkat dan browser terbaru."
        },
        {
            q: "Apakah AmaninKTP benar-benar akan tetap gratis selamanya?",
            a: "Tentu saja. Komitmen utama kami adalah menyediakan alat privasi yang bisa diakses siapa pun tanpa hambatan biaya (paywall). Donasi dari para pendukung adalah kunci utama yang memungkinkan kami menjaga model 'Gratis untuk Semua' ini tanpa harus mengorbankan privasi pengguna lewat iklan yang intrusif atau penjualan data."
        },
        {
            q: "Apakah proses donasi saya terjamin keamanannya?",
            a: "Sangat terjamin. Kami tidak mengelola dana atau menyimpan informasi kartu/rekening Anda secara langsung. Semua transaksi diproses melalui platform donasi pihak ketiga yang terpercaya dan memiliki izin resmi (seperti Saweria atau platform sejenis). Keamanan transaksi Anda dilindungi dengan enkripsi standar industri."
        },
        {
            q: "Selain materi, apa lagi yang bisa saya berikan untuk membantu?",
            a: "Dukungan tidak selalu harus berupa uang. Anda bisa membantu kami dengan melaporkan bug (masalah teknis), memberikan saran fitur baru, atau yang paling sederhana: menyebarkan informasi tentang AmaninKTP kepada teman dan keluarga agar lebih banyak orang menyadari pentingnya melindungi privasi dokumen."
        },
        {
            q: "Apakah donatur akan mendapatkan fitur eksklusif atau akun premium?",
            a: "Tidak, kami tidak menerapkan sistem 'Fitur Berbayar'. Seluruh fitur AmaninKTP tersedia secara penuh untuk setiap pengguna. Donasi yang Anda berikan adalah kontribusi murni (support) untuk mendukung keberlangsungan layanan agar tetap tersedia bagi publik secara cuma-cuma."
        },
        {
            q: "Berapa nominal minimal untuk berdonasi?",
            a: "Kami tidak menetapkan batas minimal. Kami percaya bahwa kebaikan tidak diukur dari angkanya, melainkan dari niat untuk membantu. Sekecil apa pun kontribusi Anda, hal tersebut sangat berharga dalam memperpanjang usia operasional AmaninKTP."
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                <div className={styles.donationPage}>
                    <header className={styles.hero}>
                        <h1 className={styles.heroTitle}>Dukung <span>AmaninKTP</span></h1>
                        <p className={styles.heroSubtitle}>
                            Bantu kami menjaga privasi dokumen masyarakat Indonesia tetap aman, gratis, dan open-source.
                        </p>
                    </header>

                    <div className={styles.card}>
                        <p className={styles.summary}>
                            AmaninKTP adalah proyek independen yang lahir dari kepedulian terhadap keamanan data pribadi.
                            Setiap baris kode ditulis untuk memastikan dokumen identitas Anda tetap menjadi milik Anda sepenuhnya.
                            Dukungan Anda sangat berarti bagi keberlangsungan proyek ini.
                        </p>

                        <div className={styles.donateAction}>
                            <a href="https://amaninktp.qreatip.com/donate" className={styles.donateBtn}>
                                <Heart size={20} /> Donasi Sekarang
                            </a>
                        </div>
                    </div>

                    <section className={styles.faqSection}>
                        <h2 className={styles.faqTitle}>
                            <HelpCircle size={24} /> Pertanyaan Yang Sering Diajukan
                        </h2>

                        <div className={styles.faqList}>
                            {faqs.map((faq, i) => (
                                <div key={i} className={styles.faqItem}>
                                    <h3>{faq.q}</h3>
                                    <p>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    )
}
