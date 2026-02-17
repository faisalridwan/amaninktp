
import HomeClient from './HomeClient'

export const metadata = {
    title: 'Amanin Data - Watermark KTP, Tanda Tangan Digital & Edit PDF Aman', // Specific title for Home
    description: 'Platform privasi digital #1 di Indonesia. Edit PDF, Watermark Dokumen, Tanda Tangan Digital, Hapus Background, dan Kompres Foto secara aman. 100% diproses di browser (Client-Side) tanpa upload ke server.',
    keywords: 'watermark ktp, tanda tangan digital, edit pdf, hapus background, kompres pdf, kompres foto, sensor data, redact pdf, amanin data, privasi data, client-side, tanpa upload, gratis',
    alternates: {
        canonical: '/', // Explicit canonical for home
    },
    // OpenGraph & Twitter will inherit from layout.js, but we can override specific fields if needed.
    // Since Layout provides good defaults, we only strictly need to override if the Home page needs a *different* image or title structure.
    // However, user asked to "maximize" capabilities, so being explicit here is safe too.
    openGraph: {
        title: 'Amanin Data - Platform Privasi & Edit Dokumen Aman',
        description: 'Edit PDF, Watermark Dokumen, dan Tanda Tangan Digital langsung di browser. Data Anda tidak pernah dikirim ke server kami. 100% Aman & Gratis.',
        url: 'https://amanindata.qreatip.com',
        siteName: 'Amanin Data',
        locale: 'id_ID',
        type: 'website',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Amanin Data Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Amanin Data - Edit Dokumen Aman & Privat',
        description: 'Watermark Dokumen, TTD Digital, dan Edit PDF tanpa upload data. 100% Client-Side.',
        images: ['/images/og-image.jpg'],
    },
}

export default function HomePage() {
    return <HomeClient />
}
