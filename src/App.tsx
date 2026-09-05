import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState';
import { Home } from './components/Home';
import { YearlyMissionPage } from './components/YearlyMissionPage';

function App() {
  return (
    <AppStateProvider>
      <Router>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/year/:yearId" element={<YearlyMissionPage />} />
          </Routes>
        </div>
      </Router>
    </AppStateProvider>
  );
}

export default App;
