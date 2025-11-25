# Breathwork Zen - Landing Page

Minimal, Japanese-inspired breathwork course landing page.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO/breathwork-zen)

### Manual Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this folder
3. Deploy (zero config needed)

## Local Development

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

## Environment Variables (Optional)

Set in Vercel dashboard or `.env.local`:

```env
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Structure

```
breathwork-zen/
├── app/
│   ├── globals.css      # Tailwind + custom styles
│   ├── layout.tsx       # Fonts + metadata
│   ├── page.tsx         # Main landing page
│   └── api/
│       └── lead/
│           └── route.ts # Lead capture API
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── next.config.js
```

## Customization

- **Colors**: Edit CSS variables in `app/globals.css`
- **Copy**: Edit text in `app/page.tsx`
- **Fonts**: Change in `app/layout.tsx`

## Lead Capture

Form submissions POST to `/api/lead`. Connect to your CRM by editing `app/api/lead/route.ts`.

Current behavior: logs to console + returns success.

To connect to a service, add your logic:

```typescript
// Example: Send to webhook
await fetch('https://your-webhook.com', {
  method: 'POST',
  body: JSON.stringify({ email, variant: 'breathwork-zen' })
})
```
