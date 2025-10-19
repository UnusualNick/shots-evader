# Buckshot Roulette Tactical Assistant

A terminal-based tactical assistant for the Buckshot Roulette multiplayer game. This application provides real-time probability calculations, strategic recommendations, and game state tracking to give you the competitive edge.

## Features

### ✅ Implemented Features

#### Game Setup
- ✅ **Player Configuration**: Support for 2-8 players with customizable names
- ✅ **Health Management**: Configure individual player health (1-6 HP)
- ✅ **Item Distribution**: Assign tactical items to each player
- ✅ **Ammo Configuration**: Set live and blank round counts

#### Real-Time Analysis
- ✅ **Basic Probability Calculations**: Live/blank round percentages updated in real-time
- ✅ **Tactical Recommendations**: Personalized strategic advice based on health and ammo state
- ✅ **Risk Assessment**: Color-coded threat levels and safety indicators
- ✅ **Player Status Tracking**: Monitor health, item quantities, and game actions

#### Gameplay Assistance
- ✅ **Action Recording**: Track all shots, item usage, and results
- ✅ **Target Selection**: Guided selection for optimal tactical decisions
- ✅ **Basic Item Management**: Inventory tracking and quantity management
- ✅ **Game History**: Review recent actions and their outcomes
- ✅ **Auto Game End Detection**: Automatic return to setup when game concludes

#### Interface
- ✅ **Terminal UI**: Clean, professional interface with Ink.js
- ✅ **Dark Theme**: Military-style green color scheme matching the original game
- ✅ **Centered Layout**: Optimized for various terminal sizes
- ✅ **Keyboard Navigation**: Intuitive arrow keys and number input
- ✅ **Professional Input Components**: Using @inkjs/ui for enhanced user experience

### 🚧 Planned Features

#### Advanced Item System
- ⏳ **Item Effect Integration**: Probability calculations accounting for item effects
- ⏳ **Magnifying Glass Support**: Factor revealed round information into calculations
- ⏳ **Inverter Tracking**: Track ammunition state changes after Inverter usage
- ⏳ **Item Usage Recommendations**: Strategic advice for optimal item timing
- ⏳ **Complex Item Interactions**: Multi-item strategy recommendations

#### Enhanced Analysis
- ⏳ **Advanced Probability Engine**: Account for item effects in probability calculations
- ⏳ **Predictive Analysis**: Forecast optimal strategies based on known information
- ⏳ **Statistical Tracking**: Long-term performance analytics across games
- ⏳ **Custom Risk Profiles**: Adjustable risk tolerance settings

#### Quality of Life
- ⏳ **Game State Persistence**: Save and resume games
- ⏳ **Multiple Game Modes**: Support for different Buckshot Roulette variants
- ⏳ **Export Game Data**: Save game history for analysis
- ⏳ **Configuration Presets**: Quick setup for common game configurations

## Installation

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Run the tactical assistant
pnpm try
```

## Usage

### Starting the Application
1. Launch the assistant with `pnpm try`
2. Enter your operator callsign
3. Configure game parameters through the setup wizard

### Game Setup Flow
1. **Players**: Set number of participants (2-8)
2. **Names**: Player names are auto-assigned (User + Opponents)
3. **Health**: Configure HP for each player (1-6)
4. **Items**: Distribute tactical items among players
5. **Ammo**: Set live and blank round counts

### During Gameplay
- **Player Selection**: Choose who's taking the current action
- **Action Type**: Select between shooting or using items
- **Target Selection**: Choose targets for shots
- **Result Recording**: Record shot outcomes (live/blank)
- **Item Usage**: Track item consumption (effects analysis planned for future)

### Current Tactical Information
The assistant currently provides:
- ✅ **Basic Live Round Probability**: Percentage chance based on remaining ammo counts
- ✅ **Personalized Recommendations**: Strategic advice based on your health and basic game state
- ✅ **Risk Assessment**: Threat level analysis for self-targeting decisions
- ✅ **Inventory Tracking**: Monitor item quantities across all players

### Future Tactical Enhancements
- ⏳ **Advanced Probability Calculations**: Factor in item effects and revealed information
- ⏳ **Item-Aware Recommendations**: Strategic advice considering available items
- ⏳ **Predictive Risk Assessment**: Account for potential item usage by opponents

## Strategic Features

### Risk Categories
- **🟢 SAFE ZONE**: Only blanks remaining - proceed with confidence
- **🟡 LOW THREAT**: <30% live chance - self-targeting relatively safe
- **🟠 MEDIUM THREAT**: 30-70% live chance - gather intelligence first
- **🔴 HIGH THREAT**: >70% live chance - target opponents, avoid yourself
- **🔴 DANGER ZONE**: Only live rounds left - extreme caution advised

### Item Support Status

#### ✅ Currently Tracked (Inventory Only)
- ✅ Hand Saw - Quantity tracking
- ✅ Magnifying Glass - Quantity tracking
- ✅ Jammer - Quantity tracking
- ✅ Cigarette Pack - Quantity tracking
- ✅ Beer - Quantity tracking
- ✅ Burner Phone - Quantity tracking
- ✅ Adrenaline - Quantity tracking
- ✅ Inverter - Quantity tracking
- ✅ Remote - Quantity tracking

#### ⏳ Planned Item Effect Integration
- ⏳ **Magnifying Glass**: Reveal round information integration
- ⏳ **Inverter**: Ammunition state change tracking
- ⏳ **Hand Saw**: Double damage calculation
- ⏳ **Cigarette Pack**: Health restoration tracking
- ⏳ **Beer**: Round ejection probability adjustment
- ⏳ **Jammer**: Phone blocking mechanics
- ⏳ **Burner Phone**: Remote information gathering
- ⏳ **Adrenaline**: Extra turn mechanics
- ⏳ **Remote**: Advanced tactical coordination

## Technical Details

### Built With
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Ink.js** - Terminal UI framework
- **@inkjs/ui** - Enhanced UI components
- **React** - Component architecture

### Project Structure
```
source/
├── app.tsx              # Main application controller
├── cli.tsx              # Command-line interface
└── components/
    ├── UserNameEntry.tsx    # Operator identification
    ├── SetupPage.tsx        # Game configuration wizard
    └── GameplayPage.tsx     # Real-time tactical interface
```

### Key Features
- **Real-time Updates**: Live probability calculations
- **Persistent State**: Game state maintained throughout session
- **Auto-completion**: Automatic return to setup when game ends
- **Input Validation**: Robust error handling and user guidance

## Controls

### Universal Controls
- **Q** - Quit application
- **Esc** - Return to setup (from gameplay)
- **↑/↓** - Navigate options
- **Enter** - Confirm selection

### Setup Phase
- **Numbers (2-8)** - Direct player count selection
- **Numbers (0-9)** - Direct value input for health/items/ammo
- **←/→** - Adjust ammo values
- **Space** - Increment item quantity
- **X** - Decrement item quantity

### Gameplay Phase
- **↑/↓** - Navigate players/actions/targets
- **Enter** - Confirm selection
- **Numbers** - Quick selection where applicable

## Game End Conditions

The assistant automatically returns to setup when:
- Only one player remains alive
- All ammunition has been consumed
- Manual return via Esc key

## Probability Engine Status

### Current Implementation
- [x] **Basic Live Round Percentage**: `liveAmmo / totalAmmo * 100`
- [x] **Basic Blank Round Percentage**: `blankAmmo / totalAmmo * 100`
- [x] **Health-Based Risk Assessment**: Considers user HP and live percentage
- [x] **Personalized Recommendations**: Basic advice based on current game state
- [x] **Real-Time Updates**: Calculations update as ammo is consumed

### Planned Enhancements
- [ ] **Item Effect Integration**: Account for item effects in probability calculations
- [ ] **Revealed Information Tracking**: Factor in Magnifying Glass discoveries
- [ ] **Inverter State Management**: Track ammunition changes from Inverter usage
- [ ] **Advanced Strategic Analysis**: Recommendations considering available items
- [ ] **Opponent Behavior Prediction**: Probability adjustments based on opponent patterns
- [ ] **Multi-Variable Risk Assessment**: Complex risk calculations with item interactions

## Visual Design

- **Color Scheme**: Military green theme with red accents for danger
- **Typography**: Bold headers, clear status indicators
- **Layout**: Centered, bordered sections for easy reading
- **Responsive**: Adapts to terminal size while maintaining readability

## Development

```bash
# Development mode with auto-rebuild
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format
```

## License

MIT - Feel free to use this tactical assistant to dominate your Buckshot Roulette games!

---

*Remember: This is a tactical assistant, not a guarantee of victory. Use your strategic thinking alongside the provided recommendations for optimal results.*
