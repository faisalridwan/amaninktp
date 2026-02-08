'use client'

import Link from 'next/link'
import { FileImage, PenTool, BookOpen, Info, HelpCircle, Shield, Library, Mail, Heart, FileText, Github } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
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
                                <Link href="/"><FileImage size={14} /> Watermark Dokumen</Link>
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
                                <Link href="/libraries"><Library size={14} /> Perpustakaan</Link>
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
                                <Link href="/donate" className={styles.donateLink}>
                                    <Heart size={14} /> Donasi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Legal Links */}
            <div className={styles.legalBar}>
                <div className={`container ${styles.legalContent}`}>
                    <Link href="/privacy-policy"><Shield size={14} /> Privacy Policy</Link>
                    <span className={styles.divider}>•</span>
                    <Link href="/terms"><FileText size={14} /> Terms of Service</Link>
                    <span className={styles.divider}>•</span>
                    <a href="https://github.com/faisalridwan/amaninktp" target="_blank" rel="noopener noreferrer">
                        <Github size={14} /> GitHub
                    </a>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className="container">
                    <div className={styles.copyright}>
                        Dibuat dengan ❤️ oleh <a href="https://qreatip.com" target="_blank" rel="noopener noreferrer">qreatip.com</a> & <a href="https://instagram.com/faisalridwan" target="_blank" rel="noopener noreferrer">Faisal Ridwan</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
