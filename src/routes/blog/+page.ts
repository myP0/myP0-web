export const prerender = true;

export async function load() {
	const modules = import.meta.glob('/src/content/blog/*.md', { eager: true });
	const posts = [];
	for (const [path, module] of Object.entries(modules)) {
		const slug = path.split('/').pop()!.replace('.md', '');
		const mod = module as { metadata: { title: string; description: string; date: string; tag?: string } };
		posts.push({
			slug,
			...mod.metadata
		});
	}
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return { posts };
}
