export interface Hotel {
  id: string
  name: string
  city: string
  country: string
  stars: number
  rating: number
  image: string
  amenities: string[]
  description: string
}

export interface RoomOffer {
  id: string
  hotelId: string
  hotelName: string
  city: string
  stars: number
  rating: number
  image: string
  roomType: string
  boardType: string
  pricePerNight: number
  totalPrice: number
  currency: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  amenities: string[]
  cancellationPolicy: string
}

export interface HotelSearchParams {
  city: string
  checkIn: string
  checkOut: string
  guests: number
  starsMin?: number
  maxPrice?: number
}
