# Design Guidelines: Career Guidance & Mentorship Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium education platforms (Masterclass, Coursera) and professional service sites (LinkedIn Learning) to establish credibility and trust while maintaining a sophisticated, timeless aesthetic.

**Core Principle**: "Modern Classic Elegance" - combining contemporary web design patterns with traditional sophistication to position this as a premium, trustworthy educational platform.

---

## Typography System

**Primary Fonts**:
- **Headings**: Playfair Display (serif) - weights 400, 600, 700
- **Body Text**: Inter (sans-serif) - weights 400, 500, 600

**Typography Hierarchy**:
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold, Playfair Display
- Page Titles: text-4xl md:text-5xl, font-semibold, Playfair Display
- Section Headers: text-3xl md:text-4xl, font-semibold, Playfair Display
- Card Titles: text-xl md:text-2xl, font-semibold, Inter
- Body Large: text-lg md:text-xl, font-normal, Inter
- Body Standard: text-base, font-normal, Inter, leading-relaxed
- Body Small: text-sm, font-normal, Inter
- Captions: text-xs, font-medium, Inter, uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Component padding: p-6 to p-8
- Section padding vertical: py-16 md:py-24 lg:py-32
- Section padding horizontal: px-6 md:px-12 lg:px-20
- Card gaps: gap-6 to gap-8
- Element spacing: space-y-4, space-y-6, space-y-8

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Text-heavy content: max-w-4xl mx-auto
- Narrow content (testimonials, CTAs): max-w-3xl mx-auto

**Grid Layouts**:
- Course cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-4, gap-6
- Testimonials: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- Mentor bios: grid-cols-1 md:grid-cols-2, gap-12

---

## Component Library

### Navigation
**Desktop Header**:
- Fixed top navigation with subtle shadow
- Logo left (text-2xl Playfair Display)
- Center navigation links (text-base Inter, font-medium, tracking-wide)
- Right side: "Sign In" + "Get Started" CTA button
- Height: h-20
- Padding: px-8

**Mobile Navigation**:
- Hamburger menu icon
- Full-screen slide-in menu
- Stacked links with generous spacing (py-4)

### Hero Section (Home Page)
**Layout**: Split-screen asymmetric design
- Left 55%: Content (headline, subheadline, CTAs, trust indicators)
- Right 45%: Large hero image

**Content Structure**:
- Headline: 2-3 lines maximum, Playfair Display
- Subheadline: 1-2 sentences, Inter, text-lg, leading-relaxed
- Primary CTA: Large button with backdrop-blur-md
- Secondary CTA: Ghost/outline button
- Trust badge row: "Trusted by 5,000+ professionals" with small logos or stats

**Spacing**: pt-24 pb-16 md:pt-32 md:pb-24

### Course Cards
**Structure**:
- Aspect ratio 16:9 thumbnail with overlay gradient on hover
- Instructor avatar (small, rounded-full, -mt-6 overlapping thumbnail)
- Category badge (absolute top-4 left-4, small pill)
- Title: text-xl font-semibold, 2-line clamp
- Instructor name: text-sm font-medium
- Rating stars + enrollment count
- Price (text-2xl font-bold) + "Enroll Now" button
- Border with subtle shadow, rounded-xl
- Hover: Lift effect with increased shadow

### Dashboard Layout
**Sidebar Navigation** (Desktop):
- Fixed left sidebar, w-64
- Vertical navigation items with icons
- User profile section at top
- Padding: p-6
- Each nav item: py-3 px-4, rounded-lg

**Main Content Area**:
- ml-64 on desktop
- Full width on mobile
- Content padding: p-6 md:p-8 lg:p-12

**Progress Tracking Components**:
- Progress bar: h-2 rounded-full with percentage indicator
- Lesson list: Checklist style with completion checkboxes
- "Mark Complete" button: Full width on mobile, inline on desktop

### Course Detail Page
**Header Section**:
- Full-width banner with gradient overlay
- Breadcrumb navigation
- Course title (text-4xl md:text-5xl Playfair)
- Instructor info with avatar
- Star rating and enrollment stats

**Content Layout**: Two-column on desktop
- Left column (66%): Course description, syllabus accordion, instructor bio
- Right column (34%): Sticky purchase card with price, CTA, includes list, money-back badge

**Syllabus Accordion**:
- Sections expandable with lesson count and total duration
- Individual lessons show video icon, title, duration
- Clean borders between sections

### Testimonial Cards
**Layout**: Three-column grid
- Quote marks (large, decorative)
- Testimonial text: text-base, leading-relaxed, 4-line clamp
- Student info: Avatar (rounded-full), name (font-semibold), role/company (text-sm)
- Card: Subtle border, rounded-2xl, p-8
- Shadow on hover

### Admin Panel
**Dashboard Cards**: 4-column metric cards
- Large number display (text-4xl font-bold)
- Label below (text-sm uppercase tracking-wide)
- Icon in top-right corner
- Subtle background treatment

**Course Management Table**:
- Alternating row treatment
- Column headers: uppercase, text-sm, font-semibold
- Action buttons: Edit (ghost), Delete (danger outline)
- Responsive: Stack on mobile

### Forms
**Input Fields**:
- Label above: text-sm font-medium, mb-2
- Input: rounded-lg, border-2, px-4 py-3
- Focus: Ring treatment (ring-4 ring-opacity-20)
- Height: h-12 for standard inputs

**Buttons**:
- Primary: Solid, rounded-lg, px-8 py-3, text-base font-semibold
- Secondary: Outline variant with same sizing
- Large CTA: px-10 py-4, text-lg
- Small action: px-4 py-2, text-sm
- Disabled state: Reduced opacity, cursor-not-allowed

### Footer
**Multi-column Layout**: 4 columns on desktop, stack on mobile
- Column 1: Logo + mission statement (max-w-xs)
- Columns 2-3: Quick links organized by category
- Column 4: Newsletter signup + social icons
- Bottom bar: Copyright, terms, privacy (text-sm, border-top)
- Overall padding: pt-16 pb-8

---

## Images

### Hero Image (Home Page)
**Description**: Professional mentorship scene - diverse professionals in modern office setting or video call interface, warm and approachable atmosphere
**Placement**: Right 45% of hero section, full height, subtle gradient overlay on left edge for blend
**Treatment**: High-quality, professionally styled, aspect ratio maintained on all devices

### Course Thumbnails
**Description**: Topic-relevant imagery (professional settings, learning environments, success moments)
**Placement**: Top of each course card, 16:9 aspect ratio
**Treatment**: Subtle overlay gradient from bottom (showing title) on hover

### Instructor Photos
**Description**: Professional headshots with friendly, approachable expressions
**Placement**: Course detail pages (large), course cards (small circular overlay), testimonials (small circular)
**Treatment**: Circular crop, subtle border

### Trust Badge Section
**Description**: Partner logos or certification badges
**Placement**: Below hero CTAs, horizontal row, grayscale treatment
**Treatment**: Equal height, filtered to grayscale, subtle on hover

### Course Detail Banner
**Description**: Topic-specific imagery related to course content
**Placement**: Full-width banner at top of course detail page, h-64 to h-80
**Treatment**: Gradient overlay with course title overlaid

---

## Page-Specific Layouts

### Home Page Structure
1. Hero Section (split-screen with image)
2. Trust Indicator Bar (logos/stats, py-12)
3. Featured Courses Section (3-column grid, py-24)
4. Why Choose Us (4-column icon features, py-24)
5. Success Stories (testimonials, 3-column, py-24)
6. Meet Your Mentors (2-column bios with photos, py-24)
7. CTA Section (centered, background treatment, py-20)
8. Footer

### Courses Page
- Hero banner (smaller, h-48)
- Filter sidebar (left, w-64, sticky) + course grid (right)
- Pagination at bottom

### Student Dashboard
- Welcome banner with progress summary
- "Continue Learning" section (horizontal scroll of current courses)
- "My Courses" grid below
- Recommended courses section at bottom

---

## Animations

**Minimal, Purposeful Interactions**:
- Card hover: Subtle lift (translateY(-4px)) + shadow increase
- Button hover: Slight scale (1.02) or background shift
- Accordion expand: Smooth height transition
- Page transitions: Fade in content on load
- No auto-playing carousels or distracting movements

---

## Accessibility Standards

- Minimum tap target: 44x44px for mobile
- Form labels always visible (no placeholder-only)
- Focus states: Visible ring-4 treatment on all interactive elements
- Color contrast: Ensure AAA standard for body text, AA for large text
- Alt text for all images
- Semantic HTML throughout
- Skip navigation link for keyboard users

---

## Responsive Breakpoints

- Mobile: Base styles, single column
- Tablet: md: breakpoint (768px), 2-column layouts
- Desktop: lg: breakpoint (1024px), full multi-column layouts
- Wide: xl: breakpoint (1280px), maximum container width

**Mobile-First Approach**: Build for mobile first, progressively enhance for larger screens