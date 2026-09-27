import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { estimateFees } from '../src/catalog/feeEstimates.ts'
import { restaurantPromotions } from '../src/catalog/promotions.ts'
const catalog = JSON.parse(readFileSync(new URL('../src/catalog/catalog.json', import.meta.url)))
test('project estimates are explicit and do not favor an app using invented differences', () => {
 for (const id of ['prov_ubereats','prov_doordash','prov_skip']) assert.deepEqual(estimateFees(id, 4000),{delivery:399,service:400})
 assert.deepEqual(estimateFees('prov_direct',4000,true),{delivery:0,service:0})
 assert.deepEqual(estimateFees('unknown',4000),{delivery:null,service:null})
 assert.equal(estimateFees('prov_skip',null).service,null)
})
test('account-specific promotions are excluded, including restaurant signup coupons', () => {
 const offers=restaurantPromotions(catalog.promotions)
 assert.deepEqual(offers.map(p=>p.id),['dd-wendy-bogo'])
})
test('every visible direct restaurant option has actual branch menu prices', () => {
 for(const restaurant of catalog.restaurants.filter(r=>r.appURL)) assert.ok(catalog.offers.some(o=>o.restaurantId===restaurant.id && o.providerId==='prov_direct'))
 for(const id of Object.keys(catalog.merchantOrdering)) assert.ok(catalog.offers.some(o=>o.restaurantId===id && o.providerId==='prov_direct'))
 assert.ok(catalog.merchantOrdering['catalog-direct-luna-king'])
})
