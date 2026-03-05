# Poker Night Tracker

A modern web application for tracking Texas Hold'em poker games with multiple players, blind management, and comprehensive hand evaluation.

## Features

- **Multi-player support**: Track up to 8+ players in a single game session
- **Hand evaluation**: Automatic poker hand ranking (royal flush to high card)
- **Side pots**: Correctly calculates side pots for all-in scenarios
- **Blind management**: Automatic dealer rotation and blind posting
- **Action logging**: Complete history of all player actions and game phases
- **Dark/Light mode**: Toggle-able theme system for comfortable viewing
- **Responsive UI**: Works on desktop and tablet devices

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── CardFace.jsx    # Playing card visual component
│   │   ├── HandBadge.jsx   # Hand name display with tooltip
│   │   ├── CardPicker.jsx  # Card selection modal
│   │   ├── Toggle.jsx
│   │   └── (other small utilities)
│   ├── game/               # Poker-specific components
│   │   ├── PlayerCard.jsx  # Individual player state display
│   │   ├── PotDisplay.jsx  # Main and side pot visualization
│   │   ├── ActionControls.jsx  # Fold/Check/Call/Raise form
│   │   ├── ActionLog.jsx   # Game action history
│   │   └── CommunityCards.jsx  # Board cards display
│   ├── modals/             # Dialog flows for game events
│   │   ├── BlindsModal.jsx
│   │   ├── BuyInModal.jsx
│   │   ├── AddPlayerModal.jsx
│   │   ├── HandResultModal.jsx
│   │   ├── PhasePromptModal.jsx
│   │   ├── SummaryModal.jsx
│   │   └── GameWinnerModal.jsx
│   ├── setup/              # Game setup screen
│   │   └── SetupScreen.jsx
│   ├── PokerTracker.jsx    # Main game component (orchestrator)
│   └── App.jsx             # Root component
├── utils/                  # Game logic and utilities
│   ├── handEvaluator.js    # Poker hand ranking logic
│   ├── sidePots.js         # Side pot calculation
│   ├── constants.js        # Game constants (suits, ranks, phases)
│   └── formatting.js       # Number formatting utilities
├── styles/                 # Theme system
│   └── themes.js           # Dark/Light color palettes
├── index.css               # Global styles
└── main.jsx                # Entry point
```

## How It Works

### Game Flow

1. **Setup Phase**: Enter player names and initial chip stacks
2. **Betting Rounds**: Pre-flop → Flop → Turn → River
3. **Player Actions**: Fold, Check, Call, Raise, or go All-In
4. **Hand Evaluation**: Automatic ranking of 5-card poker hands at showdown
5. **Pot Distribution**: Correct payout calculation including side pots
6. **Next Hand**: Dealer button rotates, blinds post, new hand begins

### Core Components

**PokerTracker.jsx** - Central state management and game orchestration
- Manages player list, chip stacks, and game phase
- Coordinates modal displays for game events
- Processes player actions and evaluates winners

**handEvaluator.js** - Poker hand ranking engine
- Evaluates all poker hands (royal flush through high card)
- Identifies best 5-card hand from any 7 cards
- Returns hand ranking and component cards

**sidePots.js** - All-in pot calculation
- Determines eligible players for main pot and side pots
- Handles multiple all-in scenarios
- Ensures correct payout distribution

## How to Run

### Prerequisites
- Node.js 16+ and npm installed

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start the dev server (runs on http://localhost:5173 or 5174)
npm run dev
```

Open your browser and navigate to the URL displayed in the terminal (typically `http://localhost:5173` or `http://localhost:5174`).

The app includes:
- **Hot Module Reloading (HMR)**: Changes save automatically without page reload
- **Fast Refresh**: Component state preserved during edits

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Game Instructions

1. **Start Game**: Add players with their starting chip stack and click "Start Game"
2. **Place Bets**: Use the action controls to Fold, Check, Call, Raise, or go All-In
3. **Progress Rounds**: After all players act or fold, click "Next Phase" to advance
4. **Showdown**: View hand evaluations and winner selection
5. **New Hand**: Click "Next Hand" to play again with rotated blinds

## Technology Stack

- **React 19**: UI framework with hooks
- **Vite 7.3**: Lightning-fast build tool and dev server
- **JavaScript ES6+**: Modern JavaScript with JSX syntax
- **CSS3**: Custom styling with theme system

## Browser Support

Works on modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Notes

- Each component is self-contained for easy testing and modification
- Game logic separated from UI code in utils/ for reusability
- Theme system makes dark/light mode implementation trivial
- Original monolithic file backed up as `PokerTracker.jsx.bak` for reference

## Future Enhancements

- Persistent game history and statistics
- Player profiles with win/loss records
- Home game tournaments
- Chip stack animations
- Sound effects and notifications
- Export hand history to CSV/JSON
