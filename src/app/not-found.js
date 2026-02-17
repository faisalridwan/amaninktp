'use client'

import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
            background: 'var(--bg-primary)'
        }}>
            <AlertCircle size={64} color="#5B8DEF" style={{ marginBottom: '24px' }} />
            <h1 style={{ fontSize: '48px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 16px' }}>
                😕 404 - Halaman <span style={{ color: 'var(--primary-dark)' }}>Tidak Ditemukan</span>
            </h1>
            <h2 style={{ fontSize: '24px', color: 'var(--text-secondary)', margin: '0 0 24px', fontWeight: '500' }}>
                Halaman Tidak Ditemukan
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: '0 0 32px', maxWidth: '400px' }}>
                Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
            <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px'
            }}>
                <Home size={18} /> Kembali ke Beranda
            </Link>
        </div>
    )
}
