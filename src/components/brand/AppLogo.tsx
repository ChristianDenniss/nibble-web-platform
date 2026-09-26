/** Shared Nibble brand mark used by storefront and account shells. */
import logoUrl from '../../../LogoNoBG.png'

interface Props {
  className?: string
}

export default function AppLogo({ className = '' }: Props) {
  return (
    <img
      src={logoUrl}
      alt=""
      className={className}
      aria-hidden="true"
    />
  )
}
