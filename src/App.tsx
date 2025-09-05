import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Analysis, Settings } from './pages';
import { Navigation } from './components/Navigation';
import { useServiceWorker } from './hooks/useServiceWorker';

function App() {
  const { register, isSupported } = useServiceWorker();

  useEffect(() => {
    if ((window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      
      tg.ready();
      tg.expand();
      
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#ffffff');
      
      if (tg.initDataUnsafe?.user) {
        console.log('Telegram user:', tg.initDataUnsafe.user);
      }
      
      tg.MainButton.hide();
      tg.BackButton.hide();
    }

    if (isSupported && process.env.NODE_ENV === 'production') {
      register();
    }
  }, [register, isSupported]);

  return (
    <Router basename="/chi1i-bot">
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;