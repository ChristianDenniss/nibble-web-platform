import { Navigate } from 'react-router-dom'
import { paths } from '@/routing/paths'
export default function CheckoutPage() { return <Navigate to={paths.cartCompare} replace /> }
