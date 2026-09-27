import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { compareCart } from '../src/catalog/compare.ts'
const catalog = JSON.parse(readFileSync(new URL('../src/catalog/catalog.json', import.meta.url)))
const providers = [{ id: 'prov_ubereats', name: 'Uber Eats' }, { id: 'prov_doordash', name: 'DoorDash' }, { id: 'prov_skip', name: 'SkipTheDishes' }]
function line(restaurantName, itemName, quantity) {
  const restaurant = catalog.restaurants.find(r => r.name.includes(restaurantName))
  const item = catalog.items.find(i => i.restaurantId === restaurant.id && i.name === itemName)
  assert.ok(item, itemName)
  return { id: item.id, menuItemId: item.id, restaurantId: restaurant.id, providerId: '', quantity }
}
test('whole basket uses quantities and preserves tied fixed subtotals', () => {
  const rows = compareCart([line('Taco Boyz', 'Large Loaded Fries', 2), line('Taco Boyz', 'Water', 1)], providers, catalog.offers, catalog.provenance)
  assert.equal(rows.find(r => r.provider.id === 'prov_doordash').subtotal, 3485)
  assert.equal(rows.find(r => r.provider.id === 'prov_skip').subtotal, 3485)
  assert.equal(rows.filter(r => r.lowest).length, 2)
  assert.equal(rows.find(r => r.provider.id === 'prov_ubereats').subtotal, null)
})
test('partial baskets never display an invented total or win', () => {
  const rows = compareCart([line('McDonald', 'Big Mac', 2)], providers, catalog.offers, catalog.provenance)
  assert.equal(rows.find(r => r.provider.id === 'prov_ubereats').subtotal, 1678)
  assert.equal(rows.find(r => r.provider.id === 'prov_doordash').subtotal, 1718)
  assert.equal(rows.find(r => r.provider.id === 'prov_skip').subtotal, null)
  assert.equal(rows[0].provider.id, 'prov_ubereats')
})
test('starting prices do not win fixed-price comparison', () => {
  const rows = compareCart([line('Taco Boyz', 'Regular Burrito', 1)], providers, catalog.offers, catalog.provenance)
  assert.ok(rows.find(r => r.provider.id === 'prov_doordash').startingPrice)
  assert.equal(rows.filter(r => r.lowest).length, 0)
})
test('empty and mixed-restaurant carts cannot be quoted', () => {
  for (const lines of [[], [line('Taco Boyz', 'Water', 1), line('McDonald', 'Big Mac', 1)]]) {
    assert.ok(compareCart(lines, providers, catalog.offers, catalog.provenance).every(r => !r.complete && r.subtotal === null && !r.lowest))
  }
})
test('all collected menus have local item photos and only traceable collected prices', () => {
  assert.ok(catalog.restaurants.length >= 42)
  for (const item of catalog.items) assert.ok(existsSync(new URL(`../public${item.imageURL}`, import.meta.url)), item.name)
  for (const offer of catalog.offers) assert.match(catalog.provenance[offer.id].sourceUrl, /^https:\/\/(www\.)?((ubereats|doordash|skipthedishes)\.com|lunapizza\.ca)\//)
})

test('pickup menus cannot win a delivery comparison', () => {
  const cart = [line('McDonald', 'Big Mac', 1)]
  const offers = providers.slice(0, 2).map((p, i) => ({ id: p.id, providerId: p.id, menuItemId: cart[0].menuItemId, restaurantId: cart[0].restaurantId, price: { amountCents: i ? 200 : 100, currency: 'CAD' } }))
  const rows = compareCart(cart, providers, offers, { prov_ubereats: { startingPrice: false, fulfillmentMode: 'pickup' }, prov_doordash: { startingPrice: false } })
  assert.ok(rows.every(row => !row.lowest))
})

test('direct menu has a separate branch, traceable pickup prices and real dish images', () => {
  const rid = 'catalog-direct-luna-king'
  assert.match(catalog.restaurants.find(r => r.id === rid).location.address, /379 King/)
  assert.equal(catalog.items.filter(i => i.restaurantId === rid).length, 61)
  const offers = catalog.offers.filter(o => o.restaurantId === rid)
  assert.equal(offers.length, 60)
  assert.ok(offers.every(o => o.price.amountCents > 0 && catalog.provenance[o.id].fulfillmentMode === 'pickup'))
  assert.ok(catalog.items.some(i => i.restaurantId === rid && i.imageURL.includes('/dish-')))
})
