// src/index.js
import React6 from "react";
import { render } from "ink";

// src/App.jsx
import React5, { useEffect as useEffect3, useState as useState3 } from "react";
import { Box as Box3, useApp, useInput, useStdout } from "ink";

// src/Plasma.jsx
import React, { useEffect, useState } from "react";
import { Text } from "ink";
import chalk from "chalk";

// src/plasma-math.js
function intensity(x, y, t) {
  const v = Math.sin(x * 0.15 + t) + Math.sin(y * 0.12 + t * 0.8) + Math.sin((x + y) * 0.1 + t * 0.5) + Math.sin(Math.sqrt(x * x + y * y) * 0.12 + t);
  return (v + 4) / 8;
}

// src/palette.js
var PALETTE = [
  [255, 0, 255],
  // magenta
  [180, 0, 255],
  // purple
  [0, 64, 255],
  // blue
  [0, 255, 255],
  // cyan
  [0, 255, 180],
  // teal
  [255, 0, 255]
  // back to magenta
];
function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}
function sample(intensity2) {
  const stops = PALETTE.length - 1;
  const scaled = Math.max(0, Math.min(1, intensity2)) * stops;
  const idx = Math.min(Math.floor(scaled), stops - 1);
  const t = scaled - idx;
  return lerp(PALETTE[idx], PALETTE[idx + 1], t);
}

// src/Plasma.jsx
var BLOCK = "\u2588";
function Plasma({ width, height }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t2) => t2 + 1), 60);
    return () => clearInterval(id);
  }, []);
  const t = tick * 0.08;
  const lines = [];
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const [r, g, b] = sample(intensity(x, y, t));
      line += chalk.rgb(r, g, b)(BLOCK);
    }
    lines.push(line);
  }
  return /* @__PURE__ */ React.createElement(Text, null, lines.join("\n"));
}

// src/Chrome.jsx
import React2 from "react";
import { Box, Text as Text2 } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";

// src/content.js
var tagline = "jukben \xB7 product engineer \xB7 prague";
var menu = [
  { key: "A", label: "bout", section: "about" },
  { key: "W", label: "riting", section: "writing" },
  { key: "T", label: "alks", section: "talks" },
  { key: "G", label: "reetz", section: "greetz" },
  { key: "C", label: "ontact", section: "contact" },
  { key: "Q", label: "uit", section: null }
];
var scrollerFragments = [
  "welcome to jukben.codes",
  "hit [a] to read the about",
  "new article: the day my product leader out-engineered me",
  "currently building calendarpipe & advocate",
  "shoutouts to everyone still learning in public",
  "press [q] to quit, or don't",
  "keep on sceneing"
];
var scrollerText = "\xBB\xBB\xBB " + scrollerFragments.join(" \xBB\xBB\xBB ") + " \xBB\xBB\xBB ";
var panels = {
  about: {
    title: "about",
    body: [
      "JUKBEN",
      "product engineer \xB7 prague",
      "",
      "builder with 10+ years of experience delivering end-to-end.",
      "started by shipping freeware games as a teenager, and haven't",
      "stopped since. roots on the frontend, more time these days",
      "across the whole stack and infrastructure.",
      "",
      "currently: advocate technologies \xB7 calendarpipe",
      "previously: productboard \xB7 outreach",
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
      "  \xB7 co mo\u017En\xE1 nev\xEDte o react dev tools",
      "  \xB7 frodo baggins but with federated graphql",
      "  \xB7 fighting chaos in a monorepo",
      "",
      "appearances:",
      "  \xB7 the real role of staff/principal developers",
      "  \xB7 from ic to manager and back",
      "  \xB7 techuncovered: platform frontend"
    ]
  },
  greetz: {
    title: "greetz",
    body: [
      "            \u2550\u2550\u2550 GREETZ \u2550\u2550\u2550",
      "",
      "productboard frontend platform crew \xB7 you know who you are",
      "the outreach settings-platform survivors",
      "advocate technologies \u2014 thanks for the trust",
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

// src/Chrome.jsx
function Chrome() {
  return /* @__PURE__ */ React2.createElement(Box, { flexDirection: "column", alignItems: "center" }, /* @__PURE__ */ React2.createElement(Gradient, { name: "pastel" }, /* @__PURE__ */ React2.createElement(BigText, { text: "JUKBEN", font: "block" })), /* @__PURE__ */ React2.createElement(Text2, { color: "white" }, tagline), /* @__PURE__ */ React2.createElement(Box, { marginTop: 1 }, menu.map((item, i) => /* @__PURE__ */ React2.createElement(Text2, { key: item.key }, i > 0 ? "  " : "", /* @__PURE__ */ React2.createElement(Text2, { color: "magenta" }, "[", item.key, "]"), /* @__PURE__ */ React2.createElement(Text2, { color: "white" }, item.label)))));
}

// src/Scroller.jsx
import React3, { useEffect as useEffect2, useState as useState2 } from "react";
import { Text as Text3 } from "ink";

// src/scroller-math.js
function visibleScroller(text, width, offset) {
  const n = text.length;
  if (n === 0 || width <= 0) return "";
  const start = (offset % n + n) % n;
  let out = "";
  for (let i = 0; i < width; i++) {
    out += text[(start + i) % n];
  }
  return out;
}

// src/Scroller.jsx
function Scroller({ width }) {
  const [offset, setOffset] = useState2(0);
  useEffect2(() => {
    const id = setInterval(() => setOffset((o) => o + 1), 80);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ React3.createElement(Text3, { color: "cyan" }, visibleScroller(scrollerText, width, offset));
}

// src/Panel.jsx
import React4 from "react";
import { Box as Box2, Text as Text4 } from "ink";
function Panel({ section }) {
  const content = panels[section];
  if (!content) return null;
  return /* @__PURE__ */ React4.createElement(
    Box2,
    {
      borderStyle: "single",
      borderColor: "magenta",
      flexDirection: "column",
      padding: 1,
      width: 64
    },
    /* @__PURE__ */ React4.createElement(Box2, { justifyContent: "center", marginBottom: 1 }, /* @__PURE__ */ React4.createElement(Text4, { bold: true, color: "cyan" }, "\u2550\u2550\u2550 ", content.title, " \u2550\u2550\u2550")),
    content.body.map((line, i) => /* @__PURE__ */ React4.createElement(Text4, { key: i, color: "white" }, line || " ")),
    /* @__PURE__ */ React4.createElement(Box2, { justifyContent: "center", marginTop: 1 }, /* @__PURE__ */ React4.createElement(Text4, { color: "gray" }, "[any key] back"))
  );
}

// src/App.jsx
var KEY_TO_SECTION = {
  a: "about",
  w: "writing",
  t: "talks",
  g: "greetz",
  c: "contact"
};
var CHROME_ROWS = 14;
var SCROLLER_ROWS = 1;
function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [size, setSize] = useState3({
    columns: stdout.columns || 80,
    rows: stdout.rows || 24
  });
  const [panel, setPanel] = useState3(null);
  useEffect3(() => {
    if (typeof stdout.on !== "function") {
      return;
    }
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
    if (KEY_TO_SECTION[ch]) {
      setPanel(KEY_TO_SECTION[ch]);
    }
  });
  const middleHeight = Math.max(1, size.rows - CHROME_ROWS - SCROLLER_ROWS);
  return /* @__PURE__ */ React5.createElement(Box3, { flexDirection: "column", width: size.columns, height: size.rows }, /* @__PURE__ */ React5.createElement(Chrome, null), /* @__PURE__ */ React5.createElement(
    Box3,
    {
      width: size.columns,
      height: middleHeight,
      justifyContent: "center",
      alignItems: "center"
    },
    panel ? /* @__PURE__ */ React5.createElement(Panel, { section: panel }) : /* @__PURE__ */ React5.createElement(Plasma, { width: size.columns, height: middleHeight })
  ), /* @__PURE__ */ React5.createElement(Scroller, { width: size.columns }));
}

// src/index.js
process.stdout.write("\x1B[?1049h");
var app = render(/* @__PURE__ */ React6.createElement(App, null));
app.waitUntilExit().then(() => {
  process.stdout.write("\x1B[?1049l");
  process.stdout.write("thanks for stopping by \u2014 jukben.codes\n");
});
