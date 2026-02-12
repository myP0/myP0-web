export const prerender = true;

export async function GET() {
	const site = 'https://myp0.com';
	const modules = import.meta.glob('/src/content/blog/*.md', { eager: true });

	const blogPosts: { slug: string; date: string }[] = [];
	for (const [path, module] of Object.entries(modules)) {
		const slug = path.split('/').pop()!.replace('.md', '');
		const mod = module as { metadata: { date: string } };
		blogPosts.push({ slug, date: mod.metadata.date });
	}

	const latestPostDate = blogPosts.length > 0
		? blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
		: new Date().toISOString().split('T')[0];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}</loc>
    <lastmod>${latestPostDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${site}/blog</loc>
    <lastmod>${latestPostDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogPosts
	.map(
		(post) => `  <url>
    <loc>${site}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
