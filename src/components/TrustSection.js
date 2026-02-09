import styles from './TrustSection.module.css'
import { Shield, Smartphone, Flag } from 'lucide-react'
// Note: Lucide icons might be different, checking what user has.
// User didn't specify icons but text. I'll use text with emoji for now to be safe and dependency-free, or basic structure.
// Wait, user used emoji in prompt: 🔒 🚫 🇮🇩. I will use those.

export default function TrustSection() {
    return (
        <div className={styles.trustContainer}>
            <div className={styles.trustItem}>
                <span className={styles.icon}>🔒</span> 100% Client-Side
            </div>
            <div className={styles.trustItem}>
                <span className={styles.icon}>🚫</span> Tanpa Upload Server
            </div>
            <div className={styles.trustItem}>
                <span className={styles.icon}>🇮🇩</span> Karya Lokal
            </div>
        </div>
    )
}
