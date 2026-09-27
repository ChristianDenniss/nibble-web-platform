import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
const catalog = JSON.parse(readFileSync(new URL('../src/catalog/catalog.json', import.meta.url)))
const logos = JSON.parse(readFileSync(new URL('../src/catalog/restaurantImages.json', import.meta.url)))
test('every restaurant has a locally stored, attributed logo', () => {
 for (const restaurant of catalog.restaurants) {
  const logo = logos[restaurant.id]
  assert.ok(logo, restaurant.name)
  assert.equal(logo.kind, 'logo', restaurant.name)
  assert.ok(existsSync(new URL(`../public${logo.file}`, import.meta.url)), restaurant.name)
  assert.match(logo.sourceUrl, /^https:\/\//)
 }
})
