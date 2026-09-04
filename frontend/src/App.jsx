import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Ask from './pages/Ask.jsx';
import Cases from './pages/Cases.jsx';
import Review from './pages/Review.jsx';
import { Leaf, Sun, Moon, Alert } from './components/Icons.jsx';

/* Demo-mode is app-wide state: once any call falls back to sample data the
   banner stays up, because a user who scrolled past it must not later read
   sample legal content as though it were retrieved. */
const DemoCtx = createContext({ demo: false, setDemo: () => {} });
export const useDemo = () => useContext(DemoCtx);

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('ipsakti-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ipsakti-theme', theme); } catch {}
  }, [theme]);
  return [theme, setTheme];
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [demo, setDemo] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <DemoCtx.Provider value={{ demo, setDemo }}>
      <div className="app">
        {demo && (
          <div className="demo-banner" role="status">
            <div className="shell">
              <Alert size={17} style={{ flexShrink: 0 }} />
              <span>
                <strong>Sample data.</strong> The backend isn’t reachable, so this is illustrative
                content showing the shape of a real answer — not retrieved law, and not legal advice.
              </span>
            </div>
          </div>
        )}

        <header className="topbar">
          <div className="shell topbar-inner">
            <Link to="/" className="brand">
              <span className="brand-mark"><Leaf size={21} style={{ color: '#fff' }} /></span>
              <span>
                <span className="brand-name">IP-SAKTI Sahayak</span>
                <span className="brand-sub" style={{ display: 'block' }}>Ayurvedic IP guidance</span>
              </span>
            </Link>

            <nav className="nav">
              <NavLink to="/ask">Ask</NavLink>
              <NavLink to="/cases">Patent cases</NavLink>
              <NavLink to="/review">Corpus review</NavLink>
            </nav>

            <span className="spacer" />

            <button
              className="icon-btn"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <Link to="/ask" className="btn btn-primary btn-sm" style={{ marginLeft: 4 }}>Ask a question</Link>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="shell footer-grid">
            <span>IP-SAKTI Sahayak — citation-grounded guidance for Ayurvedic IP.</span>
            <span className="spacer" />
            <span>Informational only. Not legal advice.</span>
          </div>
        </footer>
      </div>
    </DemoCtx.Provider>
  );
}
