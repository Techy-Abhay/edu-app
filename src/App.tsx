// HashRouter: GitHub Pages serves static files only and cannot rewrite deep links to index.html.
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ClassSelection from './pages/ClassSelection';
import Dashboard from './pages/Dashboard';
import SubjectSelection from './pages/SubjectSelection';
import Practice from './pages/Practice';
import QuickPractice from './pages/QuickPractice';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import Header from './components/Header';
import DataSourceBanner from './components/DataSourceBanner';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <DataSourceBanner />
        <main>
          <Routes>
            <Route path="/" element={<ClassSelection />} />
            <Route path="/class/:class/dashboard" element={<Dashboard />} />
            <Route path="/class/:class/subject/:subject" element={<SubjectSelection />} />
            <Route path="/class/:class/practice/:subject/:mode" element={<Practice />} />
            <Route path="/class/:class/quick-practice" element={<QuickPractice />} />
            <Route path="/class/:class/results/:sessionId" element={<Results />} />
            <Route path="/class/:class/history" element={<History />} />
            <Route path="/class/:class/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
