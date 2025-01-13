# Dragon Ball Character Autocomplete Component

A high-performance, accessible autocomplete component built with React and TypeScript for searching Dragon Ball characters. This component was developed following best practices for performance, accessibility, and UX, without using any third-party libraries.

## 🌟 Key Features

### Search Functionality

- Real-time search with debouncing
- Text match highlighting in results
- Results caching system
- Loading and error state handling

### Advanced Interaction

- Complete keyboard navigation:
  - `↑` / `↓`: Navigate through options
  - `Enter`: Select option
  - `Esc`: Close dropdown
- Click outside to close dropdown
- Visual selection indicators
- Auto-scroll on keyboard navigation

### Performance Optimization

- Search debouncing to reduce API calls
- Caching system for frequent results
- Image optimization with lazy loading
- Automatic cache cleanup

### Accessibility

- Proper ARIA roles
- Full keyboard navigation
- Clear focus states
- Image alternative texts

### UI/UX Design

- Responsive and adaptive design
- Smooth animations and transitions
- Enhanced hover and focus states
- Clear state indicators

## 🛠️ Technologies Used

- React 18
- TypeScript
- Modular CSS
- Vite

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/aandrewsv/pgd-autocomplete
```

2. Navigate to the project directory:

```bash
cd dragon-ball-autocomplete
```

3. Install dependencies:

```bash
npm install
```

## 🚀 Usage

### Development

To start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:5173`

### Production

To build the project for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🔧 Project Structure

```
src/
├── components/
│   └── Autocomplete/
│       ├── Autocomplete.tsx    # Main component
│       └── Autocomplete.css    # Styles
├── services/
│   └── api.ts                  # API services
├── types/
│   └── index.ts               # Types and interfaces
├── App.css                    # Global styles
├── App.tsx                    # Root component
├── index.css                  # Global styles
└── main.tsx                   # Entry point
```

## 💻 API Integration

The component uses the Dragon Ball public API:

- Base URL: `https://dragonball-api.com/api/characters`
- Search endpoint: `GET /characters?page={page}&limit={limit}`

## 🎨 Customization

The component uses CSS variables that can be overridden for custom styling:

```css
:root {
  --primary-color: #4a90e2;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --bg-primary: #f5f7fa;
  --bg-secondary: #c3cfe2;
}
```

## ✨ Component Features

### Search Experience

- Instant search with performance optimization
- Character name highlighting
- Smooth loading states
- Error handling with user feedback

### Interaction Details

- Select options with mouse or keyboard
- Auto-close on selection or outside click
- Keyboard navigation support
- Visual feedback for all interactions

### Performance Features

- Optimized rendering
- Efficient API calls
- Image lazy loading
- Smart caching system

## 📝 Additional Notes

- The component is designed to be highly reusable and can be easily integrated into any React project
- Performance and accessibility have been prioritized without compromising user experience
- No third-party libraries required, meeting project requirements
- Fully typed with TypeScript for better development experience

## 🔍 Implementation Details

### Cache System

The component implements a smart caching system that:

- Stores search results for quick access
- Automatically cleans up old cache entries
- Optimizes API usage

### Keyboard Navigation

Full keyboard support including:

- Arrow keys for navigation
- Enter for selection
- Escape to close dropdown
- Auto-scroll to keep active option visible

### Performance Optimizations

- Debounced search to minimize API calls
- Efficient DOM updates
- Optimized re-renders
- Smart state management

### Accessibility Features

- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader friendly
