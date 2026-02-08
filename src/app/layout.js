import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ConsentModal from '@/components/ConsentModal'
import JsonLd from '@/components/JsonLd'
import { ThemeProvider } from '@/context/ThemeContext'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
})

export const metadata = {
    title: 'Watermark KTP Online & TTD Digital – Aman & Lokal | AmaninKTP',
    description: 'Lindungi dokumen Anda dengan Watermark KTP dan Tanda Tangan Digital online gratis. Diproses 100% di browser, tanpa upload data ke server. Aman dan terpercaya.',
    keywords: 'watermark ktp, watermark online, tanda tangan online, ttd digital, ttd pdf, keamanan data, amaninktp, qreatip',
    authors: [{ name: 'Faisal Ridwan', url: 'https://qreatip.com' }],
    creator: 'Faisal Ridwan',
    publisher: 'AmaninKTP',
    metadataBase: new URL('https://amanindata.qreatip.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Watermark KTP Online & TTD Digital – Aman & Lokal',
        description: 'Cara aman buat watermark KTP dan tanda tangan digital langsung di browser tanpa upload data.',
        type: 'website',
        url: 'https://amanindata.qreatip.com',
        siteName: 'AmaninKTP',
        locale: 'id_ID',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'AmaninKTP Preview',
            },
        ],
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
    verification: {
        google: 'google-site-verification-code',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={poppins.className}>
                <ThemeProvider>
                    <JsonLd />
                    <GoogleAnalytics />
                    <ConsentModal />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
