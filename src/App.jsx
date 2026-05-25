import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Sidebar from './components/Sidebar.jsx'
import POS from './pages/POS.jsx'
import Products from './pages/Products.jsx'
import Inventory from './pages/Inventory.jsx'
import Customers from './pages/Customers.jsx'
import Reports from './pages/Reports.jsx'
import './App.css'
import './css/reports.css'

function App() {
  const [count, setCount] = useState(0)
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className="app-shell">
      <Sidebar activeId={activeNav} onNavigate={setActiveNav} />
      <main className="app-main" aria-label="Content">
        <header className="app-topbar">
          <div className="app-topbar-title">
            {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
          </div>
          <div className="app-topbar-meta">
            <span className="app-chip">Store #01</span>
            <span className="app-chip">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        {activeNav === 'pos' ? (
          <POS />
        ) : activeNav === 'products' ? (
          <Products />
        ) : activeNav === 'customers' ? (
          <Customers />
        ) : activeNav === 'inventory' ? (
          <Inventory />
        ) : activeNav === 'reports' ? (
          <Reports />
        ) : (
          <>
            <section id="center">
              <div className="hero">
                <img
                  src={heroImg}
                  className="base"
                  width="170"
                  height="179"
                  alt=""
                />
                <img src={reactLogo} className="framework" alt="React logo" />
                <img src={viteLogo} className="vite" alt="Vite logo" />
              </div>
              <div>
                <h1>Get started</h1>
                <p>
                  Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
                </p>
              </div>
              <button
                type="button"
                className="counter"
                onClick={() => setCount((count) => count + 1)}
              >
                Count is {count}
              </button>
            </section>

            <div className="ticks"></div>

            <section id="next-steps">
              <div id="docs">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
                <h2>Documentation</h2>
                <p>Your questions, answered</p>
                <ul>
                  <li>
                    <a href="https://vite.dev/" target="_blank">
                      <img className="logo" src={viteLogo} alt="" />
                      Explore Vite
                    </a>
                  </li>
                  <li>
                    <a href="https://react.dev/" target="_blank">
                      <img className="button-icon" src={reactLogo} alt="" />
                      Learn more
                    </a>
                  </li>
                </ul>
              </div>
              <div id="social">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#social-icon"></use>
                </svg>
                <h2>Connect with us</h2>
                <p>Join the Vite community</p>
                <ul>
                  <li>
                    <a href="https://github.com/vitejs/vite" target="_blank">
                      <svg
                        className="button-icon"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <use href="/icons.svg#github-icon"></use>
                      </svg>
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="https://chat.vite.dev/" target="_blank">
                      <svg
                        className="button-icon"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <use href="/icons.svg#discord-icon"></use>
                      </svg>
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/vite_js" target="_blank">
                      <svg
                        className="button-icon"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <use href="/icons.svg#x-icon"></use>
                      </svg>
                      X.com
                    </a>
                  </li>
                  <li>
                    <a href="https://bsky.app/profile/vite.dev" target="_blank">
                      <svg
                        className="button-icon"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <use href="/icons.svg#bluesky-icon"></use>
                      </svg>
                      Bluesky
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <div className="ticks"></div>
            <section id="spacer"></section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
