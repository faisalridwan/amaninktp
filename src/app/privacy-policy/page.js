'use client'

import { useState } from 'react'
import { Shield, Database, Cookie, Globe, Lock, Users, RefreshCw, Mail, Eye, Server, FileText, AlertTriangle, ExternalLink } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function PrivacyPolicyPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1><Shield size={32} /> Privacy Policy</h1>
                    <p>Terakhir diperbarui: 08 Februari 2026</p>
                </header>

                <section className={`neu-card no-hover ${styles.content}`}>
                    <div className={styles.intro}>
                        <p>
                            AmaninKTP ("kami", "kita", atau "milik kami") mengoperasikan website amaninktp.qreatip.com
                            (selanjutnya disebut sebagai "Layanan"). Halaman ini memberitahu Anda tentang kebijakan kami
                            mengenai pengumpulan, penggunaan, dan pengungkapan data non-identifikasi pribadi ketika
                            Anda menggunakan Layanan kami dan pilihan-pilihan yang Anda miliki terkait dengan data tersebut.
                        </p>
                        <p>
                            Kami menggunakan data non-identifikasi pribadi Anda untuk menyediakan dan meningkatkan Layanan.
                            Dengan menggunakan Layanan, Anda setuju dengan pengumpulan dan penggunaan informasi sesuai
                            dengan kebijakan ini. Kecuali ditentukan lain dalam Kebijakan Privasi ini, istilah-istilah
                            yang digunakan dalam Kebijakan Privasi ini memiliki arti yang sama seperti dalam Syarat dan
                            Ketentuan kami, yang dapat diakses dari https://amaninktp.qreatip.com/terms/.
                        </p>
                    </div>

                    <article className={styles.policyText}>
                        <h3><FileText size={20} /> Definisi</h3>
                        <ul className={styles.definitions}>
                            <li>
                                <strong>Layanan:</strong> merujuk pada Website amaninktp.qreatip.com.
                            </li>
                            <li>
                                <strong>Data Non-PII:</strong> informasi non-identifikasi pribadi adalah data yang tidak dapat
                                digunakan sendiri untuk melacak atau mengidentifikasi seseorang.
                            </li>
                            <li>
                                <strong>Data Pribadi:</strong> berarti data tentang individu hidup yang dapat diidentifikasi
                                dari data tersebut (atau dari data tersebut dan informasi lain yang ada dalam kepemilikan kami
                                atau mungkin akan datang ke dalam kepemilikan kami).
                            </li>
                            <li>
                                <strong>Data Penggunaan:</strong> adalah data yang dikumpulkan secara otomatis baik yang
                                dihasilkan oleh penggunaan Layanan atau dari infrastruktur Layanan itu sendiri
                                (misalnya, durasi kunjungan halaman).
                            </li>
                            <li>
                                <strong>Cookies:</strong> adalah file kecil yang disimpan di perangkat Anda (komputer atau perangkat seluler).
                            </li>
                            <li>
                                <strong>Pengontrol Data:</strong> berarti orang atau badan hukum yang (baik sendiri atau bersama
                                atau bersama-sama dengan orang lain) menentukan tujuan dan cara pemrosesan informasi pribadi
                                apa pun. Untuk tujuan Kebijakan Privasi ini, kami adalah Pengontrol Data dari Data Non-PII.
                            </li>
                            <li>
                                <strong>Pemroses Data (atau Penyedia Layanan):</strong> berarti orang atau badan hukum yang
                                memproses data atas nama Pengontrol Data. Kami dapat menggunakan layanan berbagai Penyedia
                                Layanan untuk memproses Data Non-PII dengan lebih efektif.
                            </li>
                            <li>
                                <strong>Subjek Data (atau Pengguna):</strong> adalah individu hidup yang menggunakan Layanan
                                kami dan menjadi subjek Data Non-PII.
                            </li>
                        </ul>

                        <h3><Database size={20} /> Data Non-PII</h3>
                        <p>
                            Saat menggunakan Layanan kami, kami mungkin mengumpulkan Data Non-PII untuk meningkatkan dan
                            memelihara Layanan. Data Non-PII dapat mencakup, namun tidak terbatas pada:
                        </p>
                        <ul>
                            <li>Alamat IP yang dianonimkan</li>
                            <li>Data Penggunaan</li>
                        </ul>
                        <p>
                            Kami juga dapat mengumpulkan informasi tentang bagaimana Layanan diakses dan digunakan ("Data Penggunaan").
                            Data Penggunaan ini dapat mencakup informasi seperti alamat Protokol Internet komputer Anda
                            (misalnya alamat IP yang dianonimkan), jenis browser, versi browser, halaman Layanan kami yang
                            Anda kunjungi, waktu dan tanggal kunjungan Anda, waktu yang dihabiskan di halaman tersebut,
                            pengenal perangkat unik, dan data diagnostik lainnya.
                        </p>

                        <h3><Cookie size={20} /> Data Pelacakan & Cookies</h3>
                        <p>
                            Kami tidak menggunakan cookies dan menyimpan data dengan menggunakan beberapa hash kompleks yang
                            tidak terkait untuk melacak kunjungan ke situs kami dan halaman di dalamnya.
                        </p>

                        <h3><Eye size={20} /> Penggunaan Data</h3>
                        <p>AmaninKTP menggunakan data yang dikumpulkan untuk berbagai tujuan:</p>
                        <ul>
                            <li>Untuk menyediakan dan memelihara Layanan</li>
                            <li>Untuk menyediakan analisis atau informasi berharga sehingga kami dapat meningkatkan Layanan</li>
                            <li>Untuk memantau penggunaan Layanan</li>
                            <li>Untuk mendeteksi, mencegah, dan mengatasi masalah teknis</li>
                        </ul>

                        <h3><Server size={20} /> Retensi Data</h3>
                        <p>
                            Kami akan menyimpan Data Non-PII hanya selama diperlukan untuk tujuan yang ditetapkan dalam
                            Kebijakan Privasi ini. Kami akan menyimpan dan menggunakan informasi tersebut sejauh yang
                            diperlukan untuk mematuhi kewajiban hukum kami (misalnya, jika kami diwajibkan untuk menyimpan
                            data untuk mematuhi hukum yang berlaku), menyelesaikan perselisihan, dan menegakkan perjanjian
                            dan kebijakan hukum kami.
                        </p>

                        <h3><Globe size={20} /> Transfer Data</h3>
                        <p>
                            Informasi Anda yang disamarkan, termasuk Data Non-PII, dapat ditransfer ke — dan dipelihara di —
                            komputer yang berlokasi di luar negara bagian, provinsi, negara, atau yurisdiksi pemerintah
                            lain di mana undang-undang perlindungan data mungkin berbeda dari yurisdiksi Anda.
                        </p>
                        <p>
                            Jika Anda berada di luar Indonesia dan memilih untuk memberikan informasi kepada kami, harap
                            perhatikan bahwa kami mentransfer data, termasuk Non-PII, ke Indonesia dan memprosesnya di sana.
                        </p>
                        <p>
                            Persetujuan Anda terhadap Kebijakan Privasi ini diikuti dengan penyerahan informasi tersebut
                            merupakan persetujuan Anda terhadap transfer tersebut.
                        </p>

                        <h3><Lock size={20} /> Pengungkapan untuk Penegakan Hukum</h3>
                        <p>
                            Dalam keadaan tertentu, AmaninKTP mungkin diwajibkan untuk mengungkapkan Data Non-PII jika
                            diwajibkan oleh hukum atau sebagai respons terhadap permintaan yang sah oleh otoritas publik
                            (misalnya pengadilan atau lembaga pemerintah).
                        </p>
                        <p>AmaninKTP dapat mengungkapkan Data Non-PII dengan keyakinan yang baik bahwa tindakan tersebut diperlukan untuk:</p>
                        <ul>
                            <li>Mematuhi kewajiban hukum</li>
                            <li>Melindungi dan membela hak atau properti AmaninKTP</li>
                            <li>Mencegah atau menyelidiki kemungkinan kesalahan sehubungan dengan Layanan</li>
                            <li>Melindungi keselamatan pribadi pengguna Layanan atau publik</li>
                            <li>Melindungi dari tanggung jawab hukum</li>
                        </ul>

                        <h3><Shield size={20} /> Keamanan Data</h3>
                        <p>
                            Keamanan data Anda penting bagi kami, tetapi ingat bahwa tidak ada metode transmisi melalui
                            Internet, atau metode penyimpanan elektronik yang 100% aman. Meskipun kami berusaha menggunakan
                            cara yang dapat diterima secara komersial untuk melindungi Data Pribadi Anda, kami tidak dapat
                            menjamin keamanan absolutnya.
                        </p>

                        <h3><Users size={20} /> Penyedia Layanan</h3>
                        <p>
                            Kami dapat mempekerjakan perusahaan dan individu pihak ketiga untuk memfasilitasi Layanan kami
                            ("Penyedia Layanan"), untuk menyediakan Layanan atas nama kami, untuk melakukan layanan terkait
                            Layanan, atau untuk membantu kami dalam menganalisis bagaimana Layanan kami digunakan.
                        </p>
                        <p>
                            Pihak ketiga ini memiliki akses ke Data Non-PII hanya untuk melakukan tugas-tugas ini atas nama
                            kami dan diwajibkan untuk tidak mengungkapkan atau menggunakannya untuk tujuan lain.
                        </p>

                        <h3><ExternalLink size={20} /> Tautan ke Situs Lain</h3>
                        <p>
                            Layanan kami mungkin berisi tautan ke situs lain yang tidak dioperasikan oleh kami. Jika Anda
                            mengklik tautan pihak ketiga, Anda akan diarahkan ke situs pihak ketiga tersebut. Kami sangat
                            menyarankan Anda untuk meninjau Kebijakan Privasi setiap situs yang Anda kunjungi.
                        </p>
                        <p>
                            Kami tidak memiliki kendali atas dan tidak bertanggung jawab atas konten, kebijakan privasi,
                            atau praktik situs atau layanan pihak ketiga mana pun.
                        </p>

                        <h3><AlertTriangle size={20} /> Privasi Anak-Anak</h3>
                        <p>
                            Layanan kami tidak ditujukan untuk siapa pun yang berusia di bawah 13 tahun ("Anak-anak").
                        </p>
                        <p>
                            Kami tidak dengan sengaja mengumpulkan informasi yang dapat diidentifikasi secara pribadi dari
                            siapa pun yang berusia di bawah 13 tahun. Jika Anda adalah orang tua atau wali dan Anda mengetahui
                            bahwa Anak Anda telah memberikan kepada kami Data Pribadi, silakan hubungi kami. Jika kami
                            mengetahui bahwa kami telah mengumpulkan Data Pribadi dari anak-anak tanpa verifikasi persetujuan
                            orang tua, kami mengambil langkah-langkah untuk menghapus informasi tersebut dari server kami.
                        </p>

                        <h3><RefreshCw size={20} /> Perubahan Kebijakan Privasi Ini</h3>
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahu Anda
                            tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini.
                        </p>
                        <p>
                            Kami akan memberi tahu Anda melalui posting media sosial dan/atau pemberitahuan mencolok di
                            Layanan kami, sebelum perubahan berlaku dan memperbarui "tanggal efektif" di bagian atas
                            Kebijakan Privasi ini.
                        </p>
                        <p>
                            Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan.
                            Perubahan Kebijakan Privasi ini berlaku efektif ketika diposting di halaman ini.
                        </p>

                        <h3><Mail size={20} /> Hubungi Kami</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
                        </p>
                        <ul>
                            <li>Melalui halaman <a href="/contact">Kontak</a></li>
                            <li>Email: faisalridwann@gmail.com</li>
                            <li>Instagram: <a href="https://instagram.com/faisalridwan" target="_blank" rel="noopener noreferrer">@faisalridwan</a></li>
                        </ul>
                    </article>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
