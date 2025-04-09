import React from 'react'

import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import WhyUs from './sections/WhyUs'
import Steps from './sections/Steps'
import Pricing from './sections/Pricing'
import Footer from './sections/Footer'

const LandingPage = () => {
  return (
    <>
        <Navbar/>
        <Hero/>
        <WhyUs/>
        <Steps/>
        <Pricing/>
        <Footer/>
    </>
  )
}

export default LandingPage
