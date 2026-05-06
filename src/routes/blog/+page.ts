export const prerender = true;

type PostMeta = {
	title: string;
	description: string;
	date: string;
	tag?: string;
	author?: string;
	read?: string;
};

function estimateReadTime(text: string): string {
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.max(1, Math.round(words / 220));
	return `${minutes} min`;
}

export async function load() {
	const modules = import.meta.glob('/src/content/blog/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	});
	const meta = import.meta.glob('/src/content/blog/*.md', { eager: true });

	const posts = [] as Array<{
		slug: string;
		read: string;
		author: string;
	} & PostMeta>;

	for (const [path, mod] of Object.entries(meta)) {
		const slug = path.split('/').pop()!.replace('.md', '');
		const m = (mod as { metadata: PostMeta }).metadata;
		const raw = (modules[path] as string) ?? '';
		posts.push({
			slug,
			...m,
			author: m.author ?? 'Team',
			read: m.read ?? estimateReadTime(raw)
		});
	}
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return { posts };
}
