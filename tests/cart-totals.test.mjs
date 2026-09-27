import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotals, feeCents } from '../src/catalog/cartTotals.ts'
const now = new Date('2026-09-27T12:00:00Z')
const promotion = (id, extra = {}) => ({ id, providerId:'prov_doordash', title:id, sourceUrl:'https://www.doordash.com', terms:'', expiresOn:'2026-12-31', code:'', restaurantNameContains:'', minimumCents:1500, country:'CA', eligibility:'confirm_in_provider', reviewedAt:now.toISOString(), ...extra })
const promos = [promotion('dd-first-40'), promotion('dd-targeted-25')]
const total = (confirmed = [], delivery = 499, subtotal = 4000, offers = promos) => cartTotals(subtotal,'prov_doordash','Restaurant',delivery,300,offers,confirmed,now)
test('tax includes entered fees and no unconfirmed offers', () => {
 assert.equal(total().tax,720)
 assert.equal(total().total,5519)
 assert.equal(total().discount,0)
})
test('best eligible offer is selected without stacking; delivery waiver included', () => {
 const result = total(['dd-first-40','dd-targeted-25'])
 assert.equal(result.discount,1300)
 assert.equal(result.delivery,0)
 assert.equal(result.total,3450)
 assert.equal(result.promo.id,'dd-first-40')
})
test('unknown delivery prevents a total unless eligible waiver covers it', () => {
 assert.equal(total([],null).total,null)
 assert.equal(total(['dd-first-40'],null).total,3450)
 assert.equal(cartTotals(4000,'prov_doordash','Restaurant',499,null,promos,['dd-first-40'],now).total,null)
})
test('minimums, expiration and unavailable items prevent discounts or totals', () => {
 assert.equal(total(['dd-first-40'],499,1400).discount,0)
 assert.equal(total(['dd-first-40'],499,4000,[promotion('dd-first-40',{expiresOn:'2026-09-26'})]).discount,0)
 assert.equal(total(['dd-first-40'],499,null).total,null)
})
test('fees accept explicit zero and reject blanks, negatives and invalid precision', () => {
 assert.equal(feeCents('0'),0)
 assert.equal(feeCents('4.99'),499)
 for(const value of ['', '-1','1.001','NaN','Infinity']) assert.equal(feeCents(value),null)
})
