# OniricApp — Design System

Reference this file whenever building or reviewing UI. All new pages and components must follow these patterns.

---

## Color tokens

All colors are CSS variables consumed via Tailwind. Never hardcode hex values.

| Token | Usage |
|-------|-------|
| `primary` | Brand purple — icons, gradients, accents, borders on focused/premium elements |
| `secondary` | Gradient endpoint (lighter purple) — always paired with `primary` in `from-primary to-secondary` |
| `destructive` | Errors, alerts |
| `background` | Page background |
| `foreground` | Body text |
| `muted-foreground` | Secondary / helper text |
| `border` | Neutral dividers and outlines |
| `muted` | Subtle fills (disabled states, info banners) |

---

## Icon container

Two variants depending on context. Always use the two-layer pattern (blur overlay + inner container with shadow).

### Primary (features, success, branding)

```tsx
<div className="relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1">
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm" />
  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-primary">
    <Sparkles className="w-6 h-6 text-primary" />
  </div>
</div>
```

### Destructive (errors)

```tsx
<div className="relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1">
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 blur-sm" />
  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-destructive">
    <AlertCircle className="w-6 h-6 text-destructive" />
  </div>
</div>
```

---

## Typography

### Hero / page title (gradient)

Used on the home page and 404 number. Creates the brand gradient effect.

```tsx
<h1 className="text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-br from-primary via-primary/85 to-secondary bg-clip-text text-transparent leading-tight pb-1">
  Title
</h1>
```

### Section title

```tsx
<h1 className="text-2xl font-semibold text-foreground">Title</h1>
```

### Body / description

```tsx
<p className="text-sm text-muted-foreground max-w-xs">Description text</p>
```

### Logo / brand inline

```tsx
<span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  OniricApp
</span>
```

---

## Buttons

### Primary (CTA)

```tsx
<button className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
  Label
</button>
```

### Ghost / secondary

```tsx
<button className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors">
  Label
</button>
```

### Disabled / full-width (free tier CTA)

```tsx
<button disabled className="w-full rounded-full border border-border px-4 py-2 text-sm text-muted-foreground cursor-default">
  Label
</button>
```

### Full-width primary

```tsx
<button className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity disabled:opacity-60">
  Label
</button>
```

---

## Cards / panels

Glass card — used on auth pages, billing, pricing.

```tsx
<div className="w-full max-w-sm rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-10 shadow-sm">
  {/* content */}
</div>
```

Premium-highlighted card (e.g. pricing):

```tsx
<div className="rounded-2xl border border-primary/40 bg-primary/5 backdrop-blur-md px-8 py-8 relative overflow-hidden">
  {/* content */}
</div>
```

---

## Badges

### Gradient (premium / highlighted)

```tsx
<span className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
  Premium
</span>
```

### Muted (free / neutral)

```tsx
<span className="rounded-full bg-muted text-muted-foreground border border-border px-3 py-0.5 text-xs font-semibold">
  Free
</span>
```

---

## Notification banners

### Success

```tsx
<div className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
  <p className="text-sm text-foreground">Success message</p>
</div>
```

### Info / neutral

```tsx
<div className="flex items-center gap-3 rounded-xl bg-muted border border-border px-4 py-3">
  <p className="text-sm text-muted-foreground">Info message</p>
</div>
```

---

## Layout

### Body structure

```tsx
<body className="flex flex-col min-h-screen pt-12">
  {/* pt-12 compensates for the fixed 48px header */}
  <main className="flex flex-1 flex-col">{children}</main>
</body>
```

### Page container (centered content)

```tsx
<div className="flex flex-1 flex-col items-center px-4 py-16">
  <div className="w-full max-w-md flex flex-col gap-6">
    {/* content */}
  </div>
</div>
```

### Full-screen state pages (error, not-found, empty)

```tsx
<div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
  {/* icon + text + actions */}
</div>
```

---

## Header

Fixed, 48px tall, backdrop blur.

```
position: fixed | top-0 left-0 right-0 | h-12 | z-50
border-b border-border | bg-background/80 backdrop-blur-sm
```

- Left: user menu (only when authenticated)
- Center: logo link (absolute + translate-x-1/2)
- Right: auth buttons + locale switcher

---

## Animations

### Entry animation (fade-up)

Applied via inline style to avoid layout shift. Stagger with increasing delay.

```tsx
<div
  className="opacity-0"
  style={{ animation: "fade-up 0.6s ease-out 0.2s both" }}
>
```

Delays used: `0.2s`, `0.3s`, `0.4s`, `0.6s`.

### Text reveal (AI output)

Word-by-word reveal with 60ms interval per word. Each word uses fade + blur + translateY via CSS transition. Never use character-by-character typewriter.

---

## Lucide icons

| Context | Icon |
|---------|------|
| Brand / features / 404 | `Sparkles` |
| Errors | `AlertCircle` |
| Success / check lists | `Check`, `CheckCircle` |
| Journal | `BookOpen` |
| Loading | `Loader2` (with `animate-spin`) |

Standard size inside icon containers: `w-6 h-6`.
Standard size inline (in text / nav): `w-3.5 h-3.5` or `w-4 h-4`.

---

## Form inputs

Inputs use shadcn/ui `<Input>` component. Labels are `text-sm font-medium text-foreground`. Error messages are `text-xs text-destructive`.

---

## What NOT to do

- Do not use hex colors directly — use Tailwind token classes
- Do not use `sticky` for the header — use `fixed` + `pt-12` on body
- Do not use `grid min-h-dvh` on body — use `flex flex-col min-h-screen`
- Do not use character-by-character typewriter animations for AI text
- Do not add shadow without the corresponding shadow color class (`shadow-primary`, `shadow-destructive`)
- Do not use plain `<a>` for internal navigation — use `<Link>` from `@/i18n/navigation` (locale-aware) or `next/link`
