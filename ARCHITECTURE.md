# khrono timer - Architecture Documentation

> **Last Updated:** December 2024  
> **Font:** Noto Sans Japanese (changed from Noto Serif JP)  
> **Framework:** React + TypeScript + Vite + Tailwind CSS

## 📁 Project Structure

```
khrono-timer/
├── 📄 Configuration Files
├── 📁 src/                    # Source code directory
├── 📁 public/                 # Static assets
├── 📁 dist/                   # Production build output
└── 📁 node_modules/           # Dependencies
```

---

## 🔧 Configuration Files

### Core Configuration
- **`package.json`** - Project dependencies, scripts, and metadata
- **`vite.config.ts`** - Vite build tool configuration with React SWC plugin
- **`tailwind.config.ts`** - Tailwind CSS configuration with custom color palette
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.js`** - ESLint linting rules
- **`postcss.config.js`** - PostCSS configuration for Tailwind

### Build & Development
- **`index.html`** - Main HTML template with Noto Sans Japanese font
- **`components.json`** - shadcn/ui component configuration

---

## 📱 Source Code (`src/`)

### 🎯 Main Application Files

### **Workout Modes**

#### **Intervals Mode** (formerly Tabata)
- **Purpose:** Traditional interval training with work/rest periods
- **Configuration:**
  - Work time: 5-300 seconds (5s increments)
  - Rest time: 5-300 seconds (5s increments)
  - Rounds: 1-50
  - Sets: 1-10 (with set rest periods)
- **Behavior:** Alternates between work and rest periods

#### **EMOM Mode** (formerly HIIT)
- **Purpose:** Every Minute On the Minute workouts
- **Configuration:**
  - Duration: 1-60 minutes
  - Rounds: Same as duration (1 minute per round)
  - No work/rest periods - continuous 60-second rounds
- **Behavior:** Each round is exactly 60 seconds, no rest between rounds

#### **`main.tsx`**
- **Purpose:** Application entry point
- **Function:** Renders the App component to the DOM root
- **Dependencies:** React DOM, App component, CSS

#### **`App.tsx`**
- **Purpose:** Main application wrapper and routing setup
- **Features:**
  - React Query client provider
  - Tooltip provider for UI components
  - Toast notification system (dual: shadcn + Sonner)
  - React Router setup with routes
- **Routes:**
  - `/` → ModeSelection page (workout mode selection)
  - `/workout/:mode` → Workout page (timer interface)
  - `*` → 404 Not Found page

#### **`App.css`**
- **Purpose:** Global application styles
- **Content:** Additional CSS beyond Tailwind utilities

#### **`index.css`**
- **Purpose:** Global styles and CSS custom properties
- **Features:**
  - Tailwind CSS imports
  - Custom color palette (light/dark themes)
  - Material Design elevation system
  - Timer-specific color variables
  - Ripple effect animations
  - Font configuration (Noto Sans Japanese)

---

### 📄 Pages (`src/pages/`)

#### **`ModeSelection.tsx`** - Workout Mode Selection Page
- **Purpose:** First screen users see - workout mode selection
- **Features:**
  - Dark/light theme toggle
  - Two workout modes: Intervals and EMOM
  - Clean, focused interface for mode selection
  - Navigation to workout page after selection
- **State Management:**
  - `isDark` - Theme state
- **Types:**
  - `TimerMode` - 'intervals' | 'emom'

#### **`Workout.tsx`** - Main Timer Page
- **Purpose:** Primary workout interface with timer and settings
- **Features:**
  - Dark/light theme toggle
  - Back navigation to mode selection
  - Timer display and controls
  - Settings panel (moved from header)
  - Mode-specific configuration
  - Workout details display
- **State Management:**
  - `isDark` - Theme state
  - `showSettings` - Settings panel visibility
  - `timerConfig` - Timer configuration object
- **Types:**
  - `TimerMode` - 'intervals' | 'emom'
  - `TimerConfig` - Work/rest times, rounds, sets configuration

#### **`NotFound.tsx`** - 404 Error Page
- **Purpose:** Handle non-existent routes
- **Features:**
  - Error logging to console
  - User-friendly 404 message
  - Return to home link

---

### 🧩 Components (`src/components/`)

#### **Core Timer Components**

##### **`TabataTimer.tsx`** - Main Timer Logic
- **Purpose:** Central timer component with complete workout logic
- **Features:**
  - Timer state management (idle, work, rest, setRest, complete)
  - Audio feedback system (beeps for start/end/countdown)
  - Round and set progression
  - Automatic state transitions
  - Progress calculation
- **State:**
  - `isRunning` - Timer active state
  - `timeLeft` - Current countdown value
  - `currentRound` - Current round number
  - `currentSet` - Current set number
  - `timerState` - Current timer phase
  - `totalTime` - Calculated total workout duration
- **Audio:**
  - Web Audio API integration
  - Start beep (880Hz)
  - End beep (440Hz)
  - Countdown beep (660Hz)

##### **`TimerDisplay.tsx`** - Timer Visual Display
- **Purpose:** Render the main timer interface
- **Features:**
  - Large time display (MM:SS format)
  - State indicator (WORK/REST/SET BREAK/COMPLETE)
  - Round and set counters
  - Completion celebration
  - Pulse animation for final seconds
- **Visual States:**
  - Work: Green background
  - Rest/Set Rest: Orange background
  - Complete: Purple background

##### **`TimerControls.tsx`** - Timer Control Buttons
- **Purpose:** Start, pause, and reset timer controls
- **Features:**
  - Play/Pause toggle button
  - Reset button
  - State-aware button visibility
  - Ripple effect animations

##### **`ProgressIndicator.tsx`** - Workout Progress Bar
- **Purpose:** Visual progress tracking
- **Features:**
  - Animated progress bar
  - Percentage display
  - Color-coded by timer state
  - Smooth transitions

##### **`ModeSelector.tsx`** - Workout Mode Selection (Legacy)
- **Purpose:** Legacy component - now replaced by ModeSelection page
- **Status:** No longer used in new routing structure

##### **`TimerSettings.tsx`** - Timer Configuration Panel (Legacy)
- **Purpose:** Legacy component - now integrated into Workout page
- **Status:** Replaced by inline settings in Workout page

#### **UI Components (`src/components/ui/`)**
- **Purpose:** Reusable UI components from shadcn/ui library
- **Components:** 40+ pre-built components including:
  - `button.tsx` - Button variants and states
  - `card.tsx` - Card containers
  - `input.tsx` - Form inputs
  - `progress.tsx` - Progress bars
  - `toast.tsx` - Notification system
  - And many more...

---

### 🎣 Hooks (`src/hooks/`)

#### **`use-mobile.tsx`**
- **Purpose:** Mobile device detection hook
- **Usage:** Responsive design adjustments

#### **`use-toast.ts`**
- **Purpose:** Toast notification hook
- **Usage:** Display temporary messages to users

---

### 🛠️ Utilities (`src/lib/`)

#### **`utils.ts`**
- **Purpose:** Utility functions
- **Features:** Common helper functions, likely including `cn()` for class name merging

---

### 🎨 Assets (`src/assets/`)

#### **`favicons/`**
- **Purpose:** Favicon files for different platforms
- **Files:** Various favicon formats and sizes

---

## 🌐 Public Assets (`public/`)

### **Static Files**
- **`app_icon_primary.png`** - Primary app icon
- **`kanji_clock_black.png`** - Logo/header icon
- **`favicon.ico`** - Website favicon
- **`placeholder.svg`** - Placeholder image
- **`robots.txt`** - Search engine crawler instructions

---

## 🏗️ Build Output (`dist/`)

### **Production Files**
- **`index.html`** - Built HTML file
- **`assets/`** - Bundled CSS and JavaScript
- **Static assets** - Copied from public directory

---

## 🎨 Design System

### **Color Palette**
- **Light Theme:** Green-based palette with natural tones
- **Dark Theme:** Dark green/olive palette
- **Timer Colors:**
  - Work: Green (`--timer-work`)
  - Rest: Orange (`--timer-rest`)
  - Complete: Purple (`--timer-complete`)

### **Typography**
- **Primary Font:** Noto Sans Japanese
- **Fallback:** System sans-serif fonts
- **Features:** Japanese character support, clean readability

### **Material Design Elements**
- **Elevation System:** 3 levels of depth
- **Ripple Effects:** Button interaction feedback
- **Shadows:** Material Design shadow system
- **Animations:** Smooth transitions and micro-interactions

---

## 🔄 State Management

### **Local State (React useState)**
- Timer configuration
- UI state (theme, settings panel)
- Timer progress and state

### **No External State Management**
- No Redux, Zustand, or Context API
- Simple prop drilling for component communication

---

## 🎵 Audio System

### **Web Audio API Integration**
- **Start Beep:** 880Hz sine wave
- **End Beep:** 440Hz sine wave  
- **Countdown Beep:** 660Hz sine wave
- **Fallback:** Graceful degradation if audio not supported

---

## 📱 Responsive Design

### **Breakpoints**
- Mobile-first approach
- Tailwind CSS responsive utilities
- Flexible grid layouts
- Adaptive typography scaling

---

## 🚀 Development Workflow

### **Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Hot Reload**
- Vite HMR for instant updates
- TypeScript error checking
- CSS hot reloading

---

## 📝 Notes for Future Changes

### **Before Making Changes:**
1. Review this documentation
2. Update relevant sections
3. Test on both light and dark themes
4. Verify mobile responsiveness
5. Check audio functionality

### **Common Change Areas:**
- Timer logic: `TabataTimer.tsx`
- UI styling: `index.css`, `tailwind.config.ts`
- New features: Add to `Index.tsx` or create new components
- Configuration: Update `TimerConfig` interface

---

test

*This documentation should be updated whenever significant changes are made to the codebase structure or functionality.*
