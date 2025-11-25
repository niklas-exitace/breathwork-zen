'use client'

import { useEffect, useState } from 'react'

type QuizStep = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'result' | 'email' | 'complete'

interface QuizAnswers {
  stress: string
  sleep: string
  experience: string
  goal: string
  time: string
}

export default function Home() {
  const [step, setStep] = useState<QuizStep>('intro')
  const [answers, setAnswers] = useState<QuizAnswers>({
    stress: '',
    sleep: '',
    experience: '',
    goal: '',
    time: ''
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [result, setResult] = useState<'calm' | 'focus' | 'sleep' | 'energy'>('calm')

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

  // Calculate result based on answers
  const calculateResult = () => {
    const { stress, sleep, goal } = answers

    if (goal === 'sleep' || sleep === 'poor') return 'sleep'
    if (goal === 'focus') return 'focus'
    if (goal === 'energy' || stress === 'low') return 'energy'
    return 'calm'
  }

  const handleAnswer = (question: keyof QuizAnswers, answer: string) => {
    setAnswers(prev => ({ ...prev, [question]: answer }))

    // Progress to next step
    const steps: QuizStep[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'result']
    const currentIndex = steps.indexOf(step as any)

    if (currentIndex < steps.length - 1) {
      setTimeout(() => setStep(steps[currentIndex + 1]), 300)
    } else {
      setResult(calculateResult())
      setTimeout(() => setStep('result'), 300)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          variant: 'breathwork-zen',
          quizResult: result,
          answers
        })
      })

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead')
      }

      setStep('complete')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resultContent = {
    calm: {
      title: 'The Calm Seeker',
      description: 'Your nervous system is craving stillness. The techniques in your personalized guide focus on activating your parasympathetic response for deep, lasting calm.',
      techniques: ['Box Breathing', '4-7-8 Method', 'Coherent Breathing']
    },
    focus: {
      title: 'The Focus Builder',
      description: 'Mental clarity is your priority. Your guide emphasizes techniques that sharpen attention and clear brain fog through rhythmic, energizing patterns.',
      techniques: ['Kapalabhati', 'Alternate Nostril', 'Box Breathing']
    },
    sleep: {
      title: 'The Rest Restorer',
      description: 'Quality sleep is within reach. Your personalized guide features techniques specifically designed to prepare your body and mind for deep, restorative rest.',
      techniques: ['4-7-8 Method', 'Body Scan Breathing', 'Extended Exhale']
    },
    energy: {
      title: 'The Energy Cultivator',
      description: 'You\'re ready to elevate your vitality. Your guide includes invigorating techniques that naturally boost energy without caffeine or stimulants.',
      techniques: ['Breath of Fire', 'Energizing Kapalabhati', 'Power Breathing']
    }
  }

  // Progress indicator
  const getProgress = () => {
    const progressMap: Record<QuizStep, number> = {
      intro: 0, q1: 20, q2: 40, q3: 60, q4: 80, q5: 100, result: 100, email: 100, complete: 100
    }
    return progressMap[step]
  }

  // Quiz questions
  const questions = {
    q1: {
      question: 'How would you describe your current stress level?',
      key: 'stress' as const,
      options: [
        { value: 'high', label: 'Constantly overwhelmed', icon: '🌊' },
        { value: 'moderate', label: 'Manageable but present', icon: '⚖️' },
        { value: 'low', label: 'Generally calm', icon: '🌿' }
      ]
    },
    q2: {
      question: 'How is your sleep quality?',
      key: 'sleep' as const,
      options: [
        { value: 'poor', label: 'I struggle to fall or stay asleep', icon: '🌙' },
        { value: 'okay', label: 'It\'s okay, could be better', icon: '😴' },
        { value: 'good', label: 'I sleep well most nights', icon: '✨' }
      ]
    },
    q3: {
      question: 'What\'s your experience with breathwork?',
      key: 'experience' as const,
      options: [
        { value: 'none', label: 'Complete beginner', icon: '🌱' },
        { value: 'some', label: 'Tried it a few times', icon: '🌿' },
        { value: 'regular', label: 'I practice occasionally', icon: '🌳' }
      ]
    },
    q4: {
      question: 'What\'s your primary goal?',
      key: 'goal' as const,
      options: [
        { value: 'calm', label: 'Reduce anxiety & find calm', icon: '🧘' },
        { value: 'focus', label: 'Improve focus & clarity', icon: '🎯' },
        { value: 'sleep', label: 'Better sleep', icon: '💤' },
        { value: 'energy', label: 'More natural energy', icon: '⚡' }
      ]
    },
    q5: {
      question: 'How much time can you dedicate daily?',
      key: 'time' as const,
      options: [
        { value: '5', label: '5 minutes or less', icon: '⏱️' },
        { value: '10', label: '5-10 minutes', icon: '🕐' },
        { value: '15', label: '10-15 minutes', icon: '🕑' },
        { value: '20', label: '15+ minutes', icon: '🕒' }
      ]
    }
  }

  return (
    <main className="bg-zen-bg min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled ? 'bg-zen-bg/95 backdrop-blur-sm shadow-sm' : 'bg-zen-bg/90 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="#" className="font-serif text-2xl tracking-widest text-zen-text hover:opacity-70 transition-opacity">
            ENSŌ
          </a>
          {step !== 'intro' && step !== 'complete' && (
            <div className="text-sm text-zen-slate">
              {step === 'result' || step === 'email' ? 'Your Result' : `Question ${step.replace('q', '')} of 5`}
            </div>
          )}
        </div>
      </nav>

      {/* Progress Bar */}
      {step !== 'intro' && step !== 'complete' && (
        <div className="fixed top-[72px] left-0 right-0 h-1 bg-zen-border z-40">
          <div
            className="h-full bg-zen-amber transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      )}

      {/* INTRO */}
      {step === 'intro' && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 rounded-full border border-zen-amber/20 bg-zen-amber/5 animate-breathe blur-3xl" />
          </div>

          <div className="text-center max-w-2xl mx-auto animate-fade-up">
            <p className="text-zen-slate uppercase tracking-[0.3em] text-xs mb-6">Free Personalized Guide</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight text-zen-text font-light mb-6">
              Discover Your <br /><span className="italic text-zen-amber/80">Breathing Type</span>
            </h1>
            <p className="text-zen-slate text-lg font-light leading-relaxed mb-10">
              Take this 60-second assessment to receive a personalized breathwork guide
              tailored to your unique needs and goals.
            </p>

            <button
              onClick={() => setStep('q1')}
              className="btn-zen inline-block px-12"
            >
              Begin Assessment
            </button>

            <p className="text-xs text-zen-slate/60 mt-6">
              5 simple questions • Takes 60 seconds • Free PDF guide
            </p>
          </div>
        </section>
      )}

      {/* QUIZ QUESTIONS */}
      {(['q1', 'q2', 'q3', 'q4', 'q5'] as const).map(qStep => {
        if (step !== qStep) return null
        const q = questions[qStep]

        return (
          <section key={qStep} className="min-h-screen flex flex-col justify-center items-center px-6 pt-24">
            <div className="max-w-xl mx-auto w-full animate-fade-up">
              <h2 className="font-serif text-2xl md:text-3xl text-zen-text text-center mb-10 font-light">
                {q.question}
              </h2>

              <div className="space-y-4">
                {q.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(q.key, option.value)}
                    className={`w-full p-5 border border-zen-border rounded-lg text-left transition-all duration-300 hover:border-zen-amber hover:bg-zen-amber/5 group ${
                      answers[q.key] === option.value ? 'border-zen-amber bg-zen-amber/5' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-zen-text group-hover:text-zen-amber transition-colors">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* RESULT */}
      {step === 'result' && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-24">
          <div className="max-w-xl mx-auto w-full text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-zen-amber/30 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-zen-amber/10 animate-breathe" />
            </div>

            <p className="text-zen-slate uppercase tracking-[0.3em] text-xs mb-4">Your Breathing Profile</p>
            <h2 className="font-serif text-3xl md:text-4xl text-zen-text mb-4 font-light">
              {resultContent[result].title}
            </h2>
            <p className="text-zen-slate font-light leading-relaxed mb-8">
              {resultContent[result].description}
            </p>

            <div className="bg-zen-paper border border-zen-border rounded-lg p-6 mb-8">
              <p className="text-sm text-zen-slate uppercase tracking-wider mb-4">Recommended Techniques</p>
              <div className="flex flex-wrap justify-center gap-2">
                {resultContent[result].techniques.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-zen-border rounded-full text-sm text-zen-text">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('email')}
              className="btn-zen inline-block px-12"
            >
              Get Your Free Guide
            </button>
          </div>
        </section>
      )}

      {/* EMAIL CAPTURE */}
      {step === 'email' && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-24">
          <div className="max-w-md mx-auto w-full text-center animate-fade-up">
            <h2 className="font-serif text-2xl md:text-3xl text-zen-text mb-4 font-light">
              Your Personalized Guide is Ready
            </h2>
            <p className="text-zen-slate font-light mb-8">
              Enter your email to receive your free "{resultContent[result].title}" breathwork guide.
            </p>

            <div className="bg-white border border-zen-border rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-6 text-sm text-zen-slate">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF Guide + Audio Companion</span>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                  {loading ? 'Sending...' : 'Send My Free Guide'}
                </button>
              </form>

              <p className="text-xs text-zen-slate/60 mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* COMPLETE */}
      {step === 'complete' && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-24">
          <div className="max-w-md mx-auto w-full text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-serif text-3xl text-zen-text mb-4 font-light">
              Check Your Inbox
            </h2>
            <p className="text-zen-slate font-light mb-8">
              Your personalized "{resultContent[result].title}" guide is on its way to <strong>{email}</strong>
            </p>

            <div className="bg-zen-paper border border-zen-border rounded-lg p-6 text-left">
              <p className="font-medium text-zen-text mb-3">What's in your guide:</p>
              <ul className="space-y-2 text-sm text-zen-slate">
                <li className="flex items-start gap-2">
                  <span className="text-zen-amber">✓</span>
                  <span>Step-by-step technique instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zen-amber">✓</span>
                  <span>When to use each technique</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zen-amber">✓</span>
                  <span>7-day practice schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zen-amber">✓</span>
                  <span>Quick-reference breathing chart</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-zen-slate/60 mt-8 font-serif italic">
              "Breath is the bridge which connects life to consciousness." — Thich Nhat Hanh
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zen-slate/50 border-t border-zen-border mt-auto">
        <p>&copy; 2024 Ensō Breathwork. Stillness is the key.</p>
      </footer>
    </main>
  )
}
