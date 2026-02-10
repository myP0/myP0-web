export const prerender = true;

export async function load({ params }) {
	const post = await import(`../../../content/blog/${params.slug}.md`);
	return {
		content: post.default,
		meta: post.metadata
	};
}

export async function entries() {
	const modules = import.meta.glob('/src/content/blog/*.md');
	const slugs = Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()!.replace('.md', '')
	}));
	return slugs;
}
