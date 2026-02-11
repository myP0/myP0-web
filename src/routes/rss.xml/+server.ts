export const prerender = true;

export async function GET() {
	const site = 'https://myp0.com';
	const modules = import.meta.glob('/src/content/blog/*.md', { eager: true });

	const posts: { slug: string; title: string; description: string; date: string }[] = [];
	for (const [path, module] of Object.entries(modules)) {
		const slug = path.split('/').pop()!.replace('.md', '');
		const mod = module as { metadata: { title: string; description: string; date: string } };
		posts.push({ slug, ...mod.metadata });
	}
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>myP0 Blog</title>
    <description>Insights on productivity systems, data ownership, and building privacy-first tools.</description>
    <link>${site}/blog</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date(posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
${posts
	.map(
		(post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${site}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
	)
	.join('\n')}
  </channel>
</rss>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
