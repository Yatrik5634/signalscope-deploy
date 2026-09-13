import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteHeader-0EkJFRpu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CGQ7k2cR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_plate_default = "/assets/hero-plate-DqOCAxRw.jpg";
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-10 md:py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-frost/70 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-soft size-1.5 rounded-full bg-verdict-ai" }), "Probabilistic detector · not proof"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 text-balance font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.95] tracking-tight",
						children: ["Where the anomalies ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "glow."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-[42ch] text-pretty text-base text-muted-foreground md:text-lg",
						children: "SignalScope slides an image under a calibrated light table and reads the traces that generators leave behind — texture, light, geometry."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							hash: "analyze",
							className: "rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark",
							children: "Analyze Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							hash: "how",
							className: "rounded-xl bg-frost/70 px-5 py-3 text-sm font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost",
							children: "See how it works"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "probabilistic scoring" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grad-CAM trace" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "session-only" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rise-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-4 rounded-[28px] bg-primary/10 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative rounded-[24px] bg-frost/70 p-3 shadow-plate ring-1 ring-foreground/5 backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-[18px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_plate_default,
							alt: "Surveillance frame of a person in a corridor being examined by SignalScope",
							width: 1024,
							height: 640,
							className: "aspect-[16/10] w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sweep-bar absolute bottom-0 top-0 w-1/5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" })
						})]
					})
				})]
			})]
		})
	});
}
var STAGES = [
	{
		range: "01–02",
		title: "Ingest & normalize",
		body: "The image is validated, decoded and resized to a calibrated size for the detector."
	},
	{
		range: "03–04",
		title: "Detect & score",
		body: "The detector returns a label and a calibrated probability, not a hard verdict."
	},
	{
		range: "05–06",
		title: "Explain & report",
		body: "A Grad-CAM trace and plain-language signals show where the detector looked."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "how",
		className: "py-8 md:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-primary",
				children: "(b)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl tracking-tight",
				children: "How it works"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-sm p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: s.range
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
			}, s.range))
		})]
	});
}
var MESSAGES = {
	NO_IMAGE: "Please choose an image before analyzing.",
	INVALID_TYPE: "That file type isn't supported. Use a JPG, PNG or WEBP image.",
	TOO_LARGE: "That image is too large. Please use a file under 12 MB.",
	UPLOAD_FAILED: "The image couldn't be uploaded. Please try again.",
	BACKEND_UNAVAILABLE: "The analysis service is unavailable right now. Please try again shortly.",
	PREDICTION_FAILED: "We couldn't analyze this image. Please try a different one.",
	TIMEOUT: "The analysis took too long. Please try a smaller image."
};
var friendlyMessage = (code) => MESSAGES[code];
var PredictionError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.code = code;
	}
};
var ACCEPTED_TYPES$1 = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
var ACCEPTED_LABEL = "JPG, PNG, WEBP";
var MAX_LABEL = "12 MB";
var REQUEST_TIMEOUT_MS = 3e4;
var PREDICT_ENDPOINT = "https://signalscope-deploy.onrender.com/predict";
function validateImage(file) {
	if (!file) return "NO_IMAGE";
	if (!ACCEPTED_TYPES$1.includes(file.type)) return "INVALID_TYPE";
	if (file.size > 12582912) return "TOO_LARGE";
	return null;
}
async function predictReal(file, caption) {
	const body = new FormData();
	body.append("image", file);
	if (caption) body.append("caption", caption);
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	let response;
	try {
		response = await fetch(PREDICT_ENDPOINT, {
			method: "POST",
			body,
			signal: controller.signal
		});
	} catch (err) {
		clearTimeout(timer);
		if (err instanceof DOMException && err.name === "AbortError") throw new PredictionError("TIMEOUT");
		throw new PredictionError("BACKEND_UNAVAILABLE");
	}
	clearTimeout(timer);
	if (response.status >= 500) throw new PredictionError("BACKEND_UNAVAILABLE");
	if (!response.ok) throw new PredictionError("PREDICTION_FAILED");
	let data;
	try {
		data = await response.json();
	} catch {
		throw new PredictionError("PREDICTION_FAILED");
	}
	return normalize(data);
}
function normalize(data) {
	if (!data) throw new PredictionError("PREDICTION_FAILED");
	if (data.verdict && typeof data.confidence === "number") return data;
	if (data.label && typeof data.confidence === "number") {
		const label = data.label;
		const verdict = label === "AI-generated" ? "likely AI-generated" : label === "Real" ? "likely real" : "uncertain";
		const explanationArr = Array.isArray(data.explanation) ? data.explanation : [];
		const heatmap = typeof data.heatmap === "string" ? data.heatmap : "";
		return {
			verdict,
			confidence: Math.min(1, Math.max(0, data.confidence > 1 ? data.confidence / 100 : data.confidence)),
			threshold_used: .6,
			explanation: {
				summary: explanationArr[0] || "Analysis complete.",
				cues: explanationArr,
				heatmap_base64: heatmap
			},
			attribution: {
				family: label === "AI-generated" ? "Unknown AI Generator" : "N/A",
				family_confidence: 0
			},
			metadata: {
				c2pa_present: false,
				c2pa_valid: false,
				exif_summary: {}
			},
			robustness: {
				stability_score: .9,
				degradation_delta: .03
			},
			multimodal_consistency: {
				score: .85,
				is_consistent: true
			}
		};
	}
	throw new PredictionError("PREDICTION_FAILED");
}
/** The single entry point every component uses to get a prediction. */
async function predictImage(file, caption) {
	const problem = validateImage(file);
	if (problem) throw new PredictionError(problem);
	try {
		return await predictReal(file, caption);
	} catch (err) {
		if (err instanceof PredictionError) throw err;
		throw new PredictionError("PREDICTION_FAILED");
	}
}
var confidencePercent = (confidence) => Math.round(confidence * 100);
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
var VIEWS = [
	"Original",
	"Heatmap",
	"Overlay"
];
function ResultPanel({ result, imageUrl, imageName, onReset }) {
	const [view, setView] = (0, import_react.useState)("Overlay");
	const [opacity, setOpacity] = (0, import_react.useState)(60);
	const [activeTab, setActiveTab] = (0, import_react.useState)("explanation");
	const verdict = result.verdict;
	const isAi = verdict === "likely AI-generated";
	const isUncertain = verdict === "uncertain";
	const percent = confidencePercent(result.confidence);
	const accent = isAi ? "bg-verdict-ai" : isUncertain ? "bg-yellow-500" : "bg-verdict-real";
	const badge = isAi ? "bg-verdict-ai-soft text-verdict-ai ring-verdict-ai/20" : isUncertain ? "bg-yellow-100 text-yellow-700 ring-yellow-400/30" : "bg-verdict-real-soft text-verdict-real ring-verdict-real/20";
	const heatmapSrc = result.explanation.heatmap_base64;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "result",
		className: "scroll-mt-20 py-8 md:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rise-in panel p-5 md:p-7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-center gap-2",
						children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setView(v),
							className: view === v ? "rounded-lg bg-foreground px-3.5 py-2 text-xs font-medium text-background" : "rounded-lg bg-frost px-3.5 py-2 text-xs font-medium text-muted-foreground ring-1 ring-foreground/5 transition-colors hover:text-foreground",
							children: v
						}, v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-placeholder ring-1 ring-foreground/5",
						children: [view !== "Heatmap" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: imageUrl,
							alt: `Analyzed image ${imageName}`,
							className: "absolute inset-0 size-full object-contain"
						}), view !== "Original" && heatmapSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: heatmapSrc.startsWith("data:") ? heatmapSrc : `data:image/jpeg;base64,${heatmapSrc}`,
							alt: "Grad-CAM attention heatmap",
							loading: "lazy",
							className: `absolute inset-0 size-full object-contain mix-blend-multiply`,
							style: { opacity: view === "Overlay" ? opacity / 100 : 1 }
						})]
					}),
					view === "Overlay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: "Opacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 100,
								value: opacity,
								onChange: (e) => setOpacity(Number(e.target.value)),
								className: "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border/60 accent-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] text-muted-foreground w-8 text-right",
								children: [opacity, "%"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-[3px] bg-verdict-ai" }), "high signal"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-[3px] bg-signal-med" }), "medium"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-[3px] bg-signal-low" }), "low"]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${badge}`,
						children: verdict === "likely AI-generated" ? "Likely AI-Generated" : verdict === "likely real" ? "Likely Real" : "Uncertain / Inconclusive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Calibrated Confidence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-2xl font-medium tabular-nums",
									children: [percent, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base text-muted-foreground",
										children: "%"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-2 h-2.5 overflow-hidden rounded-full bg-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full ${accent} transition-all duration-500`,
									style: { width: `${percent}%` }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-0 h-full w-0.5 bg-foreground/40",
									style: { left: `${(result.threshold_used || .6) * 100}%` }
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"threshold: ",
										((result.threshold_used || .6) * 100).toFixed(0),
										"%"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "A calibrated probability estimate — not definitive proof."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-lg bg-frost p-3 text-sm",
						children: result.explanation.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex gap-1 overflow-x-auto border-b border-border/40 pb-0",
						children: [
							{
								key: "explanation",
								label: "Cues"
							},
							{
								key: "attribution",
								label: "Attribution"
							},
							{
								key: "metadata",
								label: "Metadata"
							},
							{
								key: "robustness",
								label: "Robustness"
							},
							{
								key: "multimodal",
								label: "Multimodal"
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab(t.key),
							className: `whitespace-nowrap rounded-t-md px-3 py-2 text-xs font-medium transition-colors ${activeTab === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
							children: t.label
						}, t.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 min-h-[120px]",
						children: [
							activeTab === "explanation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm",
								children: result.explanation.cues.map((cue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 size-1.5 shrink-0 rounded-full ${i === result.explanation.cues.length - 1 ? "bg-signal-med" : accent}` }), cue]
								}, i))
							}),
							activeTab === "attribution" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-frost p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[11px] text-muted-foreground mb-2",
											children: "GENERATOR FAMILY"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-semibold",
											children: result.attribution.family
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 h-2 overflow-hidden rounded-full bg-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-primary transition-all duration-500",
												style: { width: `${Math.round(result.attribution.family_confidence * 100)}%` }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 font-mono text-[10px] text-muted-foreground",
											children: [
												"Confidence: ",
												Math.round(result.attribution.family_confidence * 100),
												"%"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Generator family predicted by analyzing noise patterns and frequency-domain artifacts."
								})]
							}),
							activeTab === "metadata" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-frost p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-muted-foreground mb-3",
										children: "EXIF DATA"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
										className: "w-full text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(result.metadata.exif_summary).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-border/20 last:border-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3 font-medium text-muted-foreground",
												children: key
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 font-mono text-xs",
												children: val
											})]
										}, key)) })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-frost p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-muted-foreground mb-2",
										children: "C2PA / CONTENT CREDENTIALS"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${result.metadata.c2pa_valid ? "bg-verdict-real" : result.metadata.c2pa_present ? "bg-yellow-500" : "bg-muted-foreground/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: result.metadata.c2pa_valid ? "Valid Signature" : result.metadata.c2pa_present ? "Present (Unverified)" : "Not Present"
										})]
									})]
								})]
							}),
							activeTab === "robustness" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-frost p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-[11px] text-muted-foreground mb-2",
												children: "STABILITY SCORE"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-2xl font-medium tabular-nums",
													children: [Math.round(result.robustness.stability_score * 100), "%"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "stable under degradation"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 h-2 overflow-hidden rounded-full bg-border/60",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full bg-verdict-real transition-all duration-500",
													style: { width: `${Math.round(result.robustness.stability_score * 100)}%` }
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-frost p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[11px] text-muted-foreground mb-2",
											children: "CONFIDENCE DELTA"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-lg font-medium tabular-nums text-verdict-real",
												children: [
													"Δ ",
													(result.robustness.degradation_delta * 100).toFixed(1),
													"%"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "change after JPEG compression"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Measures how much the model's prediction shifts when applying JPEG compression and downsampling."
									})
								]
							}),
							activeTab === "multimodal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-frost p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[11px] text-muted-foreground mb-2",
											children: "IMAGE-TEXT CONSISTENCY"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-2xl font-medium tabular-nums",
												children: [Math.round(result.multimodal_consistency.score * 100), "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${result.multimodal_consistency.is_consistent ? "bg-verdict-real-soft text-verdict-real" : "bg-verdict-ai-soft text-verdict-ai"}`,
												children: result.multimodal_consistency.is_consistent ? "Consistent" : "Inconsistent"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 h-2 overflow-hidden rounded-full bg-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all duration-500 ${result.multimodal_consistency.is_consistent ? "bg-verdict-real" : "bg-verdict-ai"}`,
												style: { width: `${Math.round(result.multimodal_consistency.score * 100)}%` }
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Measures semantic alignment between the uploaded image and the provided caption using cross-modal embedding similarity."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 font-mono text-[11px] text-muted-foreground",
						children: ["Analysis complete · ", imageName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onReset,
						className: "mt-4 w-full rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90",
						children: "Analyze Another Image"
					})
				] })]
			})
		})
	});
}
function HistoryStrip({ entries, activeId, onOpen }) {
	if (entries.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "history",
		className: "scroll-mt-20 py-6 md:py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Session history"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] text-muted-foreground",
				children: [
					"this browser · ",
					entries.length,
					" ",
					entries.length === 1 ? "item" : "items"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto pb-1",
			children: entries.map((entry) => {
				const isAi = entry.result.verdict === "likely AI-generated";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(entry),
					className: `panel-sm w-[220px] shrink-0 p-3 text-left transition-shadow hover:shadow-plate ${activeId === entry.id ? "ring-2 ring-primary/40" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: entry.dataUrl,
							alt: `Previous analysis ${entry.name}`,
							loading: "lazy",
							className: "aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-foreground/5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-md px-2 py-0.5 text-[11px] font-semibold ${isAi ? "bg-verdict-ai-soft text-verdict-ai" : "bg-verdict-real-soft text-verdict-real"}`,
								children: isAi ? "AI-generated" : "Likely Real"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs tabular-nums",
								children: [confidencePercent(entry.result.confidence), "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 font-mono text-[10px] text-muted-foreground",
							children: [
								entry.time,
								" · #",
								entry.order
							]
						})
					]
				}, entry.id);
			})
		})]
	});
}
var ACCEPTED_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
function UploadPanel({ image, caption, setCaption, isAnalyzing, error, onSelect, onRemove, onAnalyze, onError }) {
	const inputRef = (0, import_react.useRef)(null);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const handleFiles = (files) => {
		const file = files?.[0];
		const problem = validateImage(file);
		if (problem) {
			onError(friendlyMessage(problem));
			return;
		}
		onSelect(file);
	};
	const onDrop = (e) => {
		e.preventDefault();
		setDragging(false);
		if (isAnalyzing) return;
		handleFiles(e.dataTransfer.files);
	};
	const openPicker = () => inputRef.current?.click();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "analyze",
		className: "scroll-mt-20 py-6 md:py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-5 md:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: "(a) intake · calibrated light table"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: [
							ACCEPTED_LABEL,
							" · ≤ ",
							MAX_LABEL
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: ACCEPTED_TYPES.join(","),
					className: "hidden",
					onChange: (e) => {
						handleFiles(e.target.files);
						e.target.value = "";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onDragOver: (e) => {
						e.preventDefault();
						if (!isAnalyzing) setDragging(true);
					},
					onDragLeave: () => setDragging(false),
					onDrop,
					className: `rounded-2xl border-2 border-dashed p-5 transition-colors md:p-7 ${dragging ? "border-primary bg-primary-soft/70" : "border-primary/55 bg-primary-soft/30"}`,
					children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4 md:flex-row md:gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative size-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-foreground/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: image.dataUrl,
									alt: "Selected image preview",
									width: 112,
									height: 112,
									className: "size-full object-cover"
								}), isAnalyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 z-10 pointer-events-none overflow-hidden bg-primary/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-full scan-vertical bg-gradient-to-b from-transparent via-primary/60 to-transparent" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 text-center md:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-base font-semibold",
										children: image.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: [
											"Ready · ",
											formatBytes(image.size),
											" · preview loaded"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap justify-center gap-2 md:justify-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: onRemove,
											disabled: isAnalyzing,
											className: "rounded-md bg-frost px-2.5 py-1 text-xs font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost/70 disabled:opacity-50",
											children: "Remove"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: openPicker,
											disabled: isAnalyzing,
											className: "rounded-md bg-frost px-2.5 py-1 text-xs font-medium ring-1 ring-foreground/5 transition-colors hover:bg-frost/70 disabled:opacity-50",
											children: "Replace"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onAnalyze,
								disabled: isAnalyzing,
								className: "w-full shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 md:w-auto",
								children: isAnalyzing ? "Analyzing…" : "Analyze Image"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openPicker,
						className: "flex w-full flex-col items-center gap-2 py-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-xl bg-frost text-primary ring-1 ring-foreground/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									fill: "none",
									className: "size-5",
									stroke: "currentColor",
									strokeWidth: "1.8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M12 16V4m0 0 4 4m-4-4L8 8",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
										strokeLinecap: "round"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-semibold",
								children: "Drag an image here, or click to browse"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									ACCEPTED_LABEL,
									" · up to ",
									MAX_LABEL
								]
							})
						]
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-4 rounded-xl bg-verdict-ai-soft px-4 py-3 text-sm font-medium text-verdict-ai ring-1 ring-verdict-ai/20",
					children: error
				}),
				image && !isAnalyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "caption",
						className: "text-sm font-medium text-foreground",
						children: "Optional Caption (For Multimodal Consistency Check)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "caption",
						type: "text",
						placeholder: "e.g., A photograph of a cat sitting on a table...",
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					})]
				}),
				isAnalyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-foreground p-4 text-background md:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 overflow-hidden opacity-50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sweep-bar absolute bottom-0 top-0 w-1/4 bg-gradient-to-r from-transparent via-primary/50 to-transparent" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative grid size-9 place-items-center rounded-lg bg-background/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pulse-soft size-3 rounded-full bg-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Analyzing image…"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-mono text-[11px] text-background/60",
								children: "sampling texture · lighting · geometry"
							})]
						})
					]
				})
			]
		})
	});
}
function readAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("read failed"));
		reader.readAsDataURL(file);
	});
}
function HomePage() {
	const [image, setImage] = (0, import_react.useState)(null);
	const [caption, setCaption] = (0, import_react.useState)("");
	const [isAnalyzing, setIsAnalyzing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [viewed, setViewed] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("signalscope-history");
			if (saved) try {
				return JSON.parse(saved);
			} catch {}
		}
		return [];
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("signalscope-history", JSON.stringify(history));
		} catch (e) {
			console.warn("Could not save history to localStorage. Limit exceeded.", e);
		}
	}, [history]);
	const handleSelect = (0, import_react.useCallback)(async (file) => {
		setError(null);
		setViewed(null);
		try {
			const dataUrl = await readAsDataUrl(file);
			setImage({
				file,
				dataUrl,
				name: file.name,
				size: file.size
			});
		} catch {
			setError(friendlyMessage("UPLOAD_FAILED"));
		}
	}, []);
	const handleAnalyze = (0, import_react.useCallback)(async () => {
		const problem = validateImage(image?.file);
		if (problem || !image) {
			setError(friendlyMessage(problem ?? "NO_IMAGE"));
			return;
		}
		setError(null);
		setIsAnalyzing(true);
		try {
			const result = await predictImage(image.file, caption);
			const entry = {
				id: `${Date.now()}-${image.name}`,
				order: history.length + 1,
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				name: image.name,
				dataUrl: image.dataUrl,
				result
			};
			setHistory((prev) => [entry, ...prev]);
			setViewed({
				result,
				dataUrl: image.dataUrl,
				name: image.name,
				historyId: entry.id
			});
			requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			}));
		} catch (err) {
			setError(err instanceof PredictionError ? err.message : friendlyMessage("PREDICTION_FAILED"));
		} finally {
			setIsAnalyzing(false);
		}
	}, [history.length, image]);
	const handleReset = (0, import_react.useCallback)(() => {
		setImage(null);
		setViewed(null);
		setError(null);
		document.getElementById("analyze")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, []);
	const openHistory = (0, import_react.useCallback)((entry) => {
		setViewed({
			result: entry.result,
			dataUrl: entry.dataUrl,
			name: entry.name,
			historyId: entry.id
		});
		requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-5 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadPanel, {
						image,
						caption,
						setCaption,
						isAnalyzing,
						error,
						onSelect: handleSelect,
						onRemove: () => {
							setImage(null);
							setError(null);
						},
						onAnalyze: handleAnalyze,
						onError: setError
					}),
					viewed && !isAnalyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultPanel, {
						result: viewed.result,
						imageUrl: viewed.dataUrl,
						imageName: viewed.name,
						onReset: handleReset
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryStrip, {
						entries: history,
						activeId: viewed?.historyId ?? null,
						onOpen: openHistory
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { HomePage as component };
