import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const COLORS = {
  text: rgb(0.16, 0.14, 0.14),      // #292524
  slate: rgb(0.39, 0.45, 0.55),     // #64748B
  amber: rgb(0.71, 0.33, 0.04),     // #B45309
  bg: rgb(0.98, 0.98, 0.98),        // #FAFAF9
}

const resultContent = {
  calm: {
    title: 'The Calm Seeker',
    subtitle: "The Calm Seeker's Path to Stillness",
    description: 'Your nervous system is craving stillness. The techniques below focus on activating your parasympathetic response for deep, lasting calm.',
    techniques: ['Box Breathing', '4-7-8 Method', 'Coherent Breathing'],
  },
  focus: {
    title: 'The Focus Builder',
    subtitle: "The Focus Builder's Guide to Clarity",
    description: 'Mental clarity is your priority. These techniques sharpen attention and clear brain fog through rhythmic, energizing patterns.',
    techniques: ['Kapalabhati', 'Alternate Nostril', 'Box Breathing'],
  },
  sleep: {
    title: 'The Rest Restorer',
    subtitle: "The Rest Restorer's Sleep Protocol",
    description: 'Quality sleep is within reach. These techniques are specifically designed to prepare your body and mind for deep, restorative rest.',
    techniques: ['4-7-8 Method', 'Body Scan Breathing', 'Extended Exhale'],
  },
  energy: {
    title: 'The Energy Cultivator',
    subtitle: "The Energy Cultivator's Vitality System",
    description: "You're ready to elevate your vitality. These invigorating techniques naturally boost energy without caffeine or stimulants.",
    techniques: ['Breath of Fire', 'Energizing Kapalabhati', 'Power Breathing'],
  },
}

const techniques: Record<string, { name: string; best: string; pattern: string; instructions: string[] }> = {
  'Box Breathing': {
    name: 'Box Breathing',
    best: 'Stress reduction, focus, balance',
    pattern: 'Inhale 4s > Hold 4s > Exhale 4s > Hold 4s',
    instructions: [
      'Sit comfortably with a straight spine',
      'Breathe in through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your nose for 4 counts',
      'Hold empty for 4 counts',
      'Repeat for 4-5 minutes',
    ],
  },
  '4-7-8 Method': {
    name: '4-7-8 Breathing',
    best: 'Sleep, anxiety relief, instant calm',
    pattern: 'Inhale 4s > Hold 7s > Exhale 8s',
    instructions: [
      'Place tongue tip behind upper front teeth',
      'Exhale completely through your mouth',
      'Close mouth, inhale through nose for 4 counts',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat for 4 cycles',
    ],
  },
  'Coherent Breathing': {
    name: 'Coherent Breathing',
    best: 'HRV optimization, sustained calm',
    pattern: 'Inhale 5s > Exhale 5s (no holds)',
    instructions: [
      'Set a timer for 5-20 minutes',
      'Breathe in for 5 seconds',
      'Breathe out for 5 seconds',
      'Continue without pausing',
      'Keep the breath smooth and gentle',
    ],
  },
  'Kapalabhati': {
    name: 'Kapalabhati (Skull Shining)',
    best: 'Mental clarity, energy boost',
    pattern: 'Quick exhales through nose, passive inhales',
    instructions: [
      'Sit tall with relaxed shoulders',
      'Take a deep breath in',
      'Exhale sharply through nose, pulling navel in',
      'Let inhale happen passively',
      'Repeat 20-30 times',
      'Rest and breathe normally',
    ],
  },
  'Alternate Nostril': {
    name: 'Alternate Nostril Breathing',
    best: 'Mental clarity, balance, pre-meditation',
    pattern: 'Left in > Hold > Right out > Right in > Hold > Left out',
    instructions: [
      'Use right thumb to close right nostril',
      'Inhale through left nostril (4 counts)',
      'Close both nostrils, hold (4 counts)',
      'Release right, exhale through right (4 counts)',
      'Inhale through right (4 counts)',
      'Close both, hold (4 counts)',
      'Release left, exhale through left (4 counts)',
    ],
  },
  'Body Scan Breathing': {
    name: 'Body Scan Breathing',
    best: 'Pre-sleep relaxation, tension release',
    pattern: 'Slow breaths while scanning body',
    instructions: [
      'Lie down comfortably',
      'Take slow, deep breaths',
      'Focus attention on your feet',
      'Breathe into any tension you find',
      'Slowly move attention up through body',
      'Release tension with each exhale',
    ],
  },
  'Extended Exhale': {
    name: 'Extended Exhale',
    best: 'Calming, sleep preparation',
    pattern: 'Inhale 4s > Exhale 6-8s',
    instructions: [
      'Breathe in for 4 counts',
      'Exhale slowly for 6-8 counts',
      'Make exhale longer than inhale',
      'Keep breath smooth and gentle',
      'Continue for 5-10 minutes',
    ],
  },
  'Breath of Fire': {
    name: 'Breath of Fire',
    best: 'Energy, alertness, core activation',
    pattern: 'Rapid equal inhales and exhales',
    instructions: [
      'Sit tall with hands on knees',
      'Begin with rapid, equal breaths',
      'Pump navel with each exhale',
      'Keep chest still, breath through nose',
      'Start with 30 seconds',
      'Rest and repeat',
    ],
  },
  'Energizing Kapalabhati': {
    name: 'Energizing Kapalabhati',
    best: 'Morning energy, mental clarity',
    pattern: 'Vigorous exhales, passive inhales',
    instructions: [
      'Sit comfortably with spine straight',
      'Take a deep breath in',
      'Begin rapid, forceful exhales',
      'Pull navel toward spine on each exhale',
      'Do 3 rounds of 30 breaths',
      'Rest between rounds',
    ],
  },
  'Power Breathing': {
    name: 'Power Breathing',
    best: 'Pre-workout, energy boost',
    pattern: 'Deep inhale > Strong exhale',
    instructions: [
      'Stand or sit with good posture',
      'Inhale deeply through nose',
      'Exhale forcefully through mouth',
      'Engage core on exhale',
      'Repeat 10-20 times',
      'Notice the energy surge',
    ],
  },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = (searchParams.get('type') || 'calm') as keyof typeof resultContent

  const content = resultContent[type] || resultContent.calm
  const pdfDoc = await PDFDocument.create()

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)

  const pageWidth = 612
  const pageHeight = 792
  const margin = 50

  // ===== COVER PAGE =====
  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - 100

  // Logo
  page.drawText('ENSO', {
    x: margin,
    y,
    size: 32,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 150

  // Title
  page.drawText('Your Personalized', {
    x: margin,
    y,
    size: 14,
    font: helvetica,
    color: COLORS.slate,
  })

  y -= 40
  page.drawText('Breathwork Guide', {
    x: margin,
    y,
    size: 36,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 50
  page.drawText(content.subtitle, {
    x: margin,
    y,
    size: 18,
    font: timesItalic,
    color: COLORS.amber,
  })

  y -= 80
  const descLines = wrapText(content.description, 70)
  for (const line of descLines) {
    page.drawText(line, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: COLORS.slate,
    })
    y -= 18
  }

  y -= 40
  page.drawText('Recommended Techniques:', {
    x: margin,
    y,
    size: 12,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 25
  for (const tech of content.techniques) {
    page.drawText(`• ${tech}`, {
      x: margin + 10,
      y,
      size: 12,
      font: helvetica,
      color: COLORS.text,
    })
    y -= 20
  }

  // Footer quote
  page.drawText('"Master your breath. Master your life."', {
    x: margin,
    y: 80,
    size: 11,
    font: timesItalic,
    color: COLORS.slate,
  })

  // ===== PAGE 2: THE SCIENCE =====
  page = pdfDoc.addPage([pageWidth, pageHeight])
  y = pageHeight - 80

  page.drawText('The Science of Breath', {
    x: margin,
    y,
    size: 24,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 40
  const scienceIntro = wrapText(
    'You take approximately 20,000 breaths every day. Unlike heart rate or digestion, breathing is the ONE autonomic function you can consciously control. This makes it a direct lever to shift your nervous system state.',
    75
  )
  for (const line of scienceIntro) {
    page.drawText(line, { x: margin, y, size: 11, font: helvetica, color: COLORS.slate })
    y -= 16
  }

  y -= 20
  page.drawText('Your Two Nervous System Modes:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 30
  page.drawText('1. Sympathetic (Fight or Flight)', {
    x: margin,
    y,
    size: 12,
    font: helveticaBold,
    color: COLORS.amber,
  })
  y -= 18
  const sympathetic = ['Fast, shallow breathing', 'Elevated heart rate', 'Stress hormones released', 'Useful for emergencies, harmful when chronic']
  for (const item of sympathetic) {
    page.drawText(`   • ${item}`, { x: margin, y, size: 10, font: helvetica, color: COLORS.slate })
    y -= 15
  }

  y -= 15
  page.drawText('2. Parasympathetic (Rest & Digest)', {
    x: margin,
    y,
    size: 12,
    font: helveticaBold,
    color: COLORS.amber,
  })
  y -= 18
  const parasympathetic = ['Slow, deep breathing', 'Lowered heart rate', 'Calming hormones released', 'Where healing and recovery happen']
  for (const item of parasympathetic) {
    page.drawText(`   • ${item}`, { x: margin, y, size: 10, font: helvetica, color: COLORS.slate })
    y -= 15
  }

  y -= 25
  page.drawText('The Golden Rule:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: COLORS.text,
  })
  y -= 25
  page.drawText('• Longer exhales = Calm (parasympathetic)', { x: margin + 10, y, size: 11, font: helvetica, color: COLORS.text })
  y -= 18
  page.drawText('• Longer inhales = Energy (sympathetic)', { x: margin + 10, y, size: 11, font: helvetica, color: COLORS.text })
  y -= 18
  page.drawText('• Equal inhales/exhales = Balance', { x: margin + 10, y, size: 11, font: helvetica, color: COLORS.text })

  // ===== TECHNIQUE PAGES =====
  for (const techName of content.techniques) {
    const tech = techniques[techName]
    if (!tech) continue

    page = pdfDoc.addPage([pageWidth, pageHeight])
    y = pageHeight - 80

    page.drawText(tech.name, {
      x: margin,
      y,
      size: 22,
      font: helveticaBold,
      color: COLORS.text,
    })

    y -= 30
    page.drawText(`Best For: ${tech.best}`, {
      x: margin,
      y,
      size: 11,
      font: helvetica,
      color: COLORS.amber,
    })

    y -= 40
    page.drawText('The Pattern:', {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: COLORS.text,
    })

    y -= 25
    // Pattern box
    page.drawRectangle({
      x: margin,
      y: y - 25,
      width: pageWidth - margin * 2,
      height: 35,
      color: rgb(0.95, 0.95, 0.94),
    })
    page.drawText(tech.pattern, {
      x: margin + 15,
      y: y - 15,
      size: 13,
      font: helveticaBold,
      color: COLORS.text,
    })

    y -= 60
    page.drawText('Instructions:', {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: COLORS.text,
    })

    y -= 25
    tech.instructions.forEach((instruction, i) => {
      page.drawText(`${i + 1}. ${instruction}`, {
        x: margin + 10,
        y,
        size: 11,
        font: helvetica,
        color: COLORS.slate,
      })
      y -= 22
    })
  }

  // ===== QUICK REFERENCE PAGE =====
  page = pdfDoc.addPage([pageWidth, pageHeight])
  y = pageHeight - 80

  page.drawText('Quick Reference Card', {
    x: margin,
    y,
    size: 24,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 40
  page.drawText('When to Use What:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 30
  const quickRef = [
    ["Can't fall asleep", '4-7-8 Breathing'],
    ['Anxious before a meeting', 'Box Breathing'],
    ['Panic attack / acute stress', 'Physiological Sigh'],
    ['Daily calm practice', 'Coherent Breathing'],
    ['Need mental clarity', 'Alternate Nostril'],
    ['Need energy boost', 'Breath of Fire'],
  ]

  for (const [situation, technique] of quickRef) {
    page.drawText(`• ${situation}`, { x: margin + 10, y, size: 11, font: helvetica, color: COLORS.slate })
    page.drawText(`> ${technique}`, { x: 300, y, size: 11, font: helveticaBold, color: COLORS.text })
    y -= 22
  }

  y -= 30
  page.drawText('Your 7-Day Schedule:', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: COLORS.text,
  })

  y -= 25
  const schedule = [
    ['Day 1-2', 'Box Breathing (AM)', '4-7-8 (PM)'],
    ['Day 3-4', content.techniques[0] + ' (AM)', content.techniques[1] + ' (PM)'],
    ['Day 5-6', content.techniques[1] + ' (AM)', content.techniques[2] + ' (PM)'],
    ['Day 7', 'Your choice (AM)', 'Your choice (PM)'],
  ]

  for (const [day, am, pm] of schedule) {
    page.drawText(day, { x: margin + 10, y, size: 10, font: helveticaBold, color: COLORS.text })
    page.drawText(am, { x: 120, y, size: 10, font: helvetica, color: COLORS.slate })
    page.drawText(pm, { x: 300, y, size: 10, font: helvetica, color: COLORS.slate })
    y -= 20
  }

  // Footer
  y = 80
  page.drawText('"When the breath wanders, the mind also is unsteady.', {
    x: margin,
    y,
    size: 10,
    font: timesItalic,
    color: COLORS.slate,
  })
  y -= 14
  page.drawText('But when the breath is calmed, the mind too will be still."', {
    x: margin,
    y,
    size: 10,
    font: timesItalic,
    color: COLORS.slate,
  })
  y -= 14
  page.drawText('— Hatha Yoga Pradipika', {
    x: margin,
    y,
    size: 10,
    font: helvetica,
    color: COLORS.slate,
  })

  y -= 30
  page.drawText('© 2024 Enso Breathwork', {
    x: margin,
    y,
    size: 9,
    font: helvetica,
    color: COLORS.slate,
  })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="enso-${type}-breathwork-guide.pdf"`,
    },
  })
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)

  return lines
}
