import React from 'react'

import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import WhyUs from './sections/WhyUs'
import Steps from './sections/Steps'
import Pricing from './sections/Pricing'
import Footer from './sections/Footer'

import './LandingPage.css'

const LandingPage = () => {
  return (
    <div id='landing-container'>
        <Navbar/>
        <Hero/>
        <WhyUs/>
        <Steps/>
        <Pricing/>
        <Footer/>
    </div>
  )
}

export default LandingPage
