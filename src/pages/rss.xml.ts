import type { APIContext } from 'astro'
import { buildFeed } from '../lib/feed'

export async function GET({ site, url }: APIContext): Promise<Response> {
  return new Response(await buildFeed('ru', site ?? new URL(url.origin)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
