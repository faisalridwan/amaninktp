
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // 1. Get IP Address
        let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        
        // Handle local development or if multiple IPs are present
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim()
        }
        
        // If localhost or undefined, let the API detect the server's public IP
        // But freeipapi needs an IP in the URL to return data for that specific IP?
        // Actually, calling https://freeipapi.com/api/json without IP returns the requester's IP.
        // So validation:
        // - If PROD and we have a valid client IP, use it: https://freeipapi.com/api/json/{ip}
        // - If DEV (localhost), we might just want to see *some* data, so calling the API without IP arg
        //   will return the developer machine's public IP (as seen by freeipapi).
        
        let apiUrl = 'https://freeipapi.com/api/json'
        
        // Only append IP if it's a valid public IP (basic check) and not localhost
        // For simplicity, we can try appending if it exists and isn't ::1 or 127.0.0.1
        if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            apiUrl += `/${ip}`
        }

        // 2. Fetch from Primary API (freeipapi.com)
        const res = await fetch(apiUrl)
        
        if (res.ok) {
            const data = await res.json()
            return NextResponse.json(data)
        }

        // 3. Fallback: ipapi.co (Server-side fetch should work)
        console.warn('Primary API failed, trying fallback 1 (ipapi.co)')
        const res2 = await fetch(`https://ipapi.co/${ip && ip !== '::1' ? ip + '/' : ''}json/`)
        if (res2.ok) {
            const data = await res2.json()
            // Normalize
            return NextResponse.json({
                ipAddress: data.ip,
                ipVersion: data.version === 'IPv6' ? 6 : 4,
                cityName: data.city,
                regionName: data.region,
                zipCode: data.postal,
                countryName: data.country_name,
                countryCode: data.country_code,
                latitude: data.latitude,
                longitude: data.longitude,
                asn: data.asn?.replace('AS', ''),
                asnOrganization: data.org,
                isProxy: false,
                timeZones: [data.timezone],
                currencies: [data.currency],
                languages: [data.languages ? data.languages.split(',')[0] : 'en']
            })
        }

        // 4. Fallback: ipwho.is
        console.warn('Fallback 1 failed, trying fallback 2 (ipwho.is)')
        const res3 = await fetch(`https://ipwho.is/${ip && ip !== '::1' ? ip : ''}`)
        if (res3.ok) {
            const data = await res3.json()
            if (data.success) {
                 return NextResponse.json({
                    ipAddress: data.ip,
                    ipVersion: 4,
                    cityName: data.city,
                    regionName: data.region,
                    zipCode: data.postal,
                    countryName: data.country,
                    countryCode: data.country_code,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    asn: data.connection?.asn,
                    asnOrganization: data.connection?.org,
                    isProxy: false,
                    timeZones: [data.timezone?.id],
                    currencies: [data.currency?.code],
                    languages: ['en']
                })
            }
        }
        
        throw new Error('All APIs failed')

    } catch (error) {
        console.error('IP Proxy Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch IP data' },
            { status: 500 }
        )
    }
}
