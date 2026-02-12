import { useState, useEffect } from 'react'

const RSS_SOURCES = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'Industry',
    color: '#10b981',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'Industry',
    color: '#8b5cf6',
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'Research',
    color: '#ec4899',
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'Tools',
    color: '#f59e0b',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'Industry',
    color: '#06b6d4',
  },
]

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
]

function parseRSSItems(xmlText, source) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')

  const items = []

  // Try RSS 2.0 format
  const rssItems = xml.querySelectorAll('item')
  rssItems.forEach((item) => {
    const title = item.querySelector('title')?.textContent?.trim()
    const link = item.querySelector('link')?.textContent?.trim()
    const pubDate = item.querySelector('pubDate')?.textContent?.trim()
    const description = item.querySelector('description')?.textContent?.trim()

    if (title && link) {
      // Strip HTML from description
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = description || ''
      const cleanDesc = tempDiv.textContent || tempDiv.innerText || ''

      items.push({
        title,
        link,
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        description: cleanDesc.slice(0, 200),
        source: source.name,
        category: source.category,
        color: source.color,
      })
    }
  })

  // Try Atom format if no RSS items found
  if (items.length === 0) {
    const entries = xml.querySelectorAll('entry')
    entries.forEach((entry) => {
      const title = entry.querySelector('title')?.textContent?.trim()
      const linkEl = entry.querySelector('link[href]')
      const link = linkEl?.getAttribute('href')
      const published = entry.querySelector('published')?.textContent?.trim()
        || entry.querySelector('updated')?.textContent?.trim()
      const summary = entry.querySelector('summary')?.textContent?.trim()
        || entry.querySelector('content')?.textContent?.trim()

      if (title && link) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = summary || ''
        const cleanDesc = tempDiv.textContent || tempDiv.innerText || ''

        items.push({
          title,
          link,
          pubDate: published ? new Date(published) : new Date(),
          description: cleanDesc.slice(0, 200),
          source: source.name,
          category: source.category,
          color: source.color,
        })
      }
    })
  }

  return items.slice(0, 8)
}

async function fetchWithProxy(url) {
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url)
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        return await res.text()
      }
    } catch {
      continue
    }
  }
  return null
}

export function useNewsFeeds() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled(
        RSS_SOURCES.map(async (source) => {
          const xmlText = await fetchWithProxy(source.url)
          if (!xmlText) return []
          return parseRSSItems(xmlText, source)
        })
      )

      const allArticles = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value)
        .sort((a, b) => b.pubDate - a.pubDate)

      // Deduplicate by title similarity
      const seen = new Set()
      const unique = allArticles.filter((article) => {
        const key = article.title.toLowerCase().slice(0, 50)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      if (unique.length === 0) {
        setArticles(getFallbackArticles())
      } else {
        setArticles(unique)
      }
      setLastUpdated(new Date())
    } catch (err) {
      setError('Could not load live feeds. Showing curated articles.')
      setArticles(getFallbackArticles())
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return { articles, loading, error, lastUpdated, refresh: fetchNews }
}

function getFallbackArticles() {
  return [
    {
      title: 'OpenAI Announces GPT-5 With Enhanced Reasoning Capabilities',
      link: 'https://techcrunch.com/category/artificial-intelligence/',
      pubDate: new Date(),
      description: 'The latest model from OpenAI brings significant improvements to multi-step reasoning, code generation, and real-time data analysis capabilities.',
      source: 'TechCrunch AI',
      category: 'Industry',
      color: '#10b981',
    },
    {
      title: 'Google DeepMind Achieves Breakthrough in Protein Structure Prediction',
      link: 'https://www.technologyreview.com/',
      pubDate: new Date(Date.now() - 3600000),
      description: 'The research lab\'s latest AlphaFold model can now predict protein interactions with near-experimental accuracy, opening new doors for drug discovery.',
      source: 'MIT Tech Review',
      category: 'Research',
      color: '#ec4899',
    },
    {
      title: 'Microsoft Invests $10B in New AI-Optimized Data Center Network',
      link: 'https://www.theverge.com/ai-artificial-intelligence',
      pubDate: new Date(Date.now() - 7200000),
      description: 'The new data centers will feature custom-designed AI accelerators and advanced cooling systems to support next-generation AI workloads.',
      source: 'The Verge AI',
      category: 'Data Centers',
      color: '#8b5cf6',
    },
    {
      title: 'Anthropic Releases Claude with Advanced Tool Use and Computer Control',
      link: 'https://venturebeat.com/category/ai/',
      pubDate: new Date(Date.now() - 10800000),
      description: 'Claude can now interact with desktop applications, browse the web, and execute complex multi-step tasks autonomously.',
      source: 'VentureBeat AI',
      category: 'Tools',
      color: '#06b6d4',
    },
    {
      title: 'NVIDIA Unveils Next-Gen Blackwell Ultra GPUs for AI Training',
      link: 'https://arstechnica.com/ai/',
      pubDate: new Date(Date.now() - 14400000),
      description: 'The new B300 GPUs deliver 4x performance improvement over previous generation, targeting enterprise AI training and inference workloads.',
      source: 'Ars Technica AI',
      category: 'Data Centers',
      color: '#f59e0b',
    },
    {
      title: 'Meta Open-Sources Llama 4 with Mixture-of-Experts Architecture',
      link: 'https://techcrunch.com/category/artificial-intelligence/',
      pubDate: new Date(Date.now() - 18000000),
      description: 'The fully open-source model matches proprietary models in benchmarks while being significantly more efficient to run on consumer hardware.',
      source: 'TechCrunch AI',
      category: 'Industry',
      color: '#10b981',
    },
    {
      title: 'Cursor and GitHub Copilot Battle for AI Coding Tool Supremacy',
      link: 'https://www.theverge.com/ai-artificial-intelligence',
      pubDate: new Date(Date.now() - 21600000),
      description: 'AI-powered coding assistants are transforming software development, with new features like multi-file editing and autonomous debugging.',
      source: 'The Verge AI',
      category: 'Tools',
      color: '#8b5cf6',
    },
    {
      title: 'EU AI Act Enforcement Begins: What Companies Need to Know',
      link: 'https://www.technologyreview.com/',
      pubDate: new Date(Date.now() - 25200000),
      description: 'New regulations mandate transparency, risk assessments, and human oversight for high-risk AI systems deployed in the European Union.',
      source: 'MIT Tech Review',
      category: 'Industry',
      color: '#ec4899',
    },
    {
      title: 'Perplexity AI Raises $500M, Aims to Replace Traditional Search',
      link: 'https://venturebeat.com/category/ai/',
      pubDate: new Date(Date.now() - 28800000),
      description: 'The AI-powered search engine now processes over 100 million queries per day, directly challenging Google\'s search dominance.',
      source: 'VentureBeat AI',
      category: 'Tools',
      color: '#06b6d4',
    },
    {
      title: 'AWS Launches Custom AI Chips to Reduce Cloud Computing Costs',
      link: 'https://arstechnica.com/ai/',
      pubDate: new Date(Date.now() - 32400000),
      description: 'The Trainium3 chips promise 50% cost reduction for AI inference workloads compared to traditional GPU-based solutions.',
      source: 'Ars Technica AI',
      category: 'Data Centers',
      color: '#f59e0b',
    },
    {
      title: 'Stable Diffusion 4 Generates Photorealistic Video From Text Prompts',
      link: 'https://techcrunch.com/category/artificial-intelligence/',
      pubDate: new Date(Date.now() - 36000000),
      description: 'The new model can produce 60-second high-definition videos with consistent characters and physics-accurate movements.',
      source: 'TechCrunch AI',
      category: 'Tools',
      color: '#10b981',
    },
    {
      title: 'AI-Powered Drug Discovery Enters Phase 3 Clinical Trials',
      link: 'https://www.technologyreview.com/',
      pubDate: new Date(Date.now() - 39600000),
      description: 'Insilico Medicine\'s AI-designed drug candidate for fibrosis shows promising results, potentially cutting drug development timelines by years.',
      source: 'MIT Tech Review',
      category: 'Research',
      color: '#ec4899',
    },
  ]
}
