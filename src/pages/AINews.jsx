import { useState, useMemo } from 'react'
import { useNewsFeeds } from '../hooks/useNewsFeeds'
import './AINews.css'

const CATEGORIES = ['All', 'Industry', 'Tools', 'Data Centers', 'Research']

const CATEGORY_EMOJIS = {
  Industry: '🏢',
  Tools: '🛠️',
  'Data Centers': '🖥️',
  Research: '🔬',
}

function formatTimeAgo(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NewsCard({ article, index }) {
  const isFeatured = index < 2

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`news-card ${isFeatured ? 'featured' : ''}`}
      style={{
        '--card-color': article.color,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="card-glow"></div>
      <div className="card-content">
        <div className="card-meta">
          <span className="card-category" style={{ background: `${article.color}20`, color: article.color }}>
            {CATEGORY_EMOJIS[article.category] || '📰'} {article.category}
          </span>
          <span className="card-time">{formatTimeAgo(article.pubDate)}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">{article.description}...</p>
        <div className="card-footer">
          <span className="card-source">
            <span className="source-dot" style={{ background: article.color }}></span>
            {article.source}
          </span>
          <span className="card-read-more">
            Read →
          </span>
        </div>
      </div>
    </a>
  )
}

function AINews() {
  const { articles, loading, error, lastUpdated, refresh } = useNewsFeeds()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory
      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [articles, activeCategory, searchQuery])

  const stats = useMemo(() => {
    const sources = new Set(articles.map((a) => a.source)).size
    const categories = new Set(articles.map((a) => a.category)).size
    return { total: articles.length, sources, categories }
  }, [articles])

  return (
    <main className="ai-news">
      <div className="news-bg">
        <div className="bg-grid"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="bg-orb bg-orb-4"></div>
      </div>

      <div className="news-container">
        {/* Hero Header */}
        <section className="news-hero">
          <div className="news-hero-badge">
            <span className="live-indicator"></span>
            Live AI Intelligence Feed
          </div>
          <h1 className="news-title">
            <span className="title-ai">AI</span> Pulse
          </h1>
          <p className="news-subtitle">
            Your real-time feed of everything happening in artificial intelligence —
            from data centers and infrastructure to daily tools and research breakthroughs.
          </p>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{stats.sources}</span>
              <span className="stat-label">Sources</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{stats.categories}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">
                {lastUpdated ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </span>
              <span className="stat-label">Updated</span>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="news-controls">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search AI news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="refresh-btn" onClick={refresh} disabled={loading}>
            <svg className={`refresh-icon ${loading ? 'spinning' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </section>

        {/* Error notice */}
        {error && (
          <div className="error-notice">
            <span>ℹ️</span> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line long"></div>
                <div className="skeleton-line long"></div>
                <div className="skeleton-line medium"></div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <section className="news-grid">
            {filteredArticles.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>No articles found matching your criteria.</p>
                <button className="filter-btn active" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
                  Clear filters
                </button>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <NewsCard key={`${article.title}-${index}`} article={article} index={index} />
              ))
            )}
          </section>
        )}

        {/* Source Attribution */}
        <section className="sources-section">
          <h3 className="sources-title">Powered by Live RSS Feeds</h3>
          <div className="sources-list">
            {['TechCrunch', 'The Verge', 'MIT Tech Review', 'Ars Technica', 'VentureBeat'].map((source) => (
              <span key={source} className="source-tag">{source}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AINews
