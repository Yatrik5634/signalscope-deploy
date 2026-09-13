import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteHeader-0EkJFRpu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Ceu_oRZy.js
var import_jsx_runtime = require_jsx_runtime();
var PIPELINE = [
	{
		step: "01",
		title: "Upload Image",
		body: "The file is checked for type and size before anything else happens."
	},
	{
		step: "02",
		title: "Image Analysis",
		body: "The image is decoded and normalized to the detector's input size."
	},
	{
		step: "03",
		title: "AI Detection",
		body: "The detector looks for traces that image generators tend to leave."
	},
	{
		step: "04",
		title: "Confidence Calculation",
		body: "The raw score is turned into a calibrated likelihood."
	},
	{
		step: "05",
		title: "Visual Explanation",
		body: "A heatmap marks the regions that influenced the score most."
	},
	{
		step: "06",
		title: "Final Result",
		body: "Verdict, confidence and written signals are shown together."
	}
];
var NOTICES = [
	"Results are probabilistic estimates, not measurements.",
	"The detector can make mistakes on both real and generated images.",
	"A result is never definitive proof of how an image was made.",
	"Results must not be used to accuse, identify or profile any person."
];
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-5 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-10 md:py-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs text-primary",
								children: "(d) about"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 max-w-[28ch] text-balance font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.98] tracking-tight",
								children: "A reading instrument, not a judge."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-[60ch] text-pretty text-base text-muted-foreground md:text-lg",
								children: "SignalScope is a media-forensics prototype for detecting AI-generated images. The interface stays deliberately thin: it sends an image to a detection service and presents whatever that service returns — a label, a likelihood, a heatmap and a short list of signals. The detection model can be replaced at any time without changing what you see here."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "how",
						className: "scroll-mt-20 py-8 md:py-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-primary",
								children: "(b)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl tracking-tight",
								children: "How it works"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "grid gap-4 md:grid-cols-3",
							children: PIPELINE.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "panel-sm p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: s.step
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5 font-semibold",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm text-muted-foreground",
										children: s.body
									})
								]
							}, s.step))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "responsible",
						className: "scroll-mt-20 py-8 md:py-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-5 md:p-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[11px] text-primary",
									children: "(c) responsible AI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-3xl tracking-tight",
									children: "Read every score carefully"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-5 grid gap-3 md:grid-cols-2",
									children: NOTICES.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2.5 text-sm text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-verdict-ai" }), notice]
									}, notice))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									hash: "analyze",
									className: "mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark",
									children: "Analyze an image"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AboutPage as component };
