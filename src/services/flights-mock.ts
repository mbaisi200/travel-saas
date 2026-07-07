import type { Airport, FlightOffer } from '@/types/flights'

export const airports: Airport[] = [
  { iata: 'GRU', name: 'Aeroporto Internacional de São Paulo', city: 'São Paulo', country: 'Brasil' },
  { iata: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo', country: 'Brasil' },
  { iata: 'GIG', name: 'Aeroporto do Galeão', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'BSB', name: 'Aeroporto de Brasília', city: 'Brasília', country: 'Brasil' },
  { iata: 'CNF', name: 'Aeroporto de Confins', city: 'Belo Horizonte', country: 'Brasil' },
  { iata: 'POA', name: 'Aeroporto Salgado Filho', city: 'Porto Alegre', country: 'Brasil' },
  { iata: 'SSA', name: 'Aeroporto de Salvador', city: 'Salvador', country: 'Brasil' },
  { iata: 'REC', name: 'Aeroporto do Recife', city: 'Recife', country: 'Brasil' },
  { iata: 'FOR', name: 'Aeroporto de Fortaleza', city: 'Fortaleza', country: 'Brasil' },
  { iata: 'MCZ', name: 'Aeroporto Zumbi dos Palmares', city: 'Maceió', country: 'Brasil' },
  { iata: 'NAT', name: 'Aeroporto de Natal', city: 'Natal', country: 'Brasil' },
  { iata: 'CWB', name: 'Aeroporto Afonso Pena', city: 'Curitiba', country: 'Brasil' },
  { iata: 'FLN', name: 'Aeroporto Hercílio Luz', city: 'Florianópolis', country: 'Brasil' },
  { iata: 'VIX', name: 'Aeroporto de Vitória', city: 'Vitória', country: 'Brasil' },
  { iata: 'SLZ', name: 'Aeroporto de São Luís', city: 'São Luís', country: 'Brasil' },
  { iata: 'BEL', name: 'Aeroporto de Belém', city: 'Belém', country: 'Brasil' },
  { iata: 'MAO', name: 'Aeroporto de Manaus', city: 'Manaus', country: 'Brasil' },
  { iata: 'CGB', name: 'Aeroporto de Cuiabá', city: 'Cuiabá', country: 'Brasil' },
  { iata: 'PNZ', name: 'Aeroporto de Petrolina', city: 'Petrolina', country: 'Brasil' },
  { iata: 'THE', name: 'Aeroporto de Teresina', city: 'Teresina', country: 'Brasil' },
  { iata: 'JPA', name: 'Aeroporto de João Pessoa', city: 'João Pessoa', country: 'Brasil' },
  { iata: 'AJU', name: 'Aeroporto de Aracaju', city: 'Aracaju', country: 'Brasil' },
  { iata: 'RBR', name: 'Aeroporto de Rio Branco', city: 'Rio Branco', country: 'Brasil' },
  { iata: 'PVH', name: 'Aeroporto de Porto Velho', city: 'Porto Velho', country: 'Brasil' },
  { iata: 'BVB', name: 'Aeroporto de Boa Vista', city: 'Boa Vista', country: 'Brasil' },
  { iata: 'UBA', name: 'Aeroporto de Uberaba', city: 'Uberaba', country: 'Brasil' },
  { iata: 'UDI', name: 'Aeroporto de Uberlândia', city: 'Uberlândia', country: 'Brasil' },
  { iata: 'IPN', name: 'Aeroporto de Ipatinga', city: 'Ipatinga', country: 'Brasil' },
  { iata: 'MOC', name: 'Aeroporto de Montes Claros', city: 'Montes Claros', country: 'Brasil' },
  { iata: 'PLU', name: 'Aeroporto de Belo Horizonte (Pampulha)', city: 'Belo Horizonte', country: 'Brasil' },
  { iata: 'JDO', name: 'Aeroporto de Juazeiro do Norte', city: 'Juazeiro do Norte', country: 'Brasil' },
  { iata: 'IOS', name: 'Aeroporto de Ilhéus', city: 'Ilhéus', country: 'Brasil' },
  { iata: 'BPS', name: 'Aeroporto de Porto Seguro', city: 'Porto Seguro', country: 'Brasil' },
  { iata: 'CXJ', name: 'Aeroporto de Caxias do Sul', city: 'Caxias do Sul', country: 'Brasil' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'EUA' },
  { iata: 'JFK', name: 'John F. Kennedy', city: 'Nova York', country: 'EUA' },
  { iata: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'EUA' },
  { iata: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Reino Unido' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'França' },
  { iata: 'MAD', name: 'Barajas', city: 'Madri', country: 'Espanha' },
  { iata: 'LIS', name: 'Portela', city: 'Lisboa', country: 'Portugal' },
  { iata: 'EZE', name: 'Ezeiza', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile' },
  { iata: 'MEX', name: 'Benito Juárez', city: 'Cidade do México', country: 'México' },
]

const airlines = [
  { code: 'LA', name: 'Latam' },
  { code: 'G3', name: 'Gol' },
  { code: 'AD', name: 'Azul' },
  { code: 'JJ', name: 'LATAM (antiga TAM)' },
  { code: '2Z', name: 'Passaredo' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'IB', name: 'Iberia' },
  { code: 'TP', name: 'TAP Portugal' },
]

const cabings = ['economy', 'economy', 'economy', 'business'] as const

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${m > 0 ? m.toString().padStart(2, '0') : '00'}`
}

export function generateMockFlights(
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
  passengers: number = 1,
): FlightOffer[] {
  const offers: FlightOffer[] = []

  // Distâncias aproximadas em minutos
  const distances: Record<string, Record<string, number>> = {
    'GRU': { 'GIG': 55, 'BSB': 105, 'SSA': 155, 'REC': 200, 'FOR': 220, 'POA': 95, 'CWB': 60, 'FLN': 75, 'CNF': 70, 'MCZ': 180, 'NAT': 210, 'SLZ': 220, 'BEL': 230, 'MAO': 260, 'VIX': 90, 'MIA': 510, 'JFK': 570, 'LHR': 660, 'CDG': 650, 'MAD': 570, 'LIS': 540, 'EZE': 190, 'SCL': 270 },
    'GIG': { 'GRU': 55, 'BSB': 110, 'SSA': 145, 'REC': 190, 'FOR': 215, 'POA': 120, 'CWB': 90, 'FLN': 100, 'CNF': 60, 'MCZ': 170, 'MIA': 490, 'JFK': 550 },
    'BSB': { 'GRU': 105, 'GIG': 110, 'SSA': 115, 'REC': 160, 'FOR': 180, 'POA': 140, 'CWB': 110, 'FLN': 125, 'CNF': 80, 'BEL': 150, 'MAO': 200 },
    'SSA': { 'GRU': 155, 'GIG': 145, 'BSB': 115, 'REC': 55, 'FOR': 95, 'NAT': 85, 'MCZ': 60, 'SLZ': 110 },
    'REC': { 'GRU': 200, 'GIG': 190, 'SSA': 55, 'FOR': 65, 'NAT': 45, 'MCZ': 50, 'SLZ': 100, 'BEL': 120 },
    'FOR': { 'REC': 65, 'SSA': 95, 'NAT': 50, 'SLZ': 75, 'BEL': 100 },
    'MIA': { 'GRU': 510, 'GIG': 490, 'BSB': 500, 'JFK': 150, 'ORD': 155, 'MEX': 210 },
    'JFK': { 'GRU': 570, 'GIG': 550, 'MIA': 150, 'LHR': 380, 'CDG': 400, 'MAD': 380, 'LIS': 360 },
    'LIS': { 'GRU': 540, 'GIG': 520, 'JFK': 360, 'MAD': 70, 'CDG': 140, 'LHR': 160 },
    'MAD': { 'GRU': 570, 'GIG': 550, 'LIS': 70, 'CDG': 110, 'LHR': 130, 'JFK': 380 },
  }

  const routeDist = distances[origin]?.[destination] || distances[destination]?.[origin] || 180

  // Gera 4-6 ofertas
  const numOffers = randomInt(4, 6)

  for (let i = 0; i < numOffers; i++) {
    const airline = randomPick(airlines)
    const stops = i < 2 ? 0 : i < 4 ? 1 : 2
    const stopList: string[] = []

    if (stops > 0) {
      const possibleStops = airports
        .filter((a) => a.iata !== origin && a.iata !== destination)
        .map((a) => a.iata)
      for (let s = 0; s < stops; s++) {
        stopList.push(randomPick(possibleStops))
      }
    }

    const baseMinutes = routeDist + (stops * 60) + randomInt(-20, 40)
    const departHour = randomInt(6, 22)
    const departMin = randomInt(0, 50)

    const departDT = new Date(`${departDate}T${departHour.toString().padStart(2, '0')}:${departMin.toString().padStart(2, '0')}:00`)
    const arriveDT = new Date(departDT.getTime() + baseMinutes * 60 * 1000)

    const basePrice = routeDist * (i < 2 ? 1.5 : i < 4 ? 1.0 : 0.7)
    const priceMultiplier = stops === 0 ? 1.3 : stops === 1 ? 1.0 : 0.8
    const cabin = randomPick(cabings)
    const cabinMultiplier = cabin === 'business' ? 2.5 : 1.0
    const price = Math.round(basePrice * priceMultiplier * cabinMultiplier * (1 + Math.random() * 0.3))

    const flightNum = `${airline.code}${randomInt(1000, 9999)}`

    offers.push({
      id: `flight-${i}-${Date.now()}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNum,
      departure: {
        airport: origin,
        city: airports.find((a) => a.iata === origin)?.city || origin,
        time: formatTime(departDT),
        date: departDate,
      },
      arrival: {
        airport: destination,
        city: airports.find((a) => a.iata === destination)?.city || destination,
        time: formatTime(arriveDT),
        date: departDate,
      },
      duration: formatDuration(baseMinutes),
      stops,
      stopAirports: stopList,
      cabin,
      price: price * passengers,
      currency: 'BRL',
      seatsAvailable: randomInt(1, 20),
      fareClass: stops === 0 ? 'Y' : stops === 1 ? 'M' : 'Q',
    })
  }

  // Ordena por preço
  return offers.sort((a, b) => a.price - b.price)
}
