export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AmaninKTP',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'IDR',
        },
        description: 'Aplikasi web gratis untuk membuat watermark KTP dan tanda tangan digital secara aman langsung di browser.',
        featureList: 'Watermark KTP, Tanda Tangan Digital, Edit PDF, Client-side Processing',
        screenshot: 'https://amanindata.qreatip.com/images/og-image.jpg',
        url: 'https://amanindata.qreatip.com',
        author: {
            '@type': 'Person',
            name: 'Faisal Ridwan',
            url: 'https://qreatip.com',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
