'use client'

import CreatorLanding from './CreatorLanding'
import Hero from './Hero'
import FeatureCards from './FeatureCards'
import Header from './Header'
import { AuthProvider } from '@/lib/auth/AuthContext'

// Export individual components
export { CreatorLanding, Hero, FeatureCards, Header }

// Export default landing page with AuthProvider
const LandingPage = () => {
  return (
    <AuthProvider>
      <CreatorLanding />
    </AuthProvider>
  )
}

export default LandingPage
