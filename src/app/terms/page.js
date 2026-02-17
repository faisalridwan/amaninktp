'use client'

import { useState } from 'react'
import { FileText, CheckCircle, AlertTriangle, Scale, Users, Shield, Mail, Globe, Gavel, UserX, RefreshCw, Link2, MessageSquare } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function TermsPage() {
    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>⚖️ Syarat & <span>Ketentuan</span></h1>
                    <p>Terakhir diperbarui: 08 Februari 2026</p>
                </header>

                <section className={`neu-card no-hover ${styles.content}`}>
                    <div className={styles.intro}>
                        <p>
                            Terms of Service ("Syarat", "Syarat Layanan") ini mengatur hubungan Anda dengan website
                            https://amanindata.qreatip.com ("Layanan") yang dioperasikan oleh Amanin Data ("kami", "kita", atau "milik kami").
                        </p>
                        <p className={styles.important}>
                            <strong>Harap baca Syarat Layanan ini dengan seksama sebelum menggunakan Layanan.</strong>
                        </p>
                    </div>

                    <article className={styles.termsText}>
                        <h3><Scale size={20} /> Penerimaan Syarat</h3>
                        <p>
                            Akses dan penggunaan Layanan oleh Anda tergantung pada penerimaan dan kepatuhan Anda terhadap
                            Syarat ini. Syarat ini berlaku untuk semua pengunjung, pengguna, dan pihak lain yang mengakses
                            atau menggunakan Layanan.
                        </p>
                        <p>
                            Dengan mengakses atau menggunakan Layanan, Anda setuju untuk terikat oleh Syarat ini.
                            Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, maka Anda tidak boleh mengakses Layanan.
                        </p>

                        <h3><AlertTriangle size={20} /> Disclaimer (Penafian)</h3>
                        <p>
                            Penggunaan Layanan oleh Anda adalah atas risiko Anda sendiri. Layanan disediakan dengan basis
                            "APA ADANYA" dan "SEBAGAIMANA TERSEDIA". Layanan disediakan tanpa jaminan dalam bentuk apapun,
                            baik tersurat maupun tersirat, termasuk, namun tidak terbatas pada, jaminan tersirat atas
                            kelayakan jual, kesesuaian untuk tujuan tertentu, non-pelanggaran, atau kinerja.
                        </p>
                        <p>
                            Amanin Data, anak perusahaan, afiliasi, dan pemberi lisensinya tidak menjamin bahwa:
                        </p>
                        <ul>
                            <li>Layanan akan berfungsi tanpa gangguan, aman, atau tersedia pada waktu atau lokasi tertentu</li>
                            <li>Kesalahan atau cacat apapun akan diperbaiki</li>
                            <li>Layanan bebas dari virus atau komponen berbahaya lainnya</li>
                            <li>Hasil penggunaan Layanan akan memenuhi kebutuhan Anda</li>
                        </ul>

                        <h3><Link2 size={20} /> Tautan ke Situs Web Lain</h3>
                        <p>
                            Website kami mungkin berisi tautan ke situs web atau layanan pihak ketiga yang tidak dimiliki
                            atau dikendalikan oleh Amanin Data.
                        </p>
                        <p>
                            Amanin Data tidak memiliki kendali atas, dan tidak bertanggung jawab atas, konten, kebijakan privasi,
                            atau praktik situs web atau layanan pihak ketiga mana pun. Anda selanjutnya mengakui dan setuju
                            bahwa Amanin Data tidak bertanggung jawab, baik secara langsung maupun tidak langsung, atas kerusakan
                            atau kerugian yang disebabkan atau diduga disebabkan oleh atau sehubungan dengan penggunaan atau
                            ketergantungan pada konten, barang, atau layanan yang tersedia di atau melalui situs web atau layanan tersebut.
                        </p>
                        <p>
                            Kami sangat menyarankan Anda untuk membaca syarat dan ketentuan serta kebijakan privasi dari
                            situs web atau layanan pihak ketiga mana pun yang Anda kunjungi.
                        </p>

                        <h3><UserX size={20} /> Penghentian</h3>
                        <p>
                            Kami dapat menghentikan atau menangguhkan akses ke Layanan kami segera, tanpa pemberitahuan
                            atau tanggung jawab sebelumnya, untuk alasan apapun, termasuk tanpa batasan jika Anda melanggar Syarat.
                        </p>
                        <p>
                            Semua ketentuan dari Syarat yang menurut sifatnya harus tetap berlaku setelah penghentian
                            akan tetap berlaku setelah penghentian, termasuk, tanpa batasan, ketentuan kepemilikan,
                            penafian jaminan, ganti rugi, dan batasan tanggung jawab.
                        </p>

                        <h3><Users size={20} /> Penggunaan Situs</h3>
                        <p>
                            Pelecehan dalam bentuk atau cara apapun di situs, termasuk melalui e-mail, chat, atau dengan
                            menggunakan bahasa cabul atau kasar, dilarang keras. Peniruan identitas orang lain, termasuk
                            karyawan Amanin Data atau yang berlisensi, host, atau perwakilan, serta anggota atau pengunjung
                            lain di situs, dilarang.
                        </p>
                        <p>
                            Anda tidak boleh mengunggah ke, mendistribusikan, atau menerbitkan melalui situs konten apapun yang:
                        </p>
                        <ul>
                            <li>Bersifat memfitnah, mencemarkan nama baik, cabul, mengancam</li>
                            <li>Melanggar privasi atau hak publisitas</li>
                            <li>Bersifat kasar, ilegal, atau tidak pantas</li>
                            <li>Dapat merupakan atau mendorong tindak pidana</li>
                            <li>Melanggar hak pihak mana pun</li>
                            <li>Dapat menimbulkan tanggung jawab atau melanggar hukum apapun</li>
                        </ul>
                        <p>
                            Anda tidak boleh mengunggah konten komersial di situs atau menggunakan situs untuk
                            mengajak orang lain bergabung atau menjadi anggota layanan online komersial lainnya atau organisasi lain.
                        </p>

                        <h3><Shield size={20} /> Ganti Rugi (Indemnifikasi)</h3>
                        <p>
                            Anda setuju untuk mengganti rugi, membela, dan membebaskan Amanin Data, pejabat, direktur,
                            karyawan, agen, pemberi lisensi, dan pemasoknya (secara kolektif "Penyedia Layanan") dari
                            dan terhadap semua kerugian, biaya, kerusakan, dan ongkos, termasuk biaya pengacara yang
                            wajar, yang diakibatkan oleh pelanggaran syarat dan ketentuan ini atau aktivitas apapun
                            yang terkait dengan akun Anda (termasuk perilaku lalai atau salah) oleh Anda atau orang
                            lain yang mengakses situs menggunakan akun Internet Anda.
                        </p>

                        <h3><RefreshCw size={20} /> Perubahan</h3>
                        <p>
                            Kami berhak, atas kebijakan kami sendiri, untuk memodifikasi atau mengganti Syarat ini kapan saja.
                            Jika revisi bersifat material, kami akan berusaha memberikan pemberitahuan setidaknya 30 hari
                            sebelum syarat baru berlaku. Apa yang merupakan perubahan material akan ditentukan atas
                            kebijakan kami sendiri.
                        </p>
                        <p>
                            Dengan terus mengakses atau menggunakan Layanan kami setelah revisi tersebut berlaku,
                            Anda setuju untuk terikat oleh syarat yang direvisi. Jika Anda tidak setuju dengan syarat baru,
                            Anda tidak lagi diizinkan untuk menggunakan Layanan.
                        </p>

                        <h3><Gavel size={20} /> Hukum yang Berlaku</h3>
                        <p>
                            Syarat ini akan diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia,
                            tanpa memperhatikan ketentuan konflik hukumnya.
                        </p>
                        <p>
                            Kegagalan kami untuk menegakkan hak atau ketentuan apapun dari Syarat ini tidak akan
                            dianggap sebagai pengabaian hak-hak tersebut. Jika ada ketentuan dari Syarat ini yang
                            dianggap tidak valid atau tidak dapat dilaksanakan oleh pengadilan, ketentuan lainnya
                            dari Syarat ini akan tetap berlaku.
                        </p>

                        <h3><MessageSquare size={20} /> Hubungi Kami</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Syarat Layanan ini, silakan hubungi kami:
                        </p>
                        <ul>
                            <li>Melalui halaman <a href="/contact">Kontak</a></li>
                            <li>Email: faisalridwann@gmail.com</li>
                            <li>Instagram: <a href="https://instagram.com/faisalridwan" target="_blank" rel="noopener noreferrer">@faisalridwan</a></li>
                        </ul>
                    </article>
                </section>
            </main>

            <Footer />
        </>
    )
}
