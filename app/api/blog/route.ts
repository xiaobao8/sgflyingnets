import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Flyingnets-Website/1.0' },
})

export type BlogPost = {
  title: string
  link: string
  pubDate: string
  contentSnippet?: string
  creator?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rssUrl = searchParams.get('url')
  const limit = Math.min(parseInt(searchParams.get('limit') || '6', 10) || 6, 50)

  if (!rssUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const feed = await parser.parseURL(rssUrl)
    const posts: BlogPost[] = (feed.items || []).slice(0, limit).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || item.guid || '',
      pubDate: item.pubDate || item.isoDate || '',
      contentSnippet: item.contentSnippet || item.content?.replace(/<[^>]+>/g, '').slice(0, 120),
      creator: item.creator,
    }))

    return NextResponse.json({ posts, title: feed.title })
  } catch (err) {
    console.error('[blog] RSS fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch blog feed', posts: [] },
      { status: 500 }
    )
  }
}
