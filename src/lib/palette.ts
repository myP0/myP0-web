// Notion-style pastel color palette — 24 colors
// Used universally for hashtag labels, calendar events, and any colored UI element.
//
// Core 10 colors use Notion's exact tag/select values from react-notion-x.
// Extended 14 fill in additional hues for a full 24-color set.
//
// Each color has light + dark mode variants for bg, text, and border.

export interface PaletteColor {
	name: string;
	light: { bg: string; text: string; border: string };
	dark: { bg: string; text: string; border: string };
}

export const palette: PaletteColor[] = [
	// ── Notion core tag colors (exact values) ────────────────────────────
	//    Light bg: from notion select pill backgrounds
	//    Light text: from notion select pill text
	//    Dark bg: from notion dark mode tag backgrounds
	//    Dark text: light mode bg text inverted for readability
	{ name: 'gray',    light: { bg: '#E3E2E0', text: '#32302C', border: '#D5D4D1' }, dark: { bg: '#5A5A5A', text: '#E3E2E0', border: '#6B6B6B' } },
	{ name: 'brown',   light: { bg: '#EEE0DA', text: '#442A1E', border: '#E0CFC7' }, dark: { bg: '#603B2C', text: '#EEE0DA', border: '#7A4E3B' } },
	{ name: 'orange',  light: { bg: '#FADEC9', text: '#49290E', border: '#F5CEAB' }, dark: { bg: '#854C1D', text: '#FADEC9', border: '#A05F26' } },
	{ name: 'yellow',  light: { bg: '#FDECC8', text: '#402C1B', border: '#FADEA5' }, dark: { bg: '#89632A', text: '#FDECC8', border: '#A47A36' } },
	{ name: 'green',   light: { bg: '#DBEDDB', text: '#1C3829', border: '#C7E0C7' }, dark: { bg: '#2B593F', text: '#DBEDDB', border: '#387350' } },
	{ name: 'blue',    light: { bg: '#D3E5EF', text: '#183347', border: '#B8D4E5' }, dark: { bg: '#28456C', text: '#D3E5EF', border: '#345A8A' } },
	{ name: 'purple',  light: { bg: '#E8DEEE', text: '#412454', border: '#D8C9E3' }, dark: { bg: '#492F64', text: '#E8DEEE', border: '#5C3D7E' } },
	{ name: 'pink',    light: { bg: '#F5E0E9', text: '#4C2337', border: '#EDCCD9' }, dark: { bg: '#69314C', text: '#F5E0E9', border: '#844060' } },
	{ name: 'red',     light: { bg: '#FFE2DD', text: '#5D1715', border: '#FCC9C4' }, dark: { bg: '#6E3630', text: '#FFE2DD', border: '#8A443D' } },
	{ name: 'default', light: { bg: '#F1F1EF', text: '#32302C', border: '#E3E2E0' }, dark: { bg: '#373737', text: '#E3E2E0', border: '#484848' } },

	// ── Extended shades (Notion-inspired, matching the pastel feel) ──────
	{ name: 'peach',    light: { bg: '#FCEADE', text: '#6B3B1F', border: '#F8D6BF' }, dark: { bg: '#6E4525', text: '#FCEADE', border: '#8A5730' } },
	{ name: 'apricot',  light: { bg: '#FDF0D5', text: '#5C4316', border: '#FAE2B0' }, dark: { bg: '#7A5B24', text: '#FDF0D5', border: '#96722E' } },
	{ name: 'lime',     light: { bg: '#DEF0D8', text: '#264D1E', border: '#C6E3BC' }, dark: { bg: '#355E2B', text: '#DEF0D8', border: '#437637' } },
	{ name: 'mint',     light: { bg: '#D5EDE8', text: '#1A3F38', border: '#BCDFD7' }, dark: { bg: '#285750', text: '#D5EDE8', border: '#357065' } },
	{ name: 'teal',     light: { bg: '#D0E8EE', text: '#193C47', border: '#B5D8E3' }, dark: { bg: '#264F5E', text: '#D0E8EE', border: '#326576' } },
	{ name: 'sky',      light: { bg: '#D6E4F7', text: '#1E3A5F', border: '#BBCFEE' }, dark: { bg: '#2D4D78', text: '#D6E4F7', border: '#3A6296' } },
	{ name: 'lavender', light: { bg: '#E4DDF2', text: '#352560', border: '#D2C7E8' }, dark: { bg: '#413470', text: '#E4DDF2', border: '#54438D' } },
	{ name: 'grape',    light: { bg: '#EDDCF0', text: '#4E1F5E', border: '#DFCAE6' }, dark: { bg: '#57316A', text: '#EDDCF0', border: '#6E3F85' } },
	{ name: 'magenta',  light: { bg: '#F5DBE9', text: '#5A1D3D', border: '#EEC5D8' }, dark: { bg: '#732B52', text: '#F5DBE9', border: '#8F3767' } },
	{ name: 'coral',    light: { bg: '#FDDDD6', text: '#6B2118', border: '#FAC7BC' }, dark: { bg: '#7E3A2F', text: '#FDDDD6', border: '#9A4A3C' } },
	{ name: 'rose',     light: { bg: '#FDE2E4', text: '#6B1A2A', border: '#FACACE' }, dark: { bg: '#7A2D3B', text: '#FDE2E4', border: '#963A4C' } },
	{ name: 'tan',      light: { bg: '#EDE5DA', text: '#4A3726', border: '#DFD3C4' }, dark: { bg: '#554131', text: '#EDE5DA', border: '#6B523E' } },
	{ name: 'sage',     light: { bg: '#DCE8DF', text: '#2A4432', border: '#C5D8CA' }, dark: { bg: '#334D3B', text: '#DCE8DF', border: '#42634C' } },
	{ name: 'slate',    light: { bg: '#DEE3EA', text: '#2B3A4E', border: '#C7CFD9' }, dark: { bg: '#3A4A5E', text: '#DEE3EA', border: '#4C5F77' } },
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
