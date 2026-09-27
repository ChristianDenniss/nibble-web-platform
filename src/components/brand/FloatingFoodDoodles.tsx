import { Pizza, Sandwich, Cherry, Croissant, Coffee, IceCreamCone, Cookie, Utensils } from 'lucide-react'

const icons = [Pizza, Cherry, Sandwich, Coffee, Croissant, IceCreamCone, Cookie, Utensils]

export default function FloatingFoodDoodles() {
  return <div className="ambient-food" aria-hidden="true">
    {icons.map((Icon, index) => <span key={index} className={`ambient-food__doodle ambient-food__doodle--${index}`}><Icon strokeWidth={1.5} /></span>)}
  </div>
}
