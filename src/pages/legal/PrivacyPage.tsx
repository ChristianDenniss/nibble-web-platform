/**
 * PrivacyPage — privacy policy reflecting what the storefront and api-engine actually collect.
 * Plain-language draft; have counsel review before public launch.
 */
import { CreditCard, EyeOff, MapPin, Trash2 } from 'lucide-react'
import LegalDocument, { type LegalHighlight, type LegalSection } from '@/components/legal/LegalDocument'

const HIGHLIGHTS: LegalHighlight[] = [
  {
    icon: EyeOff,
    title: 'No selling, no ad tracking',
    body: 'We don’t sell your information, and we don’t use advertising cookies or third-party analytics.',
  },
  {
    icon: MapPin,
    title: 'Location only when you ask',
    body: 'Your address decides which stores, fees, and delivery times apply. We only use GPS when you tap for it.',
  },
  {
    icon: CreditCard,
    title: 'We don’t take payment',
    body: 'You pay the provider you choose. Nibble never charges your card.',
  },
  {
    icon: Trash2,
    title: 'Delete anytime',
    body: 'Remove saved addresses or delete your whole account from your profile.',
  },
]

const SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: 'Who we are',
    blocks: [
      'Nibble compares ways to get food: delivery apps like Skip and DoorDash, and over time restaurant apps, pickup, drive-thru, and calling the restaurant. This policy explains what personal information we collect to do that, why, and the choices you have.',
      'Nibble handles personal information in line with Canadian privacy law, including the Personal Information Protection and Electronic Documents Act (PIPEDA).',
    ],
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    blocks: [
      'Information you give us:',
      [
        'Account details: your name, email, phone number, and sign-in details. If you sign in with Google or Apple, we receive your basic profile (name and email) from them.',
        'Addresses: saved delivery addresses, their labels (like “Home”), and which one is current.',
        'Compare activity: the restaurants, dishes, and basket you compare, the filters you set (like which apps you use or “pickup only”), and the results we showed you.',
        'Memberships you tell us about, such as DashPass, so we can show the prices that apply to you.',
        'Price alerts and watchlists you create.',
        'Saved card labels: card brand, last four digits, and expiry, so you can recognize a card. We don’t charge cards.',
      ],
      'Information collected when you use Nibble:',
      [
        'Precise location, only when you tap “Use current location” and allow it in your browser, or when you drop a pin on the map.',
        'Outbound choices: which option you continue to (a provider link, a phone call, or directions), so we know which comparisons are useful.',
        'Technical data: IP address, browser and device type, and request logs, used to keep the service secure and fix problems.',
      ],
    ],
  },
  {
    id: 'what-we-dont',
    title: 'What we don’t collect',
    blocks: [
      [
        'We don’t see your orders, payments, or receipts on Skip, DoorDash, or any other provider after you leave Nibble.',
        'We don’t ask for or log into your provider accounts.',
        'We don’t use advertising cookies, ad networks, or third-party analytics trackers.',
      ],
    ],
  },
  {
    id: 'how-we-use',
    title: 'How we use it',
    blocks: [
      [
        'Show stores and offers near your delivery address, and estimate delivery fees and times for that address.',
        'Work out all-in prices and rank ordering options within the filters you set.',
        'Remember your addresses, preferences, and past compares so you don’t start over.',
        'Send price alerts you’ve asked for.',
        'Improve how we match the same restaurant and dish across providers, and fix wrong prices.',
        'Protect Nibble and our users from fraud, abuse, and security threats.',
      ],
      'We don’t use your information to build advertising profiles, and we don’t rank options based on payments from providers.',
    ],
  },
  {
    id: 'location',
    title: 'Location, maps, and address lookups',
    blocks: [
      'Prices, fees, and which stores deliver to you depend on where you are, so location is central to Nibble. Here’s how it works:',
      [
        'GPS: we ask your browser for your location only when you tap “Use current location.” You can deny or revoke this in your browser settings at any time.',
        'Current location and dropped pins are kept in your browser’s session storage and cleared when you close the tab. They aren’t saved to your account unless you save them as an address.',
        'Address lookups: when you drop a pin, we send its coordinates to OpenStreetMap’s Nominatim service to find the nearest street address.',
        'Maps: map images load from OpenStreetMap’s servers, which receive your IP address and the area you’re viewing, as with any website.',
      ],
    ],
  },
  {
    id: 'sharing',
    title: 'When we share information',
    blocks: [
      'We don’t sell personal information or share it for advertising. We share it only in these cases:',
      [
        'Providers you choose: when you continue to Skip, DoorDash, or a restaurant, you go to their app, website, or phone line. Anything you give them there is covered by their privacy policy. The link may tell them you came from Nibble.',
        'Service providers: companies that host and run our infrastructure on our behalf. They can use information only to provide those services.',
        'OpenStreetMap: pin coordinates for address lookups, and map requests, as described above.',
        'Legal reasons: when the law requires it, or to protect the rights, safety, or property of our users or Nibble.',
        'Business changes: if Nibble is merged or sold, your information may transfer under the same protections, and we’ll let you know.',
      ],
    ],
  },
  {
    id: 'browser-storage',
    title: 'Browser storage',
    blocks: [
      'Nibble uses your browser’s storage for things the app needs to work, not for tracking:',
      [
        'Session storage: your current delivery location or dropped pin. It is cleared when you close the tab.',
        'Local storage: display preferences, like layout settings.',
      ],
      'We don’t set advertising or cross-site tracking cookies.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    blocks: [
      [
        'Account details, saved addresses, preferences, and alerts: until you change them or delete your account.',
        'Compare history and outbound choices: while your account is active, to power your history and improve matching. After that we delete it or remove anything that identifies you.',
        'Server logs: for a limited time, for security and debugging.',
      ],
      'Menu prices and fees we collect from providers aren’t personal information. We keep them to track how prices change over time.',
    ],
  },
  {
    id: 'your-choices',
    title: 'Your choices and rights',
    blocks: [
      [
        'Update your name, email, and phone in Manage account.',
        'Add, change, or remove delivery addresses on the Location page.',
        'Turn off location access in your browser. You can still type an address.',
        'Delete your account from Manage account. This removes your profile, saved addresses, saved card labels, preferences, and alerts, and unlinks your compare history.',
      ],
      'You can also ask to see the personal information we hold about you, ask us to correct it, or withdraw consent for optional uses. Reach us through the Help page.',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    blocks: [
      'We use reasonable safeguards, like encrypted connections and limited access, to protect your information. No system is perfectly secure, so please use a strong, unique password and tell us if you notice anything unusual.',
    ],
  },
  {
    id: 'children',
    title: 'Children',
    blocks: [
      'Nibble isn’t meant for children, and we don’t knowingly collect information from children under 13. If you think a child has given us information, contact us and we’ll delete it.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    blocks: [
      'We’ll update this policy as Nibble changes, for example when we add more ordering options or new features. We’ll change the date at the top and point out important changes in the app before they take effect.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      updated="September 26, 2026"
      intro={
        <p>
          Nibble needs a little information, mostly your delivery address, to show what food really costs
          where you are. Here’s exactly what we collect, what we don’t, and how to control it.
        </p>
      }
      highlights={HIGHLIGHTS}
      sections={SECTIONS}
    />
  )
}
