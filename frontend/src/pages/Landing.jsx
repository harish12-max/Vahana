import AdvertiserSection from '../components/AdvertiserSection.jsx'
import AutoOwnerSection from '../components/AutoOwnerSection.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Navbar from '../components/Navbar.jsx'
import WhyVahana from '../components/WhyVahana.jsx'

function Landing() {
  return (
    <div className="min-w-0 bg-white font-sans text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AdvertiserSection />
        <AutoOwnerSection />
        <WhyVahana />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
