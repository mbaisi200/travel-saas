import { NextRequest, NextResponse } from 'next/server'

const IGNAV_API_URL = 'https://ignav.com/api/fares'

export async function POST(request: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_IGNAV_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { round_trip, ...params } = body

    const endpoint = round_trip ? `${IGNAV_API_URL}/round-trip` : `${IGNAV_API_URL}/one-way`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departure_date,
        return_date: params.return_date,
        adults: params.adults ?? 1,
        cabin_class: params.cabin_class || 'economy',
        max_stops: params.max_stops,
        min_checked_bags: params.min_checked_bags,
        market: 'BR',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: `Ignav API error: ${response.status}`, details: data },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno ao buscar voos' }, { status: 500 })
  }
}
