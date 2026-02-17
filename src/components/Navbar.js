'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FileImage, PenTool, BookOpen, Shield, Info, Heart, Menu, X, Minimize2,
    EyeOff, User, Camera, ChevronDown, FileStack, Grid, Scissors, QrCode,
    Move, RotateCw, ScissorsLineDashed, Lock, Globe, RefreshCw, Trash2,
    Palette, Smartphone, FileDiff, Zap, ScanText
} from 'lucide-react'
import styles from './Navbar.module.css'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const timeoutRef = useRef(null)
    const pathname = usePathname()

    // Main Links (Left)
    const mainLinks = [
        { href: '/', label: 'Watermark', icon: FileImage },
        { href: '/signature', label: 'Tanda Tangan', icon: PenTool },
    ]

    // Product Dropdown Items
    const productItems = [
        { href: '/', label: 'Watermark Dokumen', icon: FileImage, desc: 'Tambahkan watermark pada scan dokumen agar aman.' },
        { href: '/signature', label: 'Tanda Tangan', icon: PenTool, desc: 'Buat tanda tangan digital transparan.' },
        { href: '/compress', label: 'Kompres Foto', icon: Minimize2, desc: 'Perkecil ukuran foto tanpa kurangi kualitas.' },
        { href: '/ocr', label: 'OCR (Image to Text)', icon: ScanText, desc: 'Ekstrak teks dari gambar secara instan.' },
        { href: '/image-converter', label: 'Image Converter', icon: RefreshCw, desc: 'Ubah format HEIC/WebP ke JPG/PNG.' },
        { href: '/remove-background', label: 'Hapus Background', icon: Scissors, desc: 'Hapus background foto otomatis dengan AI.' },
        { href: '/qrcode', label: 'QR Generator', icon: QrCode, desc: 'Buat kode QR kustom instan & aman.' },
        { href: '/nik-parser', label: 'Cek NIK', icon: User, desc: 'Cek informasi daerah & lahir dari NIK.' },
        { href: '/redact', label: 'Sensor Data', icon: EyeOff, desc: 'Sensor & blur data pribadi di dokumen.' },
        { href: '/merge', label: 'Gabung Dokumen', icon: FileStack, desc: 'Satukan banyak file PDF jadi satu.' },
        { href: '/mockup-generator', label: 'Device Mockup', icon: Smartphone, desc: 'Bingkai screenshot dengan frame HP/Laptop.' },
        { href: '/split', label: 'Split Dokumen', icon: ScissorsLineDashed, desc: 'Pisahkan halaman PDF jadi dokumen baru.' },
        { href: '/photo-generator', label: 'Photo Generator', icon: Camera, desc: 'Ubah ukuran & atur DPI pasfoto.' },
        { href: '/password-generator', label: 'Password Generator', icon: Lock, desc: 'Buat password super kuat & aman.' },
        { href: '/encrypt', label: 'File Encryptor', icon: Shield, desc: 'Enkripsi file rahasia dengan AES-GCM.' },
        { href: '/color-picker', label: 'Color Picker', icon: Palette, desc: 'Ambil kode warna dari gambar.' },
        { href: '/exif-remover', label: 'Hapus EXIF', icon: Trash2, desc: 'Hapus metadata lokasi & kamera dari foto.' },
        { href: '/diff-checker', label: 'Diff Checker', icon: FileDiff, desc: 'Bandingkan perbedaan dua teks.' },
        { href: '/ip-check', label: 'Cek IP Saya', icon: Globe, desc: 'Lihat public IP & info perangkat.' }
    ]

    // Info/Footer Items in Dropdown
    const infoItems = [
        { href: '/guide', label: 'Cara Pakai', icon: BookOpen },
        { href: '/privacy', label: 'Privasi', icon: Shield },
        { href: '/about', label: 'About', icon: Info },
    ]

    const isActive = (href) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(href)
    }

    const isProductActive = () => {
        // Dropdown inactive if on main links (Watermark / Signature) or if dropdown is closed
        const isMainLink = mainLinks.some(link =>
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
        )
        if (isMainLink) return false

        return productItems.some(item => pathname.startsWith(item.href))
    }

    const handleMouseEnter = () => {
        if (window.innerWidth > 900) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setIsDropdownOpen(true)
        }
    }

    const handleMouseLeave = () => {
        if (window.innerWidth > 900) {
            timeoutRef.current = setTimeout(() => {
                setIsDropdownOpen(false)
            }, 300) // 300ms delay
        }
    }

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContent}`}>
                <Link href="/" className={styles.logo}>
                    📄 Amanin Data
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
                    {/* Main Links */}
                    {mainLinks.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Mega Menu Dropdown */}
                    <li
                        className={styles.dropdownWrapper}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            className={`${styles.navItem} ${isDropdownOpen || isProductActive() ? styles.active : ''}`}
                            onClick={toggleDropdown}
                            style={{ width: '100%', justifyContent: 'flex-start' }} // Mobile adjustment
                        >
                            <Grid size={16} />
                            <span>Produk Lainnya</span>
                            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </span>
                        </button>

                        <div className={`${styles.dropdownContainer} ${isDropdownOpen ? styles.show : ''}`}>
                            <div className={styles.dropdownInner}>
                                <div className={styles.dropdownGrid}>
                                    {productItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`${styles.dropdownItem} ${isActive(item.href) ? styles.dropdownItemActive : ''}`}
                                            onClick={() => { setIsMenuOpen(false); setIsDropdownOpen(false); }}
                                        >
                                            <div className={styles.itemIcon}>
                                                <item.icon size={18} />
                                            </div>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemTitle}>{item.label}</span>
                                                <span className={styles.itemDesc}>{item.desc}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className={styles.dropdownFooter}>
                                    {infoItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={styles.footerLink}
                                            onClick={() => { setIsMenuOpen(false); setIsDropdownOpen(false); }}
                                        >
                                            <item.icon size={14} /> {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <Link
                            href="/donate"
                            className={`${styles.navItem} ${styles.navCta}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Heart size={16} />
                            <span>Donasi</span>
                        </Link>
                    </li>
                    <li className={styles.themeToggleItem}>
                        <ThemeToggle />
                    </li>
                </ul>
            </div>
        </nav>
    )
}
