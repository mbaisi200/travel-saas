import type { RoomOffer } from '@/types/hotels'

interface HotelDBEntry {
  name: string
  city: string
  stars: number
  rating: number
  amenities: string[]
}

const hotelsDB: HotelDBEntry[] = [
  { name: 'Wish Resort', city: 'Bonito/MS', stars: 4, rating: 4.6, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Ar condicionado'] },
  { name: 'Zagaia Eco Resort', city: 'Bonito/MS', stars: 5, rating: 4.8, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Tudo incluso'] },
  { name: 'Pousada Águas de Bonito', city: 'Bonito/MS', stars: 3, rating: 4.4, amenities: ['Café da manhã', 'Wi-Fi', 'Ar condicionado'] },
  { name: 'Hotel Unique', city: 'São Paulo', stars: 5, rating: 4.7, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Academia'] },
  { name: 'Renaissance São Paulo', city: 'São Paulo', stars: 5, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Mercure São Paulo', city: 'São Paulo', stars: 4, rating: 4.2, amenities: ['Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Ibis São Paulo', city: 'São Paulo', stars: 3, rating: 3.9, amenities: ['Wi-Fi', 'Café da manhã'] },
  { name: 'Copacabana Palace', city: 'Rio de Janeiro', stars: 5, rating: 4.8, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Academia'] },
  { name: 'Fasano Rio', city: 'Rio de Janeiro', stars: 5, rating: 4.6, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Hotel GL Bacharel', city: 'Rio de Janeiro', stars: 3, rating: 4.1, amenities: ['Café da manhã', 'Wi-Fi'] },
  { name: 'Arena di Marcello', city: 'Salvador', stars: 4, rating: 4.3, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Fera Palace', city: 'Salvador', stars: 4, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Catussaba Resort', city: 'Salvador', stars: 4, rating: 4.4, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Tudo incluso'] },
  { name: 'Hotel de Ville', city: 'Salvador', stars: 3, rating: 3.8, amenities: ['Café da manhã', 'Wi-Fi'] },
  { name: 'Ponta dos Ganchos', city: 'Florianópolis', stars: 5, rating: 4.9, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Tudo incluso'] },
  { name: 'Costão do Santinho', city: 'Florianópolis', stars: 5, rating: 4.7, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Tudo incluso'] },
  { name: 'Infinity Blue Resort', city: 'Porto Seguro', stars: 4, rating: 4.3, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Tudo incluso'] },
  { name: 'Porto Seguro Praia Resort', city: 'Porto Seguro', stars: 4, rating: 4.2, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Nannai Resort', city: 'Porto de Galinhas', stars: 5, rating: 4.8, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa', 'Tudo incluso'] },
  { name: 'Pontal de Oros', city: 'Porto de Galinhas', stars: 4, rating: 4.4, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Enseada do Porto', city: 'Porto de Galinhas', stars: 3, rating: 4.0, amenities: ['Café da manhã', 'Wi-Fi'] },
  { name: 'Manary Praia Hotel', city: 'Natal', stars: 4, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Serhs Natal Grand Hotel', city: 'Natal', stars: 4, rating: 4.3, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Hotel do Frade', city: 'Angra dos Reis', stars: 5, rating: 4.6, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa'] },
  { name: 'Portobello Resort', city: 'Angra dos Reis', stars: 4, rating: 4.4, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Tudo incluso'] },
  { name: 'Vila Galé', city: 'Maceió', stars: 4, rating: 4.3, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Ritz Lagoa da Anta', city: 'Maceió', stars: 5, rating: 4.6, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa'] },
  { name: 'Luau Resort', city: 'Maceió', stars: 3, rating: 3.9, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Beach Park Resort', city: 'Fortaleza', stars: 4, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Parque aquático'] },
  { name: 'Gran Mareiro', city: 'Fortaleza', stars: 4, rating: 4.2, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Hotel Luzeiros', city: 'Fortaleza', stars: 4, rating: 4.4, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Academia'] },
  { name: 'Summerville Resort', city: 'Porto de Galinhas', stars: 4, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Laguna Resort', city: 'Bonito/MS', stars: 4, rating: 4.5, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Spa'] },
  { name: 'Hotel Jatiúca', city: 'Maceió', stars: 3, rating: 3.7, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi'] },
  { name: 'Transamérica Resort', city: 'Porto Seguro', stars: 4, rating: 4.1, amenities: ['Piscina', 'Café da manhã', 'Wi-Fi', 'Tudo incluso'] },
]

const roomTypes = ['Standard', 'Superior', 'Luxo', 'Master', 'Suíte Presidencial']
const boardTypes = ['Somente Café', 'Meia Pensão', 'Pensão Completa', 'All Inclusive']

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateMockHotels(city: string, checkIn: string, checkOut: string, guests: number): RoomOffer[] {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))

  const cityHotels = hotelsDB.filter(
    (h) => h.city.toLowerCase().includes(city.toLowerCase()),
  )

  // Se não achar pela cidade, busca por palavra-chave
  const results = cityHotels.length > 0 ? cityHotels
    : hotelsDB.filter(
        (h) => h.name.toLowerCase().includes(city.toLowerCase())
           || h.city.toLowerCase().includes(city.toLowerCase()),
      )

  const selected = results.length > 0 ? results : hotelsDB.slice(0, 5)

  return selected.map((hotel, idx) => {
    const room = randomPick(roomTypes)
    const board = randomPick(boardTypes)
    const basePrice = hotel.stars * 80 + randomInt(30, 200)
    const boardMultiplier = board === 'All Inclusive' ? 2.2 : board === 'Pensão Completa' ? 1.6 : board === 'Meia Pensão' ? 1.3 : 1.0
    const guestMultiplier = guests > 2 ? 1 + (guests - 2) * 0.4 : 1.0
    const pricePerNight = Math.round(basePrice * boardMultiplier * guestMultiplier)

    return {
      id: `hotel-mock-${idx}`,
      hotelId: `h-${idx}`,
      hotelName: hotel.name,
      city: hotel.city,
      stars: hotel.stars,
      rating: hotel.rating,
      image: '',
      roomType: room,
      boardType: board,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      currency: 'BRL',
      checkIn,
      checkOut,
      nights,
      guests,
      amenities: hotel.amenities,
      cancellationPolicy: randomPick(['Grátis até 24h antes', 'Grátis até 48h antes', 'Não reembolsável']),
    }
  }).sort((a, b) => a.totalPrice - b.totalPrice)
}

export const hotelCities = [
  'Bonito/MS', 'São Paulo', 'Rio de Janeiro', 'Salvador', 'Florianópolis',
  'Porto Seguro', 'Porto de Galinhas', 'Natal', 'Maceió', 'Fortaleza',
  'Angra dos Reis', 'Recife', 'Gramado', 'Caldas Novas', 'Brasília',
]

export { hotelsDB }
