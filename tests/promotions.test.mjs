import { test } from 'node:test'
import assert from 'node:assert/strict'
import { availablePromotions } from '../src/catalog/promotions.ts'
const base = { id: 'one', providerId: 'prov_doordash', title: 'Offer', sourceUrl: 'https://help.doordash.com/', terms: 'Eligible accounts only', expiresOn: '2026-09-27', code: '', restaurantNameContains: 'Wendy', minimumCents: 1500, country: 'CA', eligibility: 'confirm_in_provider', reviewedAt: '2026-09-27T01:00:00Z' }
test('only matching provider, restaurant and country receive a promotion', () => {
  const now = new Date('2026-09-27T12:00:00Z')
  assert.equal(availablePromotions([base], ['prov_doordash'], "Wendy's", now).length, 1)
  assert.equal(availablePromotions([base], ['prov_ubereats'], "Wendy's", now).length, 0)
  assert.equal(availablePromotions([base], ['prov_doordash'], 'Taco Boyz', now).length, 0)
  assert.equal(availablePromotions([{ ...base, country: 'US' }], ['prov_doordash'], "Wendy's", now).length, 0)
})
test('expired, stale, changed and future-dated terms are hidden', () => {
  for (const [promo, time] of [[base, '2026-09-28T03:00:01Z'], [{ ...base, expiresOn: null }, '2026-10-01T12:00:00Z'], [{ ...base, needsReview: true }, '2026-09-27T12:00:00Z'], [base, '2026-09-26T12:00:00Z']]) {
    assert.equal(availablePromotions([promo], ['prov_doordash'], "Wendy's", new Date(time)).length, 0)
  }
})
