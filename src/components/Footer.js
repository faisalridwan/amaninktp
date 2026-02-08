'use client'

import Link from 'next/link'
import { FileImage, PenTool, BookOpen, Info, HelpCircle, Shield, Library, Newspaper, Mail, Heart } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer({ onDonateClick }) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContent}`}>
                {/* Brand */}
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>AmaninKTP</Link>
                    <p className={styles.tagline}>
                        Lindungi dokumen identitas Anda dengan watermark. 100% aman, tanpa upload ke server.
                    </p>
                </div>

                {/* Links Grid */}
                <div className={styles.linksGrid}>
                    {/* Produk */}
                    <div className={styles.linkSection}>
                        <h4>Produk</h4>
                        <ul>
                            <li>
                                <Link href="/"><FileImage size={14} /> Watermark KTP</Link>
                            </li>
                            <li>
                                <Link href="/signature"><PenTool size={14} /> Tanda Tangan</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Dokumentasi */}
                    <div className={styles.linkSection}>
                        <h4>Dokumentasi</h4>
                        <ul>
                            <li>
                                <Link href="/guide"><BookOpen size={14} /> Cara Pakai</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tentang */}
                    <div className={styles.linkSection}>
                        <h4>Tentang</h4>
                        <ul>
                            <li>
                                <Link href="/about"><Info size={14} /> About</Link>
                            </li>
                            <li>
                                <Link href="/guide#faq"><HelpCircle size={14} /> FAQ</Link>
                            </li>
                            <li>
                                <Link href="/privacy"><Shield size={14} /> Kebijakan Privasi</Link>
                            </li>
                            <li>
                                <Link href="/libraries"><Library size={14} /> Perpustakaan</Link>
                            </li>
                            <li>
                                <Link href="/press"><Newspaper size={14} /> Pers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div className={styles.linkSection}>
                        <h4>Kontak</h4>
                        <ul>
                            <li>
                                <Link href="/contact"><Mail size={14} /> Hubungi Kami</Link>
                            </li>
                            <li>
                                <button onClick={onDonateClick} className={styles.donateLink}>
                                    <Heart size={14} /> Donasi
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className="container">
                    <p>© {currentYear} AmaninKTP. Karya lokal Indonesia 🇮🇩</p>
                    <p className={styles.securityNote}>🔒 Aplikasi berjalan 100% di browser. Data Anda aman.</p>
                </div>
            </div>
        </footer>
    )
}
