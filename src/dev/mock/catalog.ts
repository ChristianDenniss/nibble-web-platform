/**
 * In-memory instances of go-data-model entities for enableMockDev().
 * Types come from the generated model. Do not invent parallel shapes here.
 */
import type {
	Account,
	ActivePromotion,
  Cart,
  Category,
  Cuisine,
  DealBadge,
  HomeFeed,
  HomeFeedItem,
  Item,
  Location,
  Offer,
  Order,
  Provider,
  Restaurant,
  RestaurantHours,
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
  { id: 'prov_skip', name: 'SkipTheDishes' },
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
  { id: 'cat_pharmacy', slug: 'pharmacy', name: 'Pharmacy', description: 'Health and wellness' },
  { id: 'cat_flowers', slug: 'flowers', name: 'Flowers', description: 'Bouquets and plants' },
  { id: 'cat_baby', slug: 'baby', name: 'Baby', description: 'Diapers, formula, and more' },
  { id: 'cat_beauty', slug: 'beauty', name: 'Beauty', description: 'Skincare and cosmetics' },
  { id: 'cat_bakery', slug: 'bakery', name: 'Bakery', description: 'Fresh bread and pastries' },
  { id: 'cat_gifts', slug: 'gifts', name: 'Gifts', description: 'Last-minute presents' },
  { id: 'cat_breakfast', slug: 'breakfast', name: 'Breakfast', description: 'Start the day right' },
  { id: 'cat_desserts', slug: 'desserts', name: 'Desserts', description: 'Sweet treats and ice cream' },
  { id: 'cat_asian', slug: 'asian', name: 'Asian', description: 'Noodles, sushi, and more' },
  { id: 'cat_sandwiches', slug: 'sandwiches', name: 'Sandwiches', description: 'Stacked, toasted, and grilled' },
  { id: 'cat_healthy', slug: 'healthy', name: 'Healthy', description: 'Fresh meals and lighter picks' },
  { id: 'cat_fast_food', slug: 'fast-food', name: 'Fast Food', description: 'Quick comfort food' },
  { id: 'cat_late_night', slug: 'late-night', name: 'Late Night', description: 'Cravings after dark' },
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
  { id: 'cui_chinese', slug: 'chinese', name: 'Chinese' },
  { id: 'cui_thai', slug: 'thai', name: 'Thai' },
  { id: 'cui_seafood', slug: 'seafood', name: 'Seafood' },
  { id: 'cui_sandwiches', slug: 'sandwiches', name: 'Sandwiches' },
  { id: 'cui_wings', slug: 'wings', name: 'Wings' },
  { id: 'cui_breakfast', slug: 'breakfast', name: 'Breakfast' },
  { id: 'cui_vegan', slug: 'vegan', name: 'Vegan' },
  { id: 'cui_donuts', slug: 'donuts', name: 'Donuts' },
  { id: 'cui_bbq', slug: 'bbq', name: 'BBQ' },
]

/** Placeholder App Store listing; demo restaurants are not real businesses. */
const appListing = (slug: string) => `https://apps.apple.com/ca/app/${slug}/id0000000000`

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6]
const WEEKNIGHTS = [0, 1, 2, 3, 4]
const WEEKEND_NIGHTS = [5, 6]

const restaurantPhoto = (id: string) => `https://images.unsplash.com/photo-${id}?w=960&q=85&auto=format&fit=crop`

function hours(service: RestaurantHours['service'], days: number[], opens: string, closes: string): RestaurantHours[] {
  return days.map((dayOfWeek) => ({ service, dayOfWeek, opens, closes }))
}

export const mockRestaurants: Restaurant[] = [
  { id: 'rest_koi', name: 'Koi Sushi', imageURL: restaurantPhoto('1579871494447-9811cf80d66c'), location: fredericton('410 Queen St'), cuisineIds: ['cui_sushi'], categoryIds: ['cat_food', 'cat_pickup', 'cat_asian'], rating: { average: 4.7, count: 1284 }, phone: '506-555-0110', appURL: appListing('koi-sushi'),
    hours: [...hours('store', [0, 2, 3, 4, 5, 6], '11:30', '21:30'), ...hours('delivery', [0, 2, 3, 4, 5, 6], '12:00', '21:00')] },
  { id: 'rest_slice', name: 'River Slice', imageURL: restaurantPhoto('1628840042765-356cda07504e'), location: fredericton('394 King St'), cuisineIds: ['cui_pizza'], categoryIds: ['cat_food', 'cat_fast_food'], rating: { average: 4.5, count: 892 }, phone: '506-555-0122', appURL: '',
    hours: [
      ...hours('store', WEEKNIGHTS, '11:00', '23:00'), ...hours('store', WEEKEND_NIGHTS, '11:00', '02:00'),
      ...hours('delivery', WEEKNIGHTS, '11:00', '22:30'), ...hours('delivery', WEEKEND_NIGHTS, '11:00', '01:00'),
    ] },
  { id: 'rest_stack', name: 'The Stack', imageURL: restaurantPhoto('1568901346375-23c9450c58cd'), location: fredericton('480 Queen St'), cuisineIds: ['cui_burgers'], categoryIds: ['cat_food', 'cat_fast_food'], rating: { average: 4.4, count: 2103 }, phone: '', appURL: appListing('the-stack'),
    hours: [...hours('store', EVERY_DAY, '11:00', '22:00'), ...hours('delivery', EVERY_DAY, '16:00', '21:30')] },
  { id: 'rest_salsa', name: 'Casa Salsa', imageURL: restaurantPhoto('1626700051175-6818013e1d4f'), location: fredericton('366 York St'), cuisineIds: ['cui_mexican'], categoryIds: ['cat_food', 'cat_fast_food'], rating: { average: 4.6, count: 674 }, phone: '506-555-0134', appURL: '',
    hours: [...hours('store', EVERY_DAY, '11:00', '21:00'), ...hours('delivery', EVERY_DAY, '11:30', '20:30')] },
  { id: 'rest_masala', name: 'Masala Room', imageURL: restaurantPhoto('1603894584373-5ac82b2ae398'), location: fredericton('1381 Regent St'), cuisineIds: ['cui_indian'], categoryIds: ['cat_food', 'cat_asian'], rating: { average: 4.8, count: 1540 }, phone: '506-555-0146', appURL: '',
    hours: [
      ...hours('store', [1, 2, 3, 4, 5, 6], '11:30', '14:30'), ...hours('store', EVERY_DAY, '17:00', '22:00'),
      ...hours('delivery', EVERY_DAY, '17:00', '21:30'),
    ] },
  { id: 'rest_brew', name: 'Campus Brew', imageURL: restaurantPhoto('1541167760496-1628856ab772'), location: { latitude: 45.9458, longitude: -66.6414, address: 'UNB Student Union Bldg', city: 'Fredericton', region: 'NB', postalCode: 'E3B 5A3' }, cuisineIds: ['cui_coffee', 'cui_dessert'], categoryIds: ['cat_food', 'cat_convenience', 'cat_breakfast'], rating: { average: 4.3, count: 411 }, phone: '', appURL: appListing('campus-brew'),
    hours: [...hours('store', [1, 2, 3, 4, 5], '07:00', '18:00'), ...hours('delivery', [1, 2, 3, 4, 5], '09:00', '16:00')] },
  { id: 'rest_green', name: 'Green Bowl', imageURL: restaurantPhoto('1512621776951-a57141f2eefd'), location: fredericton('565 Prospect St'), cuisineIds: ['cui_healthy'], categoryIds: ['cat_food', 'cat_healthy'], rating: { average: 4.5, count: 733 }, phone: '', appURL: '', hours: [] },
  { id: 'rest_scoop', name: 'Late Scoop', imageURL: restaurantPhoto('1563805042-7684c019e1cb'), location: fredericton('412 King St'), cuisineIds: ['cui_dessert'], categoryIds: ['cat_food', 'cat_convenience', 'cat_desserts', 'cat_late_night'], rating: { average: 4.2, count: 256 }, phone: '', appURL: '',
    hours: [...hours('store', EVERY_DAY, '18:00', '01:00'), ...hours('delivery', EVERY_DAY, '19:00', '00:30')] },
  { id: 'rest_noodle', name: 'Northside Noodles', imageURL: restaurantPhoto('1569718212165-3a8278d5f624'), location: fredericton('75 Main St'), cuisineIds: ['cui_chinese', 'cui_thai'], categoryIds: ['cat_food', 'cat_pickup', 'cat_asian'], rating: { average: 4.6, count: 987 }, phone: '506-555-0150', appURL: '', hours: [...hours('store', EVERY_DAY, '11:00', '22:00'), ...hours('delivery', EVERY_DAY, '11:30', '21:30')] },
  { id: 'rest_tandoor', name: 'Tandoori Junction', imageURL: restaurantPhoto('1532550907401-a500c9a57435'), location: fredericton('120 Smythe St'), cuisineIds: ['cui_indian'], categoryIds: ['cat_food', 'cat_asian'], rating: { average: 4.1, count: 342 }, phone: '', appURL: '', hours: [...hours('store', EVERY_DAY, '12:00', '22:00'), ...hours('delivery', EVERY_DAY, '12:00', '21:30')] },
  { id: 'rest_harbor', name: 'Harbour Fish Co.', imageURL: restaurantPhoto('1559847844-5315695dadae'), location: fredericton('225 Riverside Dr'), cuisineIds: ['cui_seafood'], categoryIds: ['cat_food'], rating: { average: 4.7, count: 621 }, phone: '506-555-0151', appURL: '', hours: [...hours('store', [2, 3, 4, 5, 6], '16:00', '22:00'), ...hours('delivery', [2, 3, 4, 5, 6], '16:30', '21:30')] },
  { id: 'rest_deli', name: 'Queen Street Deli', imageURL: restaurantPhoto('1550507992-eb63ffee0847'), location: fredericton('685 Queen St'), cuisineIds: ['cui_sandwiches', 'cui_breakfast'], categoryIds: ['cat_food', 'cat_pickup', 'cat_breakfast', 'cat_sandwiches'], rating: { average: 4.4, count: 508 }, phone: '', appURL: appListing('queen-street-deli'), hours: [...hours('store', WEEKNIGHTS, '07:00', '17:00'), ...hours('delivery', WEEKNIGHTS, '08:00', '16:00')] },
  { id: 'rest_wings', name: 'Flight Night Wings', imageURL: restaurantPhoto('1527477396000-e27163b481c2'), location: fredericton('890 Hanwell Rd'), cuisineIds: ['cui_wings', 'cui_burgers'], categoryIds: ['cat_food', 'cat_fast_food', 'cat_late_night'], rating: { average: 4.3, count: 1180 }, phone: '', appURL: '', hours: [...hours('store', EVERY_DAY, '11:00', '01:00'), ...hours('delivery', EVERY_DAY, '11:00', '00:30')] },
  { id: 'rest_veggie', name: 'The Greenhouse', imageURL: restaurantPhoto('1512621776951-a57141f2eefd'), location: fredericton('15 Knowledge Park Dr'), cuisineIds: ['cui_vegan', 'cui_healthy'], categoryIds: ['cat_food', 'cat_bakery', 'cat_healthy'], rating: { average: 4.9, count: 266 }, phone: '506-555-0153', appURL: '', hours: [...hours('store', WEEKNIGHTS, '08:00', '20:00'), ...hours('delivery', WEEKNIGHTS, '09:00', '19:30')] },
  { id: 'rest_donut', name: 'Maple Ring Donuts', imageURL: restaurantPhoto('1551024506-0bccd828d307'), location: fredericton('1010 Prospect St'), cuisineIds: ['cui_donuts', 'cui_coffee'], categoryIds: ['cat_food', 'cat_bakery', 'cat_breakfast', 'cat_desserts'], rating: { average: 4.5, count: 799 }, phone: '', appURL: '', hours: [...hours('store', EVERY_DAY, '06:00', '15:00'), ...hours('delivery', EVERY_DAY, '07:00', '14:00')] },
  { id: 'rest_grocery', name: 'Market Basket', imageURL: restaurantPhoto('1542838132-92c53300491e'), location: fredericton('1200 Woodstock Rd'), cuisineIds: [], categoryIds: ['cat_grocery', 'cat_convenience'], rating: { average: 4.0, count: 88 }, phone: '506-555-0155', appURL: '', hours: [...hours('store', EVERY_DAY, '07:00', '22:00'), ...hours('delivery', EVERY_DAY, '08:00', '21:00')] },
  { id: 'rest_pharmacy', name: 'Riverbend Pharmacy', imageURL: restaurantPhoto('1584308666744-24d5c474f2ae'), location: fredericton('1440 Regent St'), cuisineIds: [], categoryIds: ['cat_pharmacy', 'cat_baby'], rating: { average: 4.2, count: 64 }, phone: '506-555-0156', appURL: '', hours: [...hours('store', WEEKNIGHTS, '09:00', '20:00'), ...hours('delivery', WEEKNIGHTS, '10:00', '19:00')] },
  { id: 'rest_paws', name: 'Paws & Pantry', imageURL: restaurantPhoto('1589924691995-400dc9c4f2fc'), location: fredericton('1600 Main St'), cuisineIds: [], categoryIds: ['cat_pets', 'cat_retail'], rating: { average: 4.6, count: 143 }, phone: '', appURL: '', hours: [...hours('store', EVERY_DAY, '09:00', '19:00'), ...hours('delivery', EVERY_DAY, '10:00', '18:00')] },
  { id: 'rest_blossom', name: 'Blossom & Stem', imageURL: restaurantPhoto('1490750967868-88aa4486c946'), location: { ...fredericton('22 Brunswick St'), latitude: 45.985, longitude: -66.61 }, cuisineIds: [], categoryIds: ['cat_flowers', 'cat_gifts'], rating: { average: 4.8, count: 211 }, phone: '', appURL: '', hours: [...hours('store', WEEKNIGHTS, '09:00', '18:00'), ...hours('delivery', WEEKNIGHTS, '10:00', '17:00')] },
  { id: 'rest_oromocto', name: 'Oromocto Smokehouse', imageURL: restaurantPhoto('1544025162-d76694265947'), location: { ...fredericton('85 Restigouche Rd'), latitude: 45.842, longitude: -66.48 }, cuisineIds: ['cui_bbq', 'cui_sandwiches'], categoryIds: ['cat_food', 'cat_sandwiches'], rating: { average: 4.7, count: 355 }, phone: '', appURL: '', hours: [...hours('store', EVERY_DAY, '11:00', '21:00')] },
]

/** External Unsplash photo, cropped for item thumbnails. Keep in sync with seed_storefront_demo.sql. */
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=480&q=80&auto=format&fit=crop`

const additionalItems: Item[] = [
  { id: 'item_koi_california', restaurantId: 'rest_koi', name: 'California Roll', description: 'Crab, avocado, cucumber, toasted sesame.', section: 'Rolls', imageURL: photo('1553621042-f6e147245754') },
  { id: 'item_koi_dragon', restaurantId: 'rest_koi', name: 'Dragon Roll', description: 'Tempura shrimp, avocado, eel sauce.', section: 'Rolls', imageURL: photo('1611143669185-af224c5e3252') },
  { id: 'item_koi_salmon_nigiri', restaurantId: 'rest_koi', name: 'Salmon Nigiri', description: 'Two pieces of salmon over seasoned rice.', section: 'Sashimi', imageURL: photo('1617196034183-421b4917c92d') },
  { id: 'item_koi_tuna_sashimi', restaurantId: 'rest_koi', name: 'Tuna Sashimi', description: 'Six pieces of fresh tuna with house soy.', section: 'Sashimi', imageURL: photo('1579584425555-c3ce17fd4351') },
  { id: 'item_koi_edamame', restaurantId: 'rest_koi', name: 'Sea Salt Edamame', description: 'Steamed soybeans finished with flaky sea salt.', section: 'Sides', imageURL: photo('1564894809611-1742fc40ed80') },
  { id: 'item_koi_goma', restaurantId: 'rest_koi', name: 'Goma Wakame Salad', description: 'Seasoned seaweed, sesame, and cucumber.', section: 'Sides', imageURL: photo('1559339352-11d035aa65de') },
  { id: 'item_noodle_ramen', restaurantId: 'rest_noodle', name: 'Miso Ramen', description: 'Noodles, egg, corn, bamboo, scallion.', section: 'Noodles', imageURL: photo('1569718212165-3a8278d5f624') },
  { id: 'item_noodle_padthai', restaurantId: 'rest_noodle', name: 'Chicken Pad Thai', description: 'Rice noodles, egg, peanuts, lime.', section: 'Noodles', imageURL: photo('1559314809-0d155014e29e') },
  { id: 'item_noodle_dumplings', restaurantId: 'rest_noodle', name: 'Pork Dumplings', description: 'Eight steamed dumplings with ginger soy.', section: 'Starters', imageURL: photo('1496116218417-1a781b1c416c') },
  { id: 'item_tandoor_tikka', restaurantId: 'rest_tandoor', name: 'Chicken Tikka', description: 'Clay oven chicken, mint chutney.', section: 'Mains', imageURL: photo('1532550907401-a500c9a57435') },
  { id: 'item_tandoor_daal', restaurantId: 'rest_tandoor', name: 'Dal Makhani', description: 'Slow-cooked black lentils and cream.', section: 'Mains', imageURL: photo('1546833999-b9f581a1996d') },
  { id: 'item_tandoor_naan', restaurantId: 'rest_tandoor', name: 'Garlic Naan', description: 'Tandoor-baked naan with garlic butter.', section: 'Breads', imageURL: photo('1601050690117-94f5f6fa8bd7') },
  { id: 'item_harbor_cod', restaurantId: 'rest_harbor', name: 'Crispy Cod Plate', description: 'Atlantic cod, fries, slaw, tartar.', section: 'Mains', imageURL: photo('1559847844-5315695dadae') },
  { id: 'item_harbor_chowder', restaurantId: 'rest_harbor', name: 'Seafood Chowder', description: 'Creamy haddock, shrimp, potato, herbs.', section: 'Soups', imageURL: photo('1547592166-23ac45744acd') },
  { id: 'item_harbor_shrimp', restaurantId: 'rest_harbor', name: 'Garlic Shrimp', description: 'Sautéed shrimp, lemon, garlic, parsley.', section: 'Starters', imageURL: photo('1565680018434-b513d5e5fd47') },
  { id: 'item_deli_club', restaurantId: 'rest_deli', name: 'Turkey Club', description: 'Roasted turkey, bacon, lettuce, tomato.', section: 'Sandwiches', imageURL: photo('1550507992-eb63ffee0847') },
  { id: 'item_deli_breakfast', restaurantId: 'rest_deli', name: 'Breakfast Bagel', description: 'Egg, cheddar, tomato jam, everything bagel.', section: 'Breakfast', imageURL: photo('1550547660-d9450f859349') },
  { id: 'item_deli_soup', restaurantId: 'rest_deli', name: 'Tomato Basil Soup', description: 'Roasted tomato, basil, cream.', section: 'Soups', imageURL: photo('1547592166-23ac45744acd') },
  { id: 'item_wings_buffalo', restaurantId: 'rest_wings', name: 'Buffalo Wings', description: 'One dozen wings with celery and ranch.', section: 'Wings', imageURL: photo('1527477396000-e27163b481c2') },
  { id: 'item_wings_honey', restaurantId: 'rest_wings', name: 'Honey Garlic Wings', description: 'Sticky honey garlic glaze and sesame.', section: 'Wings', imageURL: photo('1567620832903-1d4f4b4f5a9a') },
  { id: 'item_wings_poutine', restaurantId: 'rest_wings', name: 'Chicken Poutine', description: 'Fries, cheese curds, gravy, crispy chicken.', section: 'Mains', imageURL: photo('1618220179428-22790b461013') },
  { id: 'item_veggie_bowl', restaurantId: 'rest_veggie', name: 'Rainbow Grain Bowl', description: 'Farro, roasted vegetables, greens, pesto.', section: 'Bowls', imageURL: photo('1512621776951-a57141f2eefd') },
  { id: 'item_veggie_wrap', restaurantId: 'rest_veggie', name: 'Falafel Wrap', description: 'Falafel, hummus, cucumber, pickled onion.', section: 'Wraps', imageURL: photo('1529006557810-274b9b2fc783') },
  { id: 'item_veggie_brownie', restaurantId: 'rest_veggie', name: 'Vegan Brownie', description: 'Fudgy chocolate brownie with sea salt.', section: 'Desserts', imageURL: photo('1606313564200-e75d5e30476c') },
  { id: 'item_donut_maple', restaurantId: 'rest_donut', name: 'Maple Dip', description: 'Yeast-raised donut with New Brunswick maple glaze.', section: 'Donuts', imageURL: photo('1551024506-0bccd828d307') },
  { id: 'item_donut_boston', restaurantId: 'rest_donut', name: 'Boston Cream', description: 'Vanilla custard, chocolate glaze.', section: 'Donuts', imageURL: photo('1551024601-bec78aea704b') },
  { id: 'item_donut_coffee', restaurantId: 'rest_donut', name: 'Cold Brew', description: 'Smooth, slow-steeped coffee over ice.', section: 'Drinks', imageURL: photo('1517701604599-bb29b565090c') },
  { id: 'item_grocery_milk', restaurantId: 'rest_grocery', name: '2% Milk', description: 'Two-litre carton.', section: 'Dairy', imageURL: '' },
  { id: 'item_grocery_berries', restaurantId: 'rest_grocery', name: 'Fresh Blueberries', description: 'One pint of local blueberries.', section: 'Produce', imageURL: '' },
  { id: 'item_grocery_chips', restaurantId: 'rest_grocery', name: 'Sea Salt Kettle Chips', description: 'Family-size bag.', section: 'Snacks', imageURL: '' },
  { id: 'item_pharmacy_vitamins', restaurantId: 'rest_pharmacy', name: 'Daily Multivitamin', description: 'One-month supply.', section: 'Wellness', imageURL: '' },
  { id: 'item_pharmacy_bandages', restaurantId: 'rest_pharmacy', name: 'First Aid Kit', description: 'Bandages, gauze, tape, and antiseptic wipes.', section: 'First Aid', imageURL: '' },
  { id: 'item_paws_food', restaurantId: 'rest_paws', name: 'Chicken Dog Food', description: 'Grain-free 2 kg bag.', section: 'Dog', imageURL: '' },
  { id: 'item_paws_litter', restaurantId: 'rest_paws', name: 'Clumping Cat Litter', description: 'Low-dust unscented litter.', section: 'Cat', imageURL: '' },
  { id: 'item_blossom_roses', restaurantId: 'rest_blossom', name: 'Seasonal Rose Bouquet', description: 'A dozen mixed-colour roses with greenery.', section: 'Bouquets', imageURL: '' },
  { id: 'item_blossom_succulent', restaurantId: 'rest_blossom', name: 'Desk Succulent', description: 'Low-maintenance plant in a ceramic pot.', section: 'Plants', imageURL: '' },
  { id: 'item_oromocto_ribs', restaurantId: 'rest_oromocto', name: 'Half Rack Ribs', description: 'Smoked pork ribs, slaw, and cornbread.', section: 'Mains', imageURL: photo('1544025162-d76694265947') },
  { id: 'item_oromocto_brisket', restaurantId: 'rest_oromocto', name: 'Brisket Sandwich', description: 'Smoked brisket, pickles, barbecue sauce.', section: 'Sandwiches', imageURL: photo('1529692236671-f1f6cf9683ba') },
]

export const mockItems: Item[] = [
  { id: 'item_koi_tuna', restaurantId: 'rest_koi', name: 'Spicy Tuna Roll', description: 'Tuna, chili mayo, cucumber, sesame.', section: 'Rolls', imageURL: photo('1579871494447-9811cf80d66c') },
  { id: 'item_koi_salmon', restaurantId: 'rest_koi', name: 'Salmon Sashimi', description: 'Six pieces, house soy, wasabi.', section: 'Sashimi', imageURL: photo('1617196034796-73dfa7b1fd56') },
  { id: 'item_koi_miso', restaurantId: 'rest_koi', name: 'Miso Soup', description: 'Tofu, wakame, scallion.', section: 'Sides', imageURL: '' },
  { id: 'item_slice_pepperoni', restaurantId: 'rest_slice', name: 'Pepperoni Pie', description: '14" hand-stretched, cup-and-char pepperoni.', section: 'Pizzas', imageURL: photo('1628840042765-356cda07504e') },
  { id: 'item_slice_caesar', restaurantId: 'rest_slice', name: 'Caesar Salad', description: 'Romaine, parmesan, house dressing.', section: 'Salads', imageURL: photo('1550304943-4f24f54ddde9') },
  { id: 'item_stack_classic', restaurantId: 'rest_stack', name: 'Classic Smash', description: 'Two smash patties, American cheese, pickles.', section: 'Burgers', imageURL: photo('1568901346375-23c9450c58cd') },
  { id: 'item_stack_fries', restaurantId: 'rest_stack', name: 'Loaded Fries', description: 'Cheese sauce, scallion, smoked salt.', section: 'Sides', imageURL: photo('1573080496219-bb080dd4f877') },
  { id: 'item_salsa_burrito', restaurantId: 'rest_salsa', name: 'Carne Asada Burrito', description: 'Grilled steak, rice, beans, salsa verde.', section: 'Mains', imageURL: photo('1626700051175-6818013e1d4f') },
  { id: 'item_salsa_chips', restaurantId: 'rest_salsa', name: 'Chips & Guac', description: 'Fresh tortillas, lime, cilantro.', section: 'Starters', imageURL: photo('1513456852971-30c0b8199d4d') },
  { id: 'item_masala_butter', restaurantId: 'rest_masala', name: 'Butter Chicken', description: 'Cream tomato gravy, basmati, naan.', section: 'Mains', imageURL: photo('1603894584373-5ac82b2ae398') },
  { id: 'item_masala_samosa', restaurantId: 'rest_masala', name: 'Veggie Samosas', description: 'Two pieces, tamarind chutney.', section: 'Starters', imageURL: photo('1601050690597-df0568f70950') },
  { id: 'item_brew_latte', restaurantId: 'rest_brew', name: 'Oat Latte', description: 'Double shot, steamed oat milk.', section: 'Drinks', imageURL: photo('1541167760496-1628856ab772') },
  { id: 'item_brew_cookie', restaurantId: 'rest_brew', name: 'Chocolate Chunk Cookie', description: 'Baked every morning.', section: 'Bakery', imageURL: photo('1499636136210-6f4ee915583e') },
  { id: 'item_green_bowl', restaurantId: 'rest_green', name: 'Harvest Bowl', description: 'Quinoa, kale, roasted squash, tahini.', section: 'Bowls', imageURL: photo('1512621776951-a57141f2eefd') },
  { id: 'item_scoop_sundae', restaurantId: 'rest_scoop', name: 'Hot Fudge Sundae', description: 'Vanilla, fudge, whipped cream.', section: 'Sundaes', imageURL: photo('1563805042-7684c019e1cb') },
  ...additionalItems,
]

/** Give every expanded menu item multiple comparable paths so price/ETA UI has real variety. */
const additionalOffers: Offer[] = additionalItems.flatMap((item, index) => {
  const base = 699 + (index % 9) * 175
  const offers: Offer[] = [
    { id: `off_${item.id}_skip`, restaurantId: item.restaurantId, menuItemId: item.id, providerId: 'prov_skip', price: { amountCents: base, currency: 'CAD' }, estimatedMinutes: 18 + (index % 7) * 3 },
    { id: `off_${item.id}_dd`, restaurantId: item.restaurantId, menuItemId: item.id, providerId: 'prov_doordash', price: { amountCents: base + 90 + (index % 3) * 20, currency: 'CAD' }, estimatedMinutes: 21 + (index % 6) * 3 },
  ]
  if (index % 2 === 0) {
    offers.push({ id: `off_${item.id}_ue`, restaurantId: item.restaurantId, menuItemId: item.id, providerId: 'prov_ubereats', price: { amountCents: base + 40, currency: 'CAD' }, estimatedMinutes: 24 + (index % 5) * 2 })
  }
  return offers
})

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
  ...additionalOffers,
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

const mockDeals: ActivePromotion[] = [
  {
    promotion: { id: 'promo_skip_today', channelId: 'ch_skip', name: 'Skip today code', description: 'Use XYZ123 on Skip the Dishes today.', kind: 'percent_off', fulfillmentMode: '', value: { amountCents: 0, currency: 'CAD' }, valueBPS: 4000, startsAt: '2026-09-26T00:00:00-03:00', endsAt: '2026-09-26T23:59:59-03:00' },
    targets: [],
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
	deals: mockDeals,
  cart: mockCart,
  orders: mockOrders,
}

export type MockCatalog = typeof mockCatalog

const koiDeal: DealBadge = { promotionId: 'promo_koi_pickup', channelId: 'ch_merchant_web', label: '20% off pickup', fulfillmentMode: 'pickup' }
const sliceDeal: DealBadge = { promotionId: 'promo_slice_free_delivery', channelId: 'ch_ubereats', label: 'Free delivery', fulfillmentMode: 'delivery' }
const salsaDeal: DealBadge = { promotionId: 'promo_salsa_5_off', channelId: 'ch_doordash', label: '$5 off', fulfillmentMode: '' }
const greenDeal: DealBadge = { promotionId: 'promo_green_pickup', channelId: 'ch_skip', label: '15% off pickup', fulfillmentMode: 'pickup' }

function sponsored(placementId: string, campaignId: string, advertiserName: string) {
  return { placementId, campaignId, advertiserName, label: 'Sponsored' }
}

function organic(restaurantId: string, reason = ''): HomeFeedItem {
  return { restaurantId, reason, sponsored: null, deal: null }
}

const mockBannerImages = [
  photo('1579871494447-9811cf80d66c'),
  photo('1579758629938-03607ccdbaba'),
  photo('1552332386-f8dd00dc2f85'),
  photo('1617196034796-73dfa7b1fd56'),
  photo('1569718212165-3a8278d5f624'),
  photo('1512621776951-a57141f2eefd'),
]

/** Shaped like GET /v1/home. Organic rails ignore sponsorship, same as home/service. */
export const mockHomeFeed: HomeFeed = {
  generatedAt: '2026-09-26T12:00:00Z',
  banners: [
    {
      id: 'spl_koi_banner',
      kind: 'sponsored',
      headline: 'Fall omakase at Koi',
      body: 'Chef’s seasonal set, rolled fresh every evening.',
      imageURL: '',
      callToAction: 'Order now',
      restaurantId: 'rest_koi',
      sponsored: sponsored('spl_koi_banner', 'camp_koi_fall', 'Koi Sushi'),
      deal: null,
    },
    {
      id: 'promo_slice_free_delivery',
      kind: 'deal',
      headline: 'Free delivery from River Slice',
      body: 'On Uber Eats, all week long.',
      imageURL: '',
      callToAction: 'See the deal',
      restaurantId: 'rest_slice',
      sponsored: null,
      deal: sliceDeal,
    },
    {
      id: 'spl_salsa_banner',
      kind: 'sponsored',
      headline: 'Taco Tuesday, every day',
      body: 'Casa Salsa’s street tacos, three for the price of two.',
      imageURL: '',
      callToAction: 'Grab tacos',
      restaurantId: 'rest_salsa',
      sponsored: sponsored('spl_salsa_banner', 'camp_salsa_tacos', 'Casa Salsa'),
      deal: null,
    },
    {
      id: 'promo_koi_pickup',
      kind: 'deal',
      headline: '20% off pickup at Koi',
      body: 'Order direct from the restaurant and skip the fee.',
      imageURL: '',
      callToAction: 'See the deal',
      restaurantId: 'rest_koi',
      sponsored: null,
      deal: koiDeal,
    },
    {
      id: 'promo_noodle_combo',
      kind: 'deal',
      headline: 'Noodle night at Northside Noodles',
      body: 'Free dumplings with any large noodle bowl.',
      imageURL: '',
      callToAction: 'Build your bowl',
      restaurantId: 'rest_noodle',
      sponsored: null,
      deal: { promotionId: 'promo_noodle_combo', channelId: 'ch_skip', label: 'Free dumplings', fulfillmentMode: 'delivery' },
    },
    {
      id: 'spl_veggie_banner',
      kind: 'sponsored',
      headline: 'Eat bright at The Greenhouse',
      body: 'Fresh bowls, wraps, and plant-based treats.',
      imageURL: '',
      callToAction: 'Explore the menu',
      restaurantId: 'rest_veggie',
      sponsored: sponsored('spl_veggie_banner', 'camp_veggie_spring', 'The Greenhouse'),
      deal: null,
    },
  ].map((banner, index) => ({ ...banner, imageURL: mockBannerImages[index] })),
  sections: [
    {
      kind: 'sponsored',
      title: 'Sponsored',
      items: [
        { restaurantId: 'rest_koi', reason: '', sponsored: sponsored('spl_koi_rail', 'camp_koi_fall', 'Koi Sushi'), deal: koiDeal },
        { restaurantId: 'rest_salsa', reason: '', sponsored: sponsored('spl_salsa_rail', 'camp_salsa_tacos', 'Casa Salsa'), deal: salsaDeal },
        { restaurantId: 'rest_brew', reason: '', sponsored: sponsored('spl_brew_rail', 'camp_brew_study', 'Campus Brew'), deal: null },
        { restaurantId: 'rest_noodle', reason: '', sponsored: sponsored('spl_noodle_rail', 'camp_noodle_week', 'Northside Noodles'), deal: null },
        { restaurantId: 'rest_veggie', reason: '', sponsored: sponsored('spl_veggie_rail', 'camp_veggie_spring', 'The Greenhouse'), deal: null },
      ],
    },
    {
      kind: 'deals',
      title: 'Popular deals in your area',
      items: [
        { restaurantId: 'rest_koi', reason: '', sponsored: null, deal: koiDeal },
        { restaurantId: 'rest_slice', reason: '', sponsored: null, deal: sliceDeal },
        { restaurantId: 'rest_salsa', reason: '', sponsored: null, deal: salsaDeal },
        { restaurantId: 'rest_green', reason: '', sponsored: null, deal: greenDeal },
        { restaurantId: 'rest_noodle', reason: '', sponsored: null, deal: { promotionId: 'promo_noodle_combo', channelId: 'ch_skip', label: 'Free dumplings', fulfillmentMode: 'delivery' } },
        { restaurantId: 'rest_donut', reason: '', sponsored: null, deal: { promotionId: 'promo_donut_coffee', channelId: 'ch_doordash', label: 'Coffee + donut $6', fulfillmentMode: 'delivery' } },
      ],
    },
    {
      kind: 'popular',
      title: 'Most popular',
      items: ['rest_masala', 'rest_stack', 'rest_koi', 'rest_slice', 'rest_salsa', 'rest_green', 'rest_brew', 'rest_scoop', 'rest_noodle', 'rest_harbor', 'rest_deli', 'rest_wings', 'rest_donut', 'rest_grocery'].map((id) => organic(id)),
    },
    {
      kind: 'recommended',
      title: 'Recommended for you',
      items: [
        organic('rest_masala', 'Because you like Indian'),
        organic('rest_stack', 'Because you like Burgers'),
        organic('rest_slice', 'Because you like Pizza'),
        organic('rest_koi', 'Highly rated'),
        organic('rest_salsa', 'Highly rated'),
        organic('rest_green', 'Highly rated'),
        organic('rest_noodle', 'Popular nearby'),
        organic('rest_harbor', 'Try something new'),
        organic('rest_veggie', 'Highly rated'),
        organic('rest_donut', 'Perfect with coffee'),
        organic('rest_deli', 'Quick lunch nearby'),
      ],
    },
  ],
}
