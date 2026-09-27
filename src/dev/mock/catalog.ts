/** Collected restaurant menus adapted to the upstream storefront entities. */
import type { Account, Location, Cart, Category, Cuisine, DealBadge, HomeFeed, HomeFeedItem, Item, Offer, Provider, Restaurant, Order, SponsoredMark } from '@/generated/data-model'
import catalog from '@/catalog/catalog.json'
function fredericton(address: string): Location {
  return {
    latitude: 45.9636,
    longitude: -66.6431,
    address,
    city: 'Fredericton',
    region: 'NB',
    postalCode: '',
  }
}

export const mockAccount: Account = {
  id: 'acct_aottgpvp_root',
  name: 'Aottg',
  email: 'aottgpvp@gmail.com',
  phone: '506-555-0148',
  role: 'root',
  addresses: [
    {
      id: 'addr_home',
      label: 'UNBF',
      location: { latitude: 45.9458, longitude: -66.6414, address: '3 Bailey Dr', city: 'Fredericton', region: 'NB', postalCode: 'E3B 5A3' },
      current: true,
    },
    {
      id: 'addr_work',
      label: 'Downtown',
      location: { ...fredericton('427 Queen St'), postalCode: 'E3B 1B5' },
      current: false,
    },
  ],
  paymentMethods: [
    { id: 'pay_visa', brand: 'Visa', last4: '4242', expMonth: 8, expYear: 2028, default: true },
  ],
}


export const mockProviders: Provider[] = [
  { id: 'prov_ubereats', name: 'Uber Eats' },
  { id: 'prov_doordash', name: 'DoorDash' },
  { id: 'prov_skip', name: 'SkipTheDishes' },
  { id: 'prov_direct', name: 'Restaurant website' },
]
export const mockCategories: Category[] = [{ id: 'cat_food', slug: 'food', name: 'Food', description: 'Restaurants near you' }]
export const mockCuisines: Cuisine[] = [
  'Burgers', 'Mexican', 'Pizza', 'Shawarma', 'Chicken', 'Sushi', 'Indian', 'Coffee',
  'Healthy', 'Dessert', 'Chinese', 'Thai', 'Seafood', 'Sandwiches', 'Wings', 'Breakfast',
  'Vegan', 'Donuts',
].map(name => ({ id: `cui_${name.toLowerCase()}`, slug: name.toLowerCase(), name }))
export const mockRestaurants: Restaurant[] = catalog.restaurants
export const mockItems: Item[] = catalog.items
export const mockOffers: Offer[] = catalog.offers
export const mockCart: Cart = { id: 'cart_local', accountId: 'local', lines: [] }
export const mockOrders: Order[] = []
export const mockCatalog = { account: mockAccount, providers: mockProviders, categories: mockCategories, cuisines: mockCuisines, restaurants: mockRestaurants, items: mockItems, offers: mockOffers, deals: [], cart: mockCart, orders: mockOrders }
export type MockCatalog = typeof mockCatalog

const mockSponsored: SponsoredMark = {
  placementId: 'placement_mock_home_rail',
  campaignId: 'campaign_mock_home',
  advertiserName: 'Nibble featured partner',
  label: 'Sponsored',
}

const mockDeal: DealBadge = {
  promotionId: 'promo_mock_home',
  channelId: 'ch_skip',
  label: '20% off delivery',
  fulfillmentMode: 'delivery',
}

function mockFeedItems(restaurants: Restaurant[], reason: string, extras: Pick<HomeFeedItem, 'sponsored' | 'deal'> = { sponsored: null, deal: null }): HomeFeedItem[] {
  return restaurants.map((restaurant) => ({
    restaurantId: restaurant.id,
    reason,
    ...extras,
  }))
}

export const mockHomeFeed: HomeFeed = {
  generatedAt: '',
  banners: mockRestaurants.slice(0, 4).map(restaurant => ({ id: `menu_${restaurant.id}`, kind: 'editorial', headline: restaurant.name, body: 'Explore the menu and compare your whole cart.', imageURL: restaurant.imageURL ?? '', callToAction: 'Browse menu', restaurantId: restaurant.id, sponsored: null, deal: null })),
  sections: [
    {
      kind: 'sponsored',
      title: 'Featured near you',
      items: mockFeedItems(mockRestaurants.slice(0, 3), '', { sponsored: mockSponsored, deal: null }),
    },
    {
      kind: 'deals',
      title: 'Popular deals in your area',
      items: mockFeedItems(mockRestaurants.slice(3, 7), 'Limited-time offer', { sponsored: null, deal: mockDeal }),
    },
    {
      kind: 'popular',
      title: 'Most popular',
      items: mockFeedItems(mockRestaurants.slice(0, 6), 'Popular nearby'),
    },
    {
      kind: 'recommended',
      title: 'Recommended for you',
      items: mockFeedItems(mockRestaurants.slice(2, 8), 'Based on nearby favorites'),
    },
  ],
}
