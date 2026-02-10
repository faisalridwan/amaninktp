import Link from 'next/link'
import styles from './GuideSection.module.css'

export default function GuideSection({
    title = "Bingung Caranya?",
    description = "Lihat panduan lengkap penggunaan tools ini.",
    linkHref = "/guide",
    btnText = "Panduan Lengkap",
    btnColor = "primary" // primary, green
}) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>

            <Link href={linkHref} className={`${styles.btn} ${styles[btnColor]}`}>
                {btnText}
            </Link>

            <p className={styles.disclaimer}>
                dengan menggunakan tools ini kamu menyetujui <Link href="/privacy-policy">Privacy Policy</Link> • <Link href="/terms">Terms of Service</Link>
            </p>
        </div>
    )
}
