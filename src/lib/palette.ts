// Notion-inspired pastel color palette — 24 colors
// Used universally for hashtag labels, calendar events, and any colored UI element.
//
// Each color has:
//   name  – human-readable identifier (used as the color key)
//   light – { bg, text, border } CSS custom property values for light mode
//   dark  – { bg, text, border } CSS custom property values for dark mode

export interface PaletteColor {
	name: string;
	light: { bg: string; text: string; border: string };
	dark: { bg: string; text: string; border: string };
}

export const palette: PaletteColor[] = [
	// --- Notion core colors ---
	{ name: 'gray',        light: { bg: '#F1F1EF', text: '#787774', border: '#E3E2DE' }, dark: { bg: '#252525', text: '#9B9A97', border: '#373737' } },
	{ name: 'brown',       light: { bg: '#F4EEEE', text: '#976D57', border: '#E9DCDC' }, dark: { bg: '#2C2522', text: '#BA856F', border: '#3D322E' } },
	{ name: 'orange',      light: { bg: '#FAEBDD', text: '#CC772F', border: '#F5D9BC' }, dark: { bg: '#2D2612', text: '#CB8347', border: '#3E3419' } },
	{ name: 'yellow',      light: { bg: '#FBF3DB', text: '#C29243', border: '#F7E7B8' }, dark: { bg: '#2C2B1A', text: '#C6A24A', border: '#3D3A24' } },
	{ name: 'green',       light: { bg: '#EDF3EC', text: '#548064', border: '#DBEAD8' }, dark: { bg: '#1E2B22', text: '#6C9B7D', border: '#2B3D30' } },
	{ name: 'blue',        light: { bg: '#E7F3F8', text: '#477DA5', border: '#D0E5EF' }, dark: { bg: '#1A2730', text: '#6B9FC1', border: '#263745' } },
	{ name: 'purple',      light: { bg: '#F4F0F7', text: '#9065B0', border: '#E8DFF0' }, dark: { bg: '#28222E', text: '#A87CC0', border: '#372F42' } },
	{ name: 'pink',        light: { bg: '#F9F0F5', text: '#B14F8A', border: '#F2DFEB' }, dark: { bg: '#2C2128', text: '#C76FA0', border: '#3D2E39' } },
	{ name: 'red',         light: { bg: '#FDEBEC', text: '#C4554D', border: '#FBD7D8' }, dark: { bg: '#2D2120', text: '#D16B63', border: '#3E2E2D' } },

	// --- Extended pastel shades ---
	{ name: 'lightGray',   light: { bg: '#F7F7F5', text: '#9F9E9B', border: '#EEEDE9' }, dark: { bg: '#1F1F1F', text: '#8B8A88', border: '#2D2D2D' } },
	{ name: 'tan',         light: { bg: '#F9F2E8', text: '#A68A6B', border: '#F2E4D1' }, dark: { bg: '#2A261F', text: '#B89B7C', border: '#3A352C' } },
	{ name: 'peach',       light: { bg: '#FDF0E6', text: '#D08B5B', border: '#FAE0CC' }, dark: { bg: '#2E2418', text: '#D49563', border: '#40331F' } },
	{ name: 'lemon',       light: { bg: '#FDF8E1', text: '#B5A233', border: '#FBF0C3' }, dark: { bg: '#2B2A17', text: '#BBA93B', border: '#3C3A20' } },
	{ name: 'lime',        light: { bg: '#E9F5E0', text: '#5E9A4F', border: '#D4EBC5' }, dark: { bg: '#1D2C19', text: '#73AD5F', border: '#2A3E22' } },
	{ name: 'mint',        light: { bg: '#E0F4EF', text: '#3D9B82', border: '#C2EAE0' }, dark: { bg: '#192C27', text: '#55B099', border: '#253E35' } },
	{ name: 'teal',        light: { bg: '#E0F0F4', text: '#3D8FA5', border: '#C2E0EA' }, dark: { bg: '#192730', text: '#55A5BF', border: '#253645' } },
	{ name: 'sky',         light: { bg: '#E4EEFB', text: '#5B8EC9', border: '#CADDFB' }, dark: { bg: '#1B2535', text: '#72A4D9', border: '#28364C' } },
	{ name: 'lavender',    light: { bg: '#EDEBF8', text: '#7E6DB3', border: '#DCD8F2' }, dark: { bg: '#24212E', text: '#9688C4', border: '#332F44' } },
	{ name: 'grape',       light: { bg: '#F3EAF6', text: '#9F5EB5', border: '#E7D5EE' }, dark: { bg: '#29202E', text: '#B576C9', border: '#392D42' } },
	{ name: 'magenta',     light: { bg: '#FBE9F1', text: '#C44D82', border: '#F7D2E3' }, dark: { bg: '#2D1E26', text: '#D46598', border: '#3F2B36' } },
	{ name: 'coral',       light: { bg: '#FDE9E6', text: '#D06B5E', border: '#FAD3CE' }, dark: { bg: '#2D201E', text: '#DB8176', border: '#3F2D2A' } },
	{ name: 'apricot',     light: { bg: '#FDF0E0', text: '#C88840', border: '#FAE1C1' }, dark: { bg: '#2D2517', text: '#D29A56', border: '#3F3420' } },
	{ name: 'sage',        light: { bg: '#E6EFEA', text: '#5E8E72', border: '#CDDFD5' }, dark: { bg: '#1C2A22', text: '#74A688', border: '#293C30' } },
	{ name: 'slate',       light: { bg: '#E8ECF0', text: '#5E7388', border: '#D1D9E1' }, dark: { bg: '#1D2329', text: '#7690A5', border: '#2A3340' } },
];

// Lookup by name
const paletteMap = new Map(palette.map(c => [c.name, c]));
export function getPaletteColor(name: string): PaletteColor {
	return paletteMap.get(name) || palette[0];
}

// Deterministic color from a string (for hashtags, auto-assignment, etc.)
export function hashColor(str: string): PaletteColor {
	let hash = 0;
	for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
	return palette[Math.abs(hash) % palette.length];
}

// Inline style helpers — use these to apply palette colors via style attribute
export function colorStyle(color: PaletteColor, mode: 'light' | 'dark') {
	const c = mode === 'dark' ? color.dark : color.light;
	return `background-color: ${c.bg}; color: ${c.text}; border-color: ${c.border};`;
}
