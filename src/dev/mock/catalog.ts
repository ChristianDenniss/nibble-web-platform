/**
 * In-memory instances of go-data-model entities for enableMockDev().
 * Types come from the generated model. Do not invent parallel shapes here.
 */
import type {
  Account,
  Cart,
  Category,
  Cuisine,
  Item,
  Location,
  Offer,
  Order,
  Provider,
  Restaurant,
} from '@/generated/data-model'

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
  id: 'acct_dev',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  phone: '506-555-0148',
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
  { id: 'prov_skip', name: 'Skip' },
  { id: 'prov_doordash', name: 'DoorDash' },
  { id: 'prov_ubereats', name: 'Uber Eats' },
  { id: 'prov_instacart', name: 'Instacart' },
  { id: 'prov_grubhub', name: 'Grubhub' },
  { id: 'prov_fantuan', name: 'Fantuan' },
]

export const mockCategories: Category[] = [
  { id: 'cat_food', slug: 'food', name: 'Food', description: 'Restaurants near you' },
  { id: 'cat_grocery', slug: 'grocery', name: 'Grocery', description: 'Same-day grocery' },
  { id: 'cat_convenience', slug: 'convenience', name: 'Convenience', description: 'Snacks and essentials' },
  { id: 'cat_alcohol', slug: 'alcohol', name: 'Alcohol', description: 'Beer, wine, and more' },
  { id: 'cat_pickup', slug: 'pickup', name: 'Pickup', description: 'Skip the delivery fee' },
  { id: 'cat_retail', slug: 'retail', name: 'Retail', description: 'Stores and extras' },
  { id: 'cat_pets', slug: 'pets', name: 'Pets', description: 'Food and supplies' },
]

export const mockCuisines: Cuisine[] = [
  { id: 'cui_sushi', slug: 'sushi', name: 'Sushi' },
  { id: 'cui_pizza', slug: 'pizza', name: 'Pizza' },
  { id: 'cui_burgers', slug: 'burgers', name: 'Burgers' },
  { id: 'cui_mexican', slug: 'mexican', name: 'Mexican' },
  { id: 'cui_indian', slug: 'indian', name: 'Indian' },
  { id: 'cui_coffee', slug: 'coffee', name: 'Coffee' },
  { id: 'cui_healthy', slug: 'healthy', name: 'Healthy' },
  { id: 'cui_dessert', slug: 'dessert', name: 'Dessert' },
]

export const mockRestaurants: Restaurant[] = [
  { id: 'rest_koi', name: 'Koi Sushi', location: fredericton('410 Queen St'), cuisineIds: ['cui_sushi'], categoryIds: ['cat_food', 'cat_pickup'], rating: { average: 4.7, count: 1284 } },
  { id: 'rest_slice', name: 'River Slice', location: fredericton('394 King St'), cuisineIds: ['cui_pizza'], categoryIds: ['cat_food'], rating: { average: 4.5, count: 892 } },
  { id: 'rest_stack', name: 'The Stack', location: fredericton('480 Queen St'), cuisineIds: ['cui_burgers'], categoryIds: ['cat_food'], rating: { average: 4.4, count: 2103 } },
  { id: 'rest_salsa', name: 'Casa Salsa', location: fredericton('366 York St'), cuisineIds: ['cui_mexican'], categoryIds: ['cat_food'], rating: { average: 4.6, count: 674 } },
  { id: 'rest_masala', name: 'Masala Room', location: fredericton('1381 Regent St'), cuisineIds: ['cui_indian'], categoryIds: ['cat_food'], rating: { average: 4.8, count: 1540 } },
  { id: 'rest_brew', name: 'Campus Brew', location: { latitude: 45.9458, longitude: -66.6414, address: 'UNB Student Union Bldg', city: 'Fredericton', region: 'NB', postalCode: 'E3B 5A3' }, cuisineIds: ['cui_coffee', 'cui_dessert'], categoryIds: ['cat_food', 'cat_convenience'], rating: { average: 4.3, count: 411 } },
  { id: 'rest_green', name: 'Green Bowl', location: fredericton('565 Prospect St'), cuisineIds: ['cui_healthy'], categoryIds: ['cat_food'], rating: { average: 4.5, count: 733 } },
  { id: 'rest_scoop', name: 'Late Scoop', location: fredericton('412 King St'), cuisineIds: ['cui_dessert'], categoryIds: ['cat_food', 'cat_convenience'], rating: { average: 4.2, count: 256 } },
]

export const mockItems: Item[] = [
  { id: 'item_koi_tuna', restaurantId: 'rest_koi', name: 'Spicy Tuna Roll', description: 'Tuna, chili mayo, cucumber, sesame.', section: 'Rolls' },
  { id: 'item_koi_salmon', restaurantId: 'rest_koi', name: 'Salmon Sashimi', description: 'Six pieces, house soy, wasabi.', section: 'Sashimi' },
  { id: 'item_koi_miso', restaurantId: 'rest_koi', name: 'Miso Soup', description: 'Tofu, wakame, scallion.', section: 'Sides' },
  { id: 'item_slice_pepperoni', restaurantId: 'rest_slice', name: 'Pepperoni Pie', description: '14" hand-stretched, cup-and-char pepperoni.', section: 'Pizzas' },
  { id: 'item_slice_caesar', restaurantId: 'rest_slice', name: 'Caesar Salad', description: 'Romaine, parmesan, house dressing.', section: 'Salads' },
  { id: 'item_stack_classic', restaurantId: 'rest_stack', name: 'Classic Smash', description: 'Two smash patties, American cheese, pickles.', section: 'Burgers' },
  { id: 'item_stack_fries', restaurantId: 'rest_stack', name: 'Loaded Fries', description: 'Cheese sauce, scallion, smoked salt.', section: 'Sides' },
  { id: 'item_salsa_burrito', restaurantId: 'rest_salsa', name: 'Carne Asada Burrito', description: 'Grilled steak, rice, beans, salsa verde.', section: 'Mains' },
  { id: 'item_salsa_chips', restaurantId: 'rest_salsa', name: 'Chips & Guac', description: 'Fresh tortillas, lime, cilantro.', section: 'Starters' },
  { id: 'item_masala_butter', restaurantId: 'rest_masala', name: 'Butter Chicken', description: 'Cream tomato gravy, basmati, naan.', section: 'Mains' },
  { id: 'item_masala_samosa', restaurantId: 'rest_masala', name: 'Veggie Samosas', description: 'Two pieces, tamarind chutney.', section: 'Starters' },
  { id: 'item_brew_latte', restaurantId: 'rest_brew', name: 'Oat Latte', description: 'Double shot, steamed oat milk.', section: 'Drinks' },
  { id: 'item_brew_cookie', restaurantId: 'rest_brew', name: 'Chocolate Chunk Cookie', description: 'Baked every morning.', section: 'Bakery' },
  { id: 'item_green_bowl', restaurantId: 'rest_green', name: 'Harvest Bowl', description: 'Quinoa, kale, roasted squash, tahini.', section: 'Bowls' },
  { id: 'item_scoop_sundae', restaurantId: 'rest_scoop', name: 'Hot Fudge Sundae', description: 'Vanilla, fudge, whipped cream.', section: 'Sundaes' },
]

export const mockOffers: Offer[] = [
  { id: 'off_koi_tuna_skip', restaurantId: 'rest_koi', menuItemId: 'item_koi_tuna', providerId: 'prov_skip', price: { amountCents: 1499, currency: 'CAD' }, estimatedMinutes: 28 },
  { id: 'off_koi_tuna_dd', restaurantId: 'rest_koi', menuItemId: 'item_koi_tuna', providerId: 'prov_doordash', price: { amountCents: 1649, currency: 'CAD' }, estimatedMinutes: 32 },
  { id: 'off_koi_salmon_skip', restaurantId: 'rest_koi', menuItemId: 'item_koi_salmon', providerId: 'prov_skip', price: { amountCents: 1899, currency: 'CAD' }, estimatedMinutes: 28 },
  { id: 'off_koi_miso_dd', restaurantId: 'rest_koi', menuItemId: 'item_koi_miso', providerId: 'prov_doordash', price: { amountCents: 399, currency: 'CAD' }, estimatedMinutes: 30 },
  { id: 'off_slice_pep_skip', restaurantId: 'rest_slice', menuItemId: 'item_slice_pepperoni', providerId: 'prov_skip', price: { amountCents: 2199, currency: 'CAD' }, estimatedMinutes: 24 },
  { id: 'off_slice_pep_dd', restaurantId: 'rest_slice', menuItemId: 'item_slice_pepperoni', providerId: 'prov_doordash', price: { amountCents: 2099, currency: 'CAD' }, estimatedMinutes: 26 },
  { id: 'off_slice_caesar_dd', restaurantId: 'rest_slice', menuItemId: 'item_slice_caesar', providerId: 'prov_doordash', price: { amountCents: 899, currency: 'CAD' }, estimatedMinutes: 26 },
  { id: 'off_stack_classic_skip', restaurantId: 'rest_stack', menuItemId: 'item_stack_classic', providerId: 'prov_skip', price: { amountCents: 1599, currency: 'CAD' }, estimatedMinutes: 20 },
  { id: 'off_stack_classic_dd', restaurantId: 'rest_stack', menuItemId: 'item_stack_classic', providerId: 'prov_doordash', price: { amountCents: 1699, currency: 'CAD' }, estimatedMinutes: 22 },
  { id: 'off_stack_fries_skip', restaurantId: 'rest_stack', menuItemId: 'item_stack_fries', providerId: 'prov_skip', price: { amountCents: 799, currency: 'CAD' }, estimatedMinutes: 20 },
  { id: 'off_salsa_burrito_dd', restaurantId: 'rest_salsa', menuItemId: 'item_salsa_burrito', providerId: 'prov_doordash', price: { amountCents: 1799, currency: 'CAD' }, estimatedMinutes: 30 },
  { id: 'off_salsa_chips_skip', restaurantId: 'rest_salsa', menuItemId: 'item_salsa_chips', providerId: 'prov_skip', price: { amountCents: 699, currency: 'CAD' }, estimatedMinutes: 28 },
  { id: 'off_masala_butter_skip', restaurantId: 'rest_masala', menuItemId: 'item_masala_butter', providerId: 'prov_skip', price: { amountCents: 1999, currency: 'CAD' }, estimatedMinutes: 38 },
  { id: 'off_masala_butter_dd', restaurantId: 'rest_masala', menuItemId: 'item_masala_butter', providerId: 'prov_doordash', price: { amountCents: 1899, currency: 'CAD' }, estimatedMinutes: 42 },
  { id: 'off_masala_samosa_skip', restaurantId: 'rest_masala', menuItemId: 'item_masala_samosa', providerId: 'prov_skip', price: { amountCents: 699, currency: 'CAD' }, estimatedMinutes: 38 },
  { id: 'off_brew_latte_dd', restaurantId: 'rest_brew', menuItemId: 'item_brew_latte', providerId: 'prov_doordash', price: { amountCents: 549, currency: 'CAD' }, estimatedMinutes: 18 },
  { id: 'off_brew_cookie_skip', restaurantId: 'rest_brew', menuItemId: 'item_brew_cookie', providerId: 'prov_skip', price: { amountCents: 349, currency: 'CAD' }, estimatedMinutes: 16 },
  { id: 'off_green_bowl_skip', restaurantId: 'rest_green', menuItemId: 'item_green_bowl', providerId: 'prov_skip', price: { amountCents: 1649, currency: 'CAD' }, estimatedMinutes: 24 },
  { id: 'off_green_bowl_dd', restaurantId: 'rest_green', menuItemId: 'item_green_bowl', providerId: 'prov_doordash', price: { amountCents: 1749, currency: 'CAD' }, estimatedMinutes: 26 },
  { id: 'off_scoop_sundae_dd', restaurantId: 'rest_scoop', menuItemId: 'item_scoop_sundae', providerId: 'prov_doordash', price: { amountCents: 799, currency: 'CAD' }, estimatedMinutes: 20 },
  { id: 'off_koi_tuna_ue', restaurantId: 'rest_koi', menuItemId: 'item_koi_tuna', providerId: 'prov_ubereats', price: { amountCents: 1579, currency: 'CAD' }, estimatedMinutes: 30 },
  { id: 'off_slice_pep_ue', restaurantId: 'rest_slice', menuItemId: 'item_slice_pepperoni', providerId: 'prov_ubereats', price: { amountCents: 2149, currency: 'CAD' }, estimatedMinutes: 27 },
  { id: 'off_salsa_burrito_ue', restaurantId: 'rest_salsa', menuItemId: 'item_salsa_burrito', providerId: 'prov_ubereats', price: { amountCents: 1749, currency: 'CAD' }, estimatedMinutes: 29 },
  { id: 'off_masala_butter_ue', restaurantId: 'rest_masala', menuItemId: 'item_masala_butter', providerId: 'prov_ubereats', price: { amountCents: 1949, currency: 'CAD' }, estimatedMinutes: 40 },
  { id: 'off_stack_classic_ic', restaurantId: 'rest_stack', menuItemId: 'item_stack_classic', providerId: 'prov_instacart', price: { amountCents: 1729, currency: 'CAD' }, estimatedMinutes: 35 },
  { id: 'off_brew_latte_ic', restaurantId: 'rest_brew', menuItemId: 'item_brew_latte', providerId: 'prov_instacart', price: { amountCents: 579, currency: 'CAD' }, estimatedMinutes: 25 },
  { id: 'off_brew_cookie_ic', restaurantId: 'rest_brew', menuItemId: 'item_brew_cookie', providerId: 'prov_instacart', price: { amountCents: 379, currency: 'CAD' }, estimatedMinutes: 25 },
  { id: 'off_scoop_sundae_ic', restaurantId: 'rest_scoop', menuItemId: 'item_scoop_sundae', providerId: 'prov_instacart', price: { amountCents: 849, currency: 'CAD' }, estimatedMinutes: 28 },
  { id: 'off_koi_tuna_ft', restaurantId: 'rest_koi', menuItemId: 'item_koi_tuna', providerId: 'prov_fantuan', price: { amountCents: 1459, currency: 'CAD' }, estimatedMinutes: 34 },
  { id: 'off_koi_salmon_ft', restaurantId: 'rest_koi', menuItemId: 'item_koi_salmon', providerId: 'prov_fantuan', price: { amountCents: 1849, currency: 'CAD' }, estimatedMinutes: 34 },
  { id: 'off_koi_miso_ft', restaurantId: 'rest_koi', menuItemId: 'item_koi_miso', providerId: 'prov_fantuan', price: { amountCents: 369, currency: 'CAD' }, estimatedMinutes: 34 },
]

export const mockCart: Cart = {
  id: 'cart_dev',
  accountId: 'acct_dev',
  lines: [
    { id: 'line_1', restaurantId: 'rest_koi', menuItemId: 'item_koi_tuna', providerId: 'prov_skip', quantity: 2 },
    { id: 'line_2', restaurantId: 'rest_koi', menuItemId: 'item_koi_salmon', providerId: 'prov_skip', quantity: 1 },
  ],
}

export const mockOrders: Order[] = [
  {
    id: 'ord_1042',
    accountId: 'acct_dev',
    restaurantId: 'rest_masala',
    providerId: 'prov_doordash',
    placedAt: '2026-09-21T18:42:00-03:00',
    status: 'completed',
    total: { amountCents: 4287, currency: 'CAD' },
    lines: [
      { id: 'ol_1042_1', menuItemId: 'item_masala_butter', name: 'Butter Chicken', quantity: 1 },
      { id: 'ol_1042_2', menuItemId: 'item_masala_samosa', name: 'Veggie Samosas', quantity: 1 },
    ],
  },
  {
    id: 'ord_1038',
    accountId: 'acct_dev',
    restaurantId: 'rest_stack',
    providerId: 'prov_skip',
    placedAt: '2026-09-14T12:10:00-03:00',
    status: 'completed',
    total: { amountCents: 2714, currency: 'CAD' },
    lines: [
      { id: 'ol_1038_1', menuItemId: 'item_stack_classic', name: 'Classic Smash', quantity: 1 },
      { id: 'ol_1038_2', menuItemId: 'item_stack_fries', name: 'Loaded Fries', quantity: 1 },
    ],
  },
  {
    id: 'ord_1031',
    accountId: 'acct_dev',
    restaurantId: 'rest_slice',
    providerId: 'prov_skip',
    placedAt: '2026-09-02T19:05:00-03:00',
    status: 'cancelled',
    total: { amountCents: 2199, currency: 'CAD' },
    lines: [{ id: 'ol_1031_1', menuItemId: 'item_slice_pepperoni', name: 'Pepperoni Pie', quantity: 1 }],
  },
]

export const mockCatalog = {
  account: mockAccount,
  providers: mockProviders,
  categories: mockCategories,
  cuisines: mockCuisines,
  restaurants: mockRestaurants,
  items: mockItems,
  offers: mockOffers,
  cart: mockCart,
  orders: mockOrders,
}

export type MockCatalog = typeof mockCatalog
