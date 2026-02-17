export const dynamic = 'force-static'

export default function sitemap() {
    const baseUrl = 'https://amanindata.qreatip.com'

    // Core pages
    const routes = [
        '',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
        '/guide',
        '/donate',
        '/changelog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.5,
    }))

    // Product/Tool pages - Priority 0.8
    const tools = [
        '/signature',
        '/pdf-page-number',
        '/password-generator',
        '/photo-generator',
        '/latex-editor',
        '/qrcode',
        '/encrypt',
        '/json-formatter',
        '/exif-remover',
        '/compress',
        '/merge',
        '/redact',
        '/rearrange',
        '/remove-background',
        '/rotate',
        '/split',
        '/speed-test',
        '/color-picker',
        '/image-converter',
        '/bulk-renamer',
        '/css-gradient',
        '/diff-checker',
        '/hash-generator',
        '/ip-check',
        '/mockup-generator',
        '/nik-parser',
        '/ocr',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [...routes, ...tools]
}
