# Investors Dashboard

A comprehensive investment portfolio management dashboard with real-time NAV tracking, alerts, and trading capabilities.

## Features

### 📊 Portfolio Management
- **Real-time NAV Updates**: Live portfolio value tracking with streaming updates
- **Holdings Display**: View current cryptocurrency holdings with real-time prices
- **Transaction History**: Complete transaction log with buy/sell records
- **NAV History Chart**: Visual representation of portfolio performance over time

### 🚨 Smart Alerts System
- **Alert Creation**: Set custom NAV threshold alerts (above/below)
- **Real-time Notifications**: Instant browser and in-app notifications when alerts trigger
- **Alert Status Display**: Visual indicators for Active vs Triggered alerts
- **Alert Management**: Delete unwanted alerts with one-click

### 💱 Trading Features
- **Asset Discovery**: Browse available investment assets
- **Quick Trading**: Buy/sell assets with modal interface
- **Real-time Pricing**: Live cryptocurrency price updates
- **Trade Confirmation**: Secure transaction processing

### 🎯 Alert Types
- **Above Threshold**: Notifies when NAV exceeds specified value
- **Below Threshold**: Notifies when NAV drops below specified value
- **Visual Status**: Green "● Active" for pending alerts, Orange "✓ Triggered" for completed alerts

### 📱 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Server-sent events for instant data refresh
- **Browser Notifications**: Native OS notifications for important alerts
- **Auto-dismiss**: Notifications automatically clear after 5 seconds

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with HMR
- **Styling**: Tailwind CSS for modern UI
- **Charts**: Recharts for data visualization
- **State Management**: React hooks for local state
- **API**: Axios for HTTP requests with JWT authentication
- **Real-time**: Server-sent events for live updates

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Environment Variables
Create `.env` file with:
```
VITE_API_URL=http://localhost:3000/api
```

## API Integration

### Authentication
- JWT token-based authentication
- Automatic token refresh and expiry handling
- Secure local storage management

### Real-time Features
- Server-sent events for NAV updates
- Live cryptocurrency price streaming
- Instant alert notifications

### Alert System Architecture
- **Display Alerts**: User-created alerts shown in management list
- **Stream Alerts**: Real-time triggered alerts for notifications
- **Separate States**: Clean separation between display and notification logic
- **Auto-cleanup**: Stream alerts auto-dismiss after 5 seconds

## Key Components

### Dashboard
- Main dashboard with portfolio overview
- Real-time data integration
- Alert management interface

### AlertsList
- Display user-created alerts
- Visual status indicators (Active/Triggered)
- Delete functionality

### AlertNotifications
- Real-time notification display
- Browser notification integration
- Auto-dismiss functionality

### AlertForm
- Create new threshold alerts
- Direction selection (above/below)
- Form validation and submission

## Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License - see LICENSE file for details
