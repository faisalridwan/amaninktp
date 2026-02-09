'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileImage, PenTool, BookOpen, Shield, Info, Heart, Menu, X, Minimize2, EyeOff, User, Camera, ChevronDown, Grid } from 'lucide-react'
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
        { href: '/', label: 'Watermark KTP', icon: FileImage, desc: 'Tambahkan watermark pada scan dokumen agar aman.' },
        { href: '/signature', label: 'Tanda Tangan', icon: PenTool, desc: 'Buat tanda tangan digital transparan dan tambahkan langsung ke dokumen.' },
        { href: '/compress', label: 'Kompres Foto', icon: Minimize2, desc: 'Perkecil ukuran foto tanpa kurangi kualitas.' },
        { href: '/redact', label: 'Sensor Data', icon: EyeOff, desc: 'Sensor & blur data pribadi di dokumen.' },
        { href: '/merge', label: 'Gabung Dokumen', icon: FileImage, desc: 'Satukan banyak file PDF dan gambar jadi satu.' },
        { href: '/nik-parser', label: 'Cek NIK', icon: User, desc: 'Cek informasi daerah & lahir dari NIK.' },
        { href: '/photo-generator', label: 'Pas Foto', icon: Camera, desc: 'Buat pas foto otomatis background merah/biru.' },
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
