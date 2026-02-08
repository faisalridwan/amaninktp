import '@/styles/globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ConsentModal from '@/components/ConsentModal'

export const metadata = {
    title: 'Watermark KTP Online & TTD Digital – Aman & Lokal | AmaninKTP',
    description: 'Lindungi dokumen Anda dengan Watermark KTP dan Tanda Tangan Digital online gratis. Diproses 100% di browser, tanpa upload data ke server. Aman dan terpercaya.',
    keywords: 'watermark ktp, watermark online, tanda tangan online, ttd digital, ttd pdf, keamanan data, amaninktp, qreatip',
    authors: [{ name: 'Faisal Ridwan', url: 'https://qreatip.com' }],
    creator: 'Faisal Ridwan',
    publisher: 'AmaninKTP',
    metadataBase: new URL('https://amaninktp.qreatip.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Watermark KTP Online & TTD Digital – Aman & Lokal',
        description: 'Cara aman buat watermark KTP dan tanda tangan digital langsung di browser tanpa upload data.',
        type: 'website',
        url: 'https://amaninktp.qreatip.com',
        siteName: 'AmaninKTP',
        locale: 'id_ID',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <GoogleAnalytics />
                <ConsentModal />
                {children}
            </body>
        </html>
    )
}
