import { useEffect, useState } from "react";
import { Box, Text, render, useApp, useInput, useStdout } from "ink";
import chalk from "chalk";
import { jsx, jsxs } from "react/jsx-runtime";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
//#region src/plasma-math.js
/**
* Classic 2D plasma intensity function.
* Sum of four sine waves, normalized to [0, 1].
* @param {number} x - column
* @param {number} y - row
* @param {number} t - time (scaled)
* @returns {number} - value in [0, 1]
*/
function intensity(x, y, t) {
	return (Math.sin(x * .15 + t) + Math.sin(y * .12 + t * .8) + Math.sin((x + y) * .1 + t * .5) + Math.sin(Math.sqrt(x * x + y * y) * .12 + t) + 4) / 8;
}
//#endregion
//#region src/palette.js
const PALETTE = [
	[
		255,
		0,
		255
	],
	[
		180,
		0,
		255
	],
	[
		0,
		64,
		255
	],
	[
		0,
		255,
		255
	],
	[
		0,
		255,
		180
	],
	[
		255,
		0,
		255
	]
];
/**
* Linearly interpolate between two rgb triples.
* @param {[number, number, number]} a
* @param {[number, number, number]} b
* @param {number} t - 0..1
*/
function lerp(a, b, t) {
	return [
		Math.round(a[0] + (b[0] - a[0]) * t),
		Math.round(a[1] + (b[1] - a[1]) * t),
		Math.round(a[2] + (b[2] - a[2]) * t)
	];
}
/**
* Map an intensity in [0, 1] to a color by stepping through the palette stops.
* @param {number} intensity - 0..1
*/
function sample(intensity) {
	const stops = PALETTE.length - 1;
	const scaled = Math.max(0, Math.min(1, intensity)) * stops;
	const idx = Math.min(Math.floor(scaled), stops - 1);
	const t = scaled - idx;
	return lerp(PALETTE[idx], PALETTE[idx + 1], t);
}
//#endregion
//#region src/Plasma.jsx
const BLOCK = "█";
function Plasma({ width, height }) {
	const [tick, setTick] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 60);
		return () => clearInterval(id);
	}, []);
	const t = tick * .08;
	const lines = [];
	for (let y = 0; y < height; y++) {
		let line = "";
		for (let x = 0; x < width; x++) {
			const [r, g, b] = sample(intensity(x, y, t));
			line += chalk.rgb(r, g, b)(BLOCK);
		}
		lines.push(line);
	}
	return /* @__PURE__ */ jsx(Text, { children: lines.join("\n") });
}
//#endregion
//#region src/content.js
const tagline = "jukben · product engineer · prague";
const menu = [
	{
		key: "A",
		label: "bout",
		section: "about"
	},
	{
		key: "W",
		label: "riting",
		section: "writing"
	},
	{
		key: "T",
		label: "alks",
		section: "talks"
	},
	{
		key: "G",
		label: "reetz",
		section: "greetz"
	},
	{
		key: "C",
		label: "ontact",
		section: "contact"
	},
	{
		key: "Q",
		label: "uit",
		section: null
	}
];
const scrollerText = "»»» " + [
	"welcome to jukben.codes",
	"hit [a] to read the about",
	"new article: the day my product leader out-engineered me",
	"currently building calendarpipe & advocate",
	"shoutouts to everyone still learning in public",
	"press [q] to quit, or don't",
	"keep on sceneing"
].join(" »»» ") + " »»» ";
const panels = {
	about: {
		title: "about",
		body: [
			"JUKBEN",
			"product engineer · prague",
			"",
			"builder with 10+ years of experience delivering end-to-end.",
			"started by shipping freeware games as a teenager, and haven't",
			"stopped since. roots on the frontend, more time these days",
			"across the whole stack and infrastructure.",
			"",
			"currently: advocate technologies · calendarpipe",
			"previously: productboard · outreach",
			"",
			"learning the dark arts of agentic development and tuning my",
			"workflow for a world where half the keyboard isn't mine."
		]
	},
	writing: {
		title: "writing",
		body: [
			"1. the day my product leader out-engineered me",
			"2. analyzing your webpack bundle like a pro",
			"3. the ultimate git flow: trunk-based dev & stacked prs",
			"4. outcomes over outputs",
			"5. reflection on social media in the era of elon musk",
			"6. scaling monorepo: to infinity and beyond",
			"7. how we revamped rfc process at productboard",
			"8. one yarn to rule them all",
			"",
			"read more at jukben.codes"
		]
	},
	talks: {
		title: "talks",
		body: [
			"my talks:",
			"  · co možná nevíte o react dev tools",
			"  · frodo baggins but with federated graphql",
			"  · fighting chaos in a monorepo",
			"",
			"appearances:",
			"  · the real role of staff/principal developers",
			"  · from ic to manager and back",
			"  · techuncovered: platform frontend"
		]
	},
	greetz: {
		title: "greetz",
		body: [
			"            ═══ GREETZ ═══",
			"",
			"productboard frontend platform crew · you know who you are",
			"the outreach settings-platform survivors",
			"advocate technologies — thanks for the trust",
			"calendarpipe early adopters",
			"everyone who ever reviewed my gnarly RFC",
			"the reactgirls community",
			"the monorepo tooling gang",
			"anyone still using federated graphql in anger",
			"",
			"     special greetz to the warez scene of '98",
			"        you taught us what intros meant"
		]
	},
	contact: {
		title: "contact",
		body: [
			"  email    jukben@gmail.com",
			"  web      jukben.codes",
			"  github   github.com/jukben",
			"  linkedin linkedin.com/in/jukben"
		]
	}
};
//#endregion
//#region src/Chrome.jsx
function Chrome() {
	return /* @__PURE__ */ jsxs(Box, {
		flexDirection: "column",
		alignItems: "center",
		children: [
			/* @__PURE__ */ jsx(Gradient, {
				name: "pastel",
				children: /* @__PURE__ */ jsx(BigText, {
					text: "JUKBEN",
					font: "block"
				})
			}),
			/* @__PURE__ */ jsx(Text, {
				color: "white",
				children: tagline
			}),
			/* @__PURE__ */ jsx(Box, {
				marginTop: 1,
				children: menu.map((item, i) => /* @__PURE__ */ jsxs(Text, { children: [
					i > 0 ? "  " : "",
					/* @__PURE__ */ jsxs(Text, {
						color: "magenta",
						children: [
							"[",
							item.key,
							"]"
						]
					}),
					/* @__PURE__ */ jsx(Text, {
						color: "white",
						children: item.label
					})
				] }, item.key))
			})
		]
	});
}
//#endregion
//#region src/scroller-math.js
/**
* Compute the visible slice of a scrolling marquee at the given offset.
* Wraps around seamlessly and handles widths larger than the source text.
* @param {string} text
* @param {number} width
* @param {number} offset
* @returns {string}
*/
function visibleScroller(text, width, offset) {
	const n = text.length;
	if (n === 0 || width <= 0) return "";
	const start = (offset % n + n) % n;
	let out = "";
	for (let i = 0; i < width; i++) out += text[(start + i) % n];
	return out;
}
//#endregion
//#region src/Scroller.jsx
function Scroller({ width }) {
	const [offset, setOffset] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setOffset((o) => o + 1), 80);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ jsx(Text, {
		color: "cyan",
		children: visibleScroller(scrollerText, width, offset)
	});
}
//#endregion
//#region src/Panel.jsx
function Panel({ section }) {
	const content = panels[section];
	if (!content) return null;
	return /* @__PURE__ */ jsxs(Box, {
		borderStyle: "single",
		borderColor: "magenta",
		flexDirection: "column",
		padding: 1,
		width: 64,
		children: [
			/* @__PURE__ */ jsx(Box, {
				justifyContent: "center",
				marginBottom: 1,
				children: /* @__PURE__ */ jsxs(Text, {
					bold: true,
					color: "cyan",
					children: [
						"═══ ",
						content.title,
						" ═══"
					]
				})
			}),
			content.body.map((line, i) => /* @__PURE__ */ jsx(Text, {
				color: "white",
				children: line || " "
			}, i)),
			/* @__PURE__ */ jsx(Box, {
				justifyContent: "center",
				marginTop: 1,
				children: /* @__PURE__ */ jsx(Text, {
					color: "gray",
					children: "[any key] back"
				})
			})
		]
	});
}
//#endregion
//#region src/App.jsx
const KEY_TO_SECTION = {
	a: "about",
	w: "writing",
	t: "talks",
	g: "greetz",
	c: "contact"
};
const CHROME_ROWS = 14;
const SCROLLER_ROWS = 1;
function App() {
	const { exit } = useApp();
	const { stdout } = useStdout();
	const [size, setSize] = useState({
		columns: stdout.columns || 80,
		rows: stdout.rows || 24
	});
	const [panel, setPanel] = useState(null);
	useEffect(() => {
		if (typeof stdout.on !== "function") return;
		const onResize = () => {
			setSize({
				columns: stdout.columns || 80,
				rows: stdout.rows || 24
			});
		};
		stdout.on("resize", onResize);
		return () => stdout.off("resize", onResize);
	}, [stdout]);
	useInput((input, key) => {
		if (key.escape || key.ctrl && input === "c") {
			exit();
			return;
		}
		const ch = (input || "").toLowerCase();
		if (ch === "q") {
			exit();
			return;
		}
		if (panel) {
			setPanel(null);
			return;
		}
		if (KEY_TO_SECTION[ch]) setPanel(KEY_TO_SECTION[ch]);
	});
	const middleHeight = Math.max(1, size.rows - CHROME_ROWS - SCROLLER_ROWS);
	return /* @__PURE__ */ jsxs(Box, {
		flexDirection: "column",
		width: size.columns,
		height: size.rows,
		children: [
			/* @__PURE__ */ jsx(Chrome, {}),
			/* @__PURE__ */ jsx(Box, {
				width: size.columns,
				height: middleHeight,
				justifyContent: "center",
				alignItems: "center",
				children: panel ? /* @__PURE__ */ jsx(Panel, { section: panel }) : /* @__PURE__ */ jsx(Plasma, {
					width: size.columns,
					height: middleHeight
				})
			}),
			/* @__PURE__ */ jsx(Scroller, { width: size.columns })
		]
	});
}
//#endregion
//#region src/index.js
process.stdout.write("\x1B[?1049h");
render(/* @__PURE__ */ jsx(App, {})).waitUntilExit().then(() => {
	process.stdout.write("\x1B[?1049l");
	process.stdout.write("thanks for stopping by — jukben.codes\n");
});
//#endregion
export {};
