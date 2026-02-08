import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer({ onDonateClick }) {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerLinks}>
                    <Link href="/guide">Cara Pakai</Link>
                    <Link href="/privacy">Privacy</Link>
                    <button onClick={onDonateClick} className={styles.donateLink}>
                        Donasi
                    </button>
                </div>
                <p className={styles.trustText}>
                    🔒 Aplikasi ini berjalan sepenuhnya di sisi pengguna. Data Anda aman.
                </p>
            </div>
        </footer>
    )
}
