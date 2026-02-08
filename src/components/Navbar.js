'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar({ onDonateClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { href: '/watermark', label: 'Watermark KTP' },
        { href: '/signature', label: 'TTD Online' },
        { href: '/guide', label: 'Cara Pakai' },
        { href: '/privacy', label: 'Privacy' },
    ]

    const isActive = (href) => pathname === href

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContent}`}>
                <Link href="/" className={styles.logo}>
                    AmaninKTP
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span>{isMenuOpen ? '✕' : '☰'}</span>
                </button>

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            className={`${styles.navItem} ${styles.navCta}`}
                            onClick={() => {
                                setIsMenuOpen(false)
                                onDonateClick?.()
                            }}
                        >
                            Donasi ❤️
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
