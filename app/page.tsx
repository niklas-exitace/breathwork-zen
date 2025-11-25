'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, variant: 'breathwork-zen' })
      })

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead')
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-zen-bg">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full border border-zen-amber/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-zen-amber/10 animate-breathe" />
          </div>
          <h1 className="font-serif text-3xl text-zen-text mb-4">Thank you</h1>
          <p className="text-zen-slate mb-8">
            Your guide is on its way. Check your inbox for your breathwork materials.
          </p>
          <p className="text-sm text-zen-slate/60 italic font-serif">
            Take a moment. Breathe deeply. Your journey begins now.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-zen-bg">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled ? 'bg-zen-bg/95 backdrop-blur-sm shadow-sm' : 'bg-zen-bg/90 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="#" className="font-serif text-2xl tracking-widest text-zen-text hover:opacity-70 transition-opacity">
            ENSŌ
          </a>
          <div className="hidden md:flex items-center space-x-12">
            <a href="#philosophy" className="text-sm uppercase tracking-[0.2em] text-zen-slate hover:text-zen-text transition-colors">Philosophy</a>
            <a href="#practice" className="text-sm uppercase tracking-[0.2em] text-zen-slate hover:text-zen-text transition-colors">Practice</a>
            <a href="#course" className="text-sm uppercase tracking-[0.2em] text-zen-slate hover:text-zen-text transition-colors">Journal</a>
          </div>
          <a href="#join" className="text-sm font-serif italic text-zen-text border-b border-zen-text pb-0.5 hover:text-zen-amber hover:border-zen-amber transition-colors">
            Begin Journey
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden px-6">
        {/* Breathing Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-64 h-64 rounded-full border border-zen-amber/20 bg-zen-amber/5 animate-breathe blur-3xl" />
          <div className="absolute w-96 h-96 rounded-full border border-zen-slate/10 animate-breathe" style={{ animationDelay: '1s' }} />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-zen-slate uppercase tracking-[0.3em] text-xs">A Digital Sanctuary</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-zen-text font-light">
            Return to <br /> <span className="italic text-zen-amber/80">stillness.</span>
          </h1>
          <p className="text-zen-slate text-lg font-light leading-relaxed max-w-lg mx-auto pt-4">
            A guided breathwork course designed to quiet the mind, soften the body, and restore your natural rhythm.
          </p>

          <div className="pt-10">
            <a href="#philosophy" className="group inline-flex flex-col items-center gap-2 text-zen-text text-sm tracking-widest uppercase transition-all duration-500 hover:opacity-60">
              <span>Explore</span>
              <div className="h-12 w-[1px] bg-zen-text/30 group-hover:h-16 transition-all duration-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="thin-line max-w-6xl mx-auto" />

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center reveal">
          <svg className="w-8 h-8 mx-auto mb-8 text-zen-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
          </svg>
          <h2 className="font-serif text-3xl md:text-4xl text-zen-text mb-10 font-light">The Space Between</h2>
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 text-left font-light text-zen-text/80 leading-loose text-lg">
            <p>
              In a world that demands constant motion, stillness becomes a radical act. We believe that the breath is the bridge between the mind and the body, the conscious and the unconscious.
            </p>
            <p>
              Ensō is not about achieving a state of perfection. It is about arriving, exactly as you are, and finding the quiet capability that already exists within your lungs.
            </p>
          </div>
        </div>
      </section>

      {/* Features / Benefits */}
      <section id="practice" className="py-24 bg-zen-paper border-y border-zen-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-zen-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: 'Regulation',
                description: 'Learn to engage the parasympathetic nervous system, shifting from fight-or-flight to rest-and-digest in moments.'
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-zen-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M12 3v19M5 10l14 0M7 15h10" />
                  </svg>
                ),
                title: 'Balance',
                description: 'Techniques derived from Pranayama and modern science to harmonize your energy levels throughout the day.'
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-zen-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                ),
                title: 'Clarity',
                description: 'Clear mental fog and emotional debris through sustained, rhythmic breathing patterns designed for focus.'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-6 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="font-serif text-xl text-zen-text">{feature.title}</h3>
                <p className="text-zen-slate font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Content Preview */}
      <section id="course" className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Visual Element */}
          <div className="w-full md:w-1/2 reveal">
            <div className="relative aspect-[4/5] bg-white border border-zen-border p-8 shadow-sm flex flex-col justify-between">
              <div className="w-full h-px bg-zen-bg mb-4" />
              <div className="text-center">
                <span className="block font-serif text-4xl italic text-zen-text/20 mb-4">01</span>
                <h3 className="font-serif text-2xl text-zen-text mb-2">Morning Ritual</h3>
                <p className="text-xs uppercase tracking-widest text-zen-slate">Audio Guide • 15 Min</p>
              </div>
              <div className="flex justify-center items-center h-32">
                <div className="w-24 h-24 rounded-full border border-zen-amber/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-zen-amber/5" />
                </div>
              </div>
              <div className="text-center mt-auto">
                <p className="font-serif italic text-zen-slate">&ldquo;Breathing in, I calm body and mind.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="w-full md:w-1/2 reveal">
            <h2 className="font-serif text-3xl md:text-4xl text-zen-text mb-10 font-light">The Collection</h2>
            <p className="text-zen-slate font-light mb-12">
              A curated suite of high-fidelity audio guides and minimalist visual aids, accessible from any device, forever.
            </p>

            <ul className="space-y-6">
              {[
                { num: 'i', title: 'Foundation & Mechanics', desc: 'Understanding diaphragm control and posture.' },
                { num: 'ii', title: 'The Morning Sequence', desc: 'Energizing Kapalabhati and box breathing.' },
                { num: 'iii', title: 'Deep Rest (NSDR)', desc: 'Extended exhalations for sleep and recovery.' },
                { num: 'iv', title: 'Emergency Calm', desc: '3-minute reset for high-stress moments.' }
              ].map((item, i) => (
                <li key={i}>
                  <div className="flex items-start gap-4 group">
                    <span className="font-serif text-zen-amber italic text-xl mt-1">{item.num}.</span>
                    <div>
                      <h4 className="text-zen-text text-lg font-normal group-hover:pl-2 transition-all duration-300">{item.title}</h4>
                      <p className="text-sm text-zen-slate font-light mt-1">{item.desc}</p>
                    </div>
                  </div>
                  {i < 3 && <div className="w-full h-px bg-zen-border mt-6" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 bg-zen-text text-zen-bg px-6">
        <div className="max-w-3xl mx-auto text-center reveal">
          <p className="font-serif text-2xl md:text-4xl leading-relaxed italic opacity-90">
            &ldquo;Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.&rdquo;
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] opacity-60">— Thich Nhat Hanh</p>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="join" className="py-32 px-6 bg-zen-bg">
        <div className="max-w-2xl mx-auto text-center reveal">
          <span className="text-zen-amber text-xs font-bold uppercase tracking-[0.3em] block mb-6">Lifetime Access</span>
          <h2 className="font-serif text-4xl md:text-5xl text-zen-text mb-6">Begin your practice</h2>
          <p className="text-zen-slate font-light mb-12 max-w-md mx-auto">
            One simple purchase. No subscriptions. No notifications. Just the tools you need for a lifetime of breath.
          </p>

          <div className="bg-white p-12 border border-zen-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex justify-center items-baseline gap-2 mb-8">
              <span className="font-serif text-4xl text-zen-text">$49</span>
              <span className="text-zen-slate font-light">USD</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="text-center"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-zen"
              >
                {loading ? 'Processing...' : 'Acquire Course'}
              </button>
            </form>

            <p className="text-xs text-zen-slate/60 font-light italic mt-6">
              Includes 12 audio sessions, digital guide, and lifetime updates.
              <br />30-day peaceful refund policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 pb-12 border-t border-zen-border px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="#" className="font-serif text-xl tracking-widest text-zen-text">
            ENSŌ
          </a>

          <div className="flex gap-8">
            <a href="#" className="text-xs uppercase tracking-widest text-zen-slate hover:text-zen-text transition-colors">Support</a>
            <a href="#" className="text-xs uppercase tracking-widest text-zen-slate hover:text-zen-text transition-colors">Privacy</a>
            <a href="#" className="text-xs uppercase tracking-widest text-zen-slate hover:text-zen-text transition-colors">Login</a>
          </div>

          <p className="text-xs text-zen-slate/50 font-light">
            &copy; 2024 Ensō Breathwork. Stillness is the key.
          </p>
        </div>
      </footer>
    </main>
  )
}
