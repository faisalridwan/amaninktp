'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FileImage, PenTool, BookOpen, Info, HelpCircle, FileStack, Shield, Library, Mail, Heart, FileText, Github, GitBranch, Minimize2, EyeOff, User, Scissors, QrCode, Move, RotateCw, ScissorsLineDashed, ChevronUp, Grid } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const otherProducts = [
        { href: '/redact', label: 'Sensor Data', icon: EyeOff },
        { href: '/compress', label: 'Kompres Foto', icon: Minimize2 },
        { href: '/remove-background', label: 'Hapus Background', icon: Scissors },
        { href: '/photo-generator', label: 'Photo Generator', icon: FileImage },
        { href: '/merge', label: 'Gabung Dokumen', icon: FileStack },
        { href: '/nik-parser', label: 'Cek NIK', icon: User },
        { href: '/qrcode', label: 'QR Generator', icon: QrCode },
        { href: '/split', label: 'Split Dokumen', icon: ScissorsLineDashed },
        { href: '/rearrange', label: 'Rearrange Dokumen', icon: Move },
        { href: '/rotate', label: 'Rotate Dokumen', icon: RotateCw },
    ]

    return (
        <footer className={styles.footer}>
            {/* CTA Section */}
            <div className={styles.ctaSection}>
                <div className={`container ${styles.ctaContainer}`}>
                    <div className={styles.ctaText}>
                        <h2>Siap Melindungi Dokumen Anda?</h2>
                        <p>Gratis, aman, dan mudah digunakan. Tidak perlu daftar.</p>
                    </div>
                    <div className={styles.ctaButtons}>
                        <Link href="/donate" className={styles.btnCtaPrimary}>
                            <Heart size={16} /> Donasi
                        </Link>
                        <Link href="/" className={styles.btnCtaSecondary}>
                            <FileImage size={16} /> Watermark
                        </Link>
                        <Link href="/signature" className={styles.btnCtaSecondary}>
                            <PenTool size={16} /> Tanda Tangan
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`container ${styles.footerContent}`}>
                {/* Brand */}
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>📄 Amanin Data</Link>
                    <p className={styles.tagline}>
                        Lindungi dokumen identitas Anda dengan watermark. 100% aman, tanpa upload ke server.
                    </p>
                </div>

                {/* Links Grid */}
                <div className={styles.linksGrid}>
                    {/* Produk Utama */}
                    <div className={styles.linkSection}>
                        <h4>Produk</h4>
                        <ul>
                            <li>
                                <Link href="/"><FileImage size={14} /> Watermark</Link>
                            </li>
                            <li>
                                <Link href="/signature"><PenTool size={14} /> Tanda Tangan</Link>
                            </li>
                            <li className={styles.footerDropdown} ref={dropdownRef}>
                                <button
                                    className={styles.dropdownBtn}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                        <Grid size={14} /> Produk Lainnya
                                    </div>
                                    <ChevronUp size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>
                                <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                                    {otherProducts.map((item) => (
                                        <Link key={item.href} href={item.href} className={styles.menuItem}>
                                            <item.icon size={16} /> {item.label}
                                        </Link>
                                    ))}
                                </div>
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
                            <li>
                                <Link href="/changelog"><GitBranch size={14} /> Changelog</Link>
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
                            <li>
                                <Link href="/privacy"><Shield size={14} /> Privasi</Link>
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
                    <a href="https://github.com/faisalridwan/amanindata" target="_blank" rel="noopener noreferrer">
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
