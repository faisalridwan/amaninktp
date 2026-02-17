import Link from 'next/link'
import { Type, TextCursor, ArrowLeftRight, Key } from 'lucide-react'
import styles from './OtherToolsSection.module.css'

export default function OtherToolsSection() {
    const tools = [
        {
            href: '/case-converter',
            icon: Type,
            title: 'Case Converter',
            desc: 'Ubah huruf besar/kecil teks otomatis.'
        },
        {
            href: '/word-counter',
            icon: TextCursor,
            title: 'Word Counter',
            desc: 'Hitung kata, karakter & estimasi baca.'
        },
        {
            href: '/pdf-word',
            icon: ArrowLeftRight,
            title: 'PDF <-> Word',
            desc: 'Konversi PDF ke Word & sebaliknya.'
        },
        {
            href: '/pdf-security',
            icon: Key,
            title: 'Protect/Unlock PDF',
            desc: 'Kunci atau Buka password PDF aman.'
        }
    ]

    return (
        <section className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>Alat Lainnya</h2>
                <p className={styles.subtitle}>Jelajahi tools gratis lainnya untuk produktivitas Anda</p>
            </div>
            
            <div className={styles.grid}>
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <tool.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.cardTitle}>{tool.title}</h3>
                            <p className={styles.cardDesc}>{tool.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
