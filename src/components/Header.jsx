import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()
  const isNewsPage = location.pathname === '/ai-news'

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-text">Sidney Schwartz</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/ai-news" className={`nav-link ai-news-btn ${isNewsPage ? 'active' : ''}`}>
            <span className="pulse-dot"></span>
            AI Pulse
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
