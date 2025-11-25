'use client'

import { useEffect, useState } from 'react'

type QuizStep = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'result'

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
  const calculateResult = (): 'calm' | 'focus' | 'sleep' | 'energy' => {
    const { sleep, goal, stress } = answers

    if (goal === 'sleep' || sleep === 'poor') return 'sleep'
    if (goal === 'focus') return 'focus'
    if (goal === 'energy' || stress === 'low') return 'energy'
    return 'calm'
  }

  const handleAnswer = (question: keyof QuizAnswers, answer: string) => {
    const newAnswers = { ...answers, [question]: answer }
    setAnswers(newAnswers)

    // Progress to next step
    const steps: QuizStep[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'result']
    const currentIndex = steps.indexOf(step as any)

    if (currentIndex < steps.length - 1) {
      setTimeout(() => setStep(steps[currentIndex + 1]), 300)
    }

    // If this is the last question, calculate result
    if (step === 'q5') {
      // Calculate with new answers since state hasn't updated yet
      const finalAnswers = { ...answers, [question]: answer }
      let finalResult: 'calm' | 'focus' | 'sleep' | 'energy' = 'calm'

      if (finalAnswers.goal === 'sleep' || finalAnswers.sleep === 'poor') finalResult = 'sleep'
      else if (finalAnswers.goal === 'focus') finalResult = 'focus'
      else if (finalAnswers.goal === 'energy' || finalAnswers.stress === 'low') finalResult = 'energy'

      setResult(finalResult)
      setTimeout(() => setStep('result'), 300)
    }
  }

  const handleDownload = () => {
    // Track conversion
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: result })
    }

    // Download PDF
    window.open('/guides/enso-breathwork-guide.pdf', '_blank')
  }

  const resultContent = {
    calm: {
      title: 'The Calm Seeker',
      description: 'Your nervous system is craving stillness. The techniques in your personalized guide focus on activating your parasympathetic response for deep, lasting calm.',
      techniques: ['Box Breathing', '4-7-8 Method', 'Coherent Breathing'],
      color: 'zen-amber'
    },
    focus: {
      title: 'The Focus Builder',
      description: 'Mental clarity is your priority. Your guide emphasizes techniques that sharpen attention and clear brain fog through rhythmic, energizing patterns.',
      techniques: ['Kapalabhati', 'Alternate Nostril', 'Box Breathing'],
      color: 'blue-500'
    },
    sleep: {
      title: 'The Rest Restorer',
      description: 'Quality sleep is within reach. Your personalized guide features techniques specifically designed to prepare your body and mind for deep, restorative rest.',
      techniques: ['4-7-8 Method', 'Body Scan Breathing', 'Extended Exhale'],
      color: 'purple-500'
    },
    energy: {
      title: 'The Energy Cultivator',
      description: 'You\'re ready to elevate your vitality. Your guide includes invigorating techniques that naturally boost energy without caffeine or stimulants.',
      techniques: ['Breath of Fire', 'Energizing Kapalabhati', 'Power Breathing'],
      color: 'orange-500'
    }
  }

  // Progress indicator
  const getProgress = () => {
    const progressMap: Record<QuizStep, number> = {
      intro: 0, q1: 20, q2: 40, q3: 60, q4: 80, q5: 100, result: 100
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
          <a href="#" onClick={() => setStep('intro')} className="font-serif text-2xl tracking-widest text-zen-text hover:opacity-70 transition-opacity">
            ENSŌ
          </a>
          {step !== 'intro' && step !== 'result' && (
            <div className="text-sm text-zen-slate">
              Question {step.replace('q', '')} of 5
            </div>
          )}
        </div>
      </nav>

      {/* Progress Bar */}
      {step !== 'intro' && step !== 'result' && (
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
              5 simple questions • Takes 60 seconds • Instant PDF download
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

      {/* RESULT + DOWNLOAD */}
      {step === 'result' && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12">
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

            {/* Download Card */}
            <div className="bg-white border border-zen-border rounded-lg p-8 shadow-sm mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-8 h-8 text-zen-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h3 className="font-serif text-xl text-zen-text mb-2">Your Personalized Guide</h3>
              <p className="text-sm text-zen-slate mb-6">
                8-page PDF with techniques, schedules & quick-reference cards
              </p>

              <button
                onClick={handleDownload}
                className="btn-zen inline-block px-12"
              >
                Download Free Guide
              </button>
            </div>

            {/* What's Inside */}
            <div className="text-left bg-zen-paper border border-zen-border rounded-lg p-6">
              <p className="font-medium text-zen-text mb-3 text-center">What's in your guide:</p>
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

            {/* Retake */}
            <button
              onClick={() => {
                setStep('intro')
                setAnswers({ stress: '', sleep: '', experience: '', goal: '', time: '' })
              }}
              className="mt-8 text-sm text-zen-slate hover:text-zen-text transition-colors"
            >
              ← Retake assessment
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zen-slate/50 border-t border-zen-border">
        <p>&copy; 2024 Ensō Breathwork. Stillness is the key.</p>
      </footer>
    </main>
  )
}
