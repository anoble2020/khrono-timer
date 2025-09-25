# khrono - a workout timer app

A modern, mobile-first workout timer application built with React and TypeScript. Perfect for Tabata intervals, EMOM (Every Minute On the Minute) workouts, and other high-intensity interval training.

## Features

- **Two Workout Modes**:
  - **Intervals**: Customizable work/rest periods (perfect for Tabata)
  - **EMOM**: Every minute on the minute workouts
- **Intuitive Navigation**: Swipe right to navigate back to mode selection
- **Settings Panel**: Adjustable timer configurations
- **Wake Lock**: Prevents device from sleeping during workouts
- **Mobile Optimized**: Designed for iOS and Android with safe area support
- **Dark Theme**: Clean, focused interface for workout sessions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Mobile**: Capacitor for iOS/Android deployment
- **Icons**: Lucide React
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── TabataTimer.tsx # Main timer component
│   └── ...
├── pages/              # Application pages
│   ├── Index.tsx       # Main app page (mode selection + workout)
│   ├── Workout.tsx     # Workout page (if using routing)
│   └── ModeSelection.tsx # Mode selection page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Usage

1. **Select Workout Mode**: Choose between Intervals or EMOM
2. **Configure Settings**: Tap the settings icon to adjust timer parameters
3. **Start Workout**: Use the timer controls to begin your session
4. **Navigate**: Swipe right to return to mode selection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please open an issue on GitHub.