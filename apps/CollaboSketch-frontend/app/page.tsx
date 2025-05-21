import React from 'react';
import Header from '@repo/ui/header';
import Hero from '@repo/ui/hero';
import Features from '@repo/ui/features';
import Collaboration from '@repo/ui/collaboration';
import CTA from '@repo/ui/CTA';
import Footer from '@repo/ui/footer';
import Testtimonal from '@repo/ui/testimonial';
import "./globals.css"



function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <Collaboration />
        <Testtimonal />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;