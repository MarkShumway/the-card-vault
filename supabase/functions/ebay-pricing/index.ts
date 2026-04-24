import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const EBAY_CLIENT_ID = Deno.env.get('EBAY_CLIENT_ID')!
const EBAY_CLIENT_SECRET = Deno.env.get('EBAY_CLIENT_SECRET')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Get eBay OAuth token ─────────────────────────────────────────────────────

async function getEbayToken(): Promise<string> {
    const credentials = btoa(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`)

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    })

    const data = await response.json()
    console.log('eBay token response status:', response.status)
    console.log('eBay token response:', JSON.stringify(data))

    if (!response.ok) {
        throw new Error(`eBay auth failed: ${data.error_description ?? JSON.stringify(data)}`)
    }

    return data.access_token
}

// ─── Search eBay sold listings ────────────────────────────────────────────────

async function searchEbaySoldListings(
    token: string,
    query: string
): Promise<{ average: number; low: number; high: number; count: number; listings: { title: string; price: number; url: string }[] }> {

    const params = new URLSearchParams({
        q: query,
        filter: 'buyingOptions:{FIXED_PRICE},conditions:{USED|VERY_GOOD|GOOD|ACCEPTABLE}',
        sort: 'newlyListed',
        limit: '20',
    })

    const response = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                'Content-Type': 'application/json',
            },
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`eBay search failed: ${JSON.stringify(data)}`)
    }

    const items = data.itemSummaries ?? []

    if (items.length === 0) {
        return { average: 0, low: 0, high: 0, count: 0, listings: [] }
    }

    const prices = items
        .map((item: { price?: { value: string } }) => parseFloat(item.price?.value ?? '0'))
        .filter((price: number) => price > 0)

    const average = prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length
    const low = Math.min(...prices)
    const high = Math.max(...prices)

    const listings = items.slice(0, 5).map((item: {
        title: string
        price?: { value: string }
        itemWebUrl: string
    }) => ({
        title: item.title,
        price: parseFloat(item.price?.value ?? '0'),
        url: item.itemWebUrl,
    }))

    return {
        average: Math.round(average * 100) / 100,
        low: Math.round(low * 100) / 100,
        high: Math.round(high * 100) / 100,
        count: prices.length,
        listings,
    }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { player_name, year, brand, category } = await req.json()

        if (!player_name) {
            return new Response(
                JSON.stringify({ error: 'player_name is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Build search query
        const query = [year, brand, player_name, 'card']
            .filter(Boolean)
            .join(' ')

        const token = await getEbayToken()
        const results = await searchEbaySoldListings(token, query)

        return new Response(
            JSON.stringify(results),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Edge function error:', error)
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
                detail: error instanceof Error ? error.stack : String(error)
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
