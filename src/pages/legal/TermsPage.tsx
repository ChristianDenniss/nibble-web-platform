/**
 * TermsPage — terms of service for Nibble as a price-comparison service.
 * Plain-language draft; have counsel review before public launch.
 */
import { ArrowUpRight, Scale, Tag, TrendingUp } from 'lucide-react'
import LegalDocument, { type LegalHighlight, type LegalSection } from '@/components/legal/LegalDocument'

const HIGHLIGHTS: LegalHighlight[] = [
  {
    icon: Scale,
    title: 'We compare, you choose',
    body: 'Nibble compares ways to get your food. We don’t cook, sell, or deliver it.',
  },
  {
    icon: TrendingUp,
    title: 'Prices can move',
    body: 'Prices we show are snapshots. The provider’s checkout has the final total.',
  },
  {
    icon: ArrowUpRight,
    title: 'You order somewhere else',
    body: 'Orders, payment, delivery, and refunds are between you and the provider you pick.',
  },
  {
    icon: Tag,
    title: 'Ranked on price, not payouts',
    body: 'Options are ranked by all-in price and public deals within the filters you set.',
  },
]

const SECTIONS: LegalSection[] = [
  {
    id: 'what-nibble-is',
    title: 'What Nibble is',
    blocks: [
      'Nibble helps you find the cheapest way to get a meal. For a restaurant and your address, we compare the ways you could order: delivery apps like Skip and DoorDash, and over time restaurant apps and websites, pickup, drive-thru, and calling the restaurant directly.',
      'Nibble is not a restaurant, courier, or marketplace. We don’t prepare, sell, or deliver food, and we are not a party to any order you place.',
    ],
  },
  {
    id: 'your-account',
    title: 'Your account',
    blocks: [
      'You can browse without an account. To save addresses, set compare preferences, or use price alerts, you need one.',
      [
        'You must be the age of majority where you live, or use Nibble with a parent or guardian’s permission.',
        'Keep your details accurate and your sign-in private. You are responsible for activity on your account.',
        'One person per account. Don’t create accounts for someone else without their permission.',
      ],
    ],
  },
  {
    id: 'prices',
    title: 'Prices, fees, and availability',
    blocks: [
      'The prices, fees, delivery times, and deals on Nibble come from menus and listings we observe from providers and restaurants at a point in time. Some are cached estimates; some are checked live when you compare. We label estimates and gaps when we know about them.',
      [
        'Prices, fees, taxes, promotions, delivery times, and availability can change before you order.',
        'The total shown at the provider’s checkout is the one that counts.',
        'We can only see public deals. Personal coupons, targeted offers, and member pricing you haven’t told us about won’t appear.',
        '“All-in” is our best estimate of item prices plus fees and eligible public promotions. It may leave out things like tips, bag fees, or taxes the provider hasn’t published.',
      ],
    ],
  },
  {
    id: 'recommendations',
    title: 'How recommendations work',
    blocks: [
      'When you compare, we rank the ordering options you’ve allowed in your filters (for example, which apps you use, or delivery only) by estimated all-in price and eligible public deals. The winner can be an app, pickup, the drive-thru, or calling the restaurant.',
      'Compare results, rankings, and “Most popular” and “Recommended for you” lists are never influenced by payment. A provider or restaurant can’t pay to rank higher or to change a price we show. A recommendation is information to help you decide, not a guarantee that it will be the cheapest when you order.',
    ],
  },
  {
    id: 'sponsored',
    title: 'Sponsored listings and deals',
    blocks: [
      'Restaurants and brands can pay to appear in dedicated spots on Nibble, such as home page banners and the “Sponsored” row. This is how we keep Nibble free.',
      [
        'Every paid placement is labelled “Sponsored”.',
        'Sponsored spots are kept separate. They never change compare results, prices, all-in estimates, or which option we recommend.',
        'Being sponsored doesn’t mean a restaurant is cheaper, better, or endorsed by Nibble.',
        '“Deal” banners and badges show public promotions offered by a provider or restaurant. They aren’t paid placements, and the provider’s terms for the deal apply.',
      ],
    ],
  },
  {
    id: 'ordering',
    title: 'Ordering and payment happen elsewhere',
    blocks: [
      'Your Nibble cart is a comparison basket, not an order. When you continue to a provider, you leave Nibble: we open their app or website, start a phone call, or give you directions.',
      [
        'Your order, payment, delivery, refunds, and customer support are handled by that provider under their own terms and privacy policy.',
        'Nibble doesn’t charge your card or take payment for food.',
        'For problems with an order, contact the provider or restaurant you ordered from.',
      ],
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party names and content',
    blocks: [
      'Skip, DoorDash, Uber Eats, Instacart, Grubhub, Fantuan, and restaurant names, logos, and menus belong to their owners. We show them so you can compare. Nibble is not affiliated with or endorsed by these companies unless we say so.',
      'Maps and address lookups use data from OpenStreetMap contributors, available under the Open Database License.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    blocks: [
      'Use Nibble for your own personal food decisions. Please don’t:',
      [
        'Scrape, copy, or resell Nibble’s prices, comparisons, or matching data.',
        'Use bots or automated tools to run large numbers of compares or strain our systems.',
        'Try to break into accounts or systems, or get around limits or security features.',
        'Use Nibble for anything unlawful, or to mislead others about prices or businesses.',
      ],
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers and liability',
    blocks: [
      'We work to keep prices and matches accurate, but Nibble is provided as is. We don’t promise that every listing is complete, current, or error-free, or that the service will always be available.',
      'To the extent the law allows, Nibble isn’t responsible for differences between the prices we show and what you pay, or for the food, delivery, service, or conduct of any provider or restaurant. Nothing in these terms limits rights you have under consumer protection law that can’t be waived.',
    ],
  },
  {
    id: 'ending',
    title: 'Suspension and closing your account',
    blocks: [
      'You can stop using Nibble at any time and delete your account from Manage account.',
      'We may suspend or close accounts that break these terms or put other people or the service at risk. Where it’s reasonable, we’ll tell you why.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    blocks: [
      'As Nibble grows, for example when we add more ways to order, these terms may change. We’ll update the date at the top and point out important changes in the app before they take effect. If you keep using Nibble after that, the new terms apply.',
    ],
  },
  {
    id: 'law',
    title: 'Governing law',
    blocks: [
      'These terms are governed by the laws of New Brunswick and the federal laws of Canada that apply there.',
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of service"
      updated="September 26, 2026"
      intro={
        <p>
          These terms cover your use of Nibble: the website, app, and comparisons we show. By using Nibble
          you agree to them. The summary below is a quick read; the numbered sections are the full terms.
        </p>
      }
      highlights={HIGHLIGHTS}
      sections={SECTIONS}
    />
  )
}
