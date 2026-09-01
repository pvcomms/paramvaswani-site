import { useState, useEffect, useRef } from "react"

function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ─── Domain data ──────────────────────────────────────────────────────────────
// Circle positions preserved from geometry; labels replaced to reflect actual identity.
// Every domain bleeds into every other — that's the point.

const DOMAINS = [
  {
    id: "mindbody",
    label: "Mind / Body",
    cx: 300, cy: 278, r: 185,
    color: "#c084fc",
    desc: "A nervous system I'm still learning to read. Neurodivergence as signal, not deficit. Interoception, pattern recognition, obsession and compulsion as data. I finally have language for how I'm wired — and it changed everything.",
    relatedEssays: [0, 2, 4, 5],
    relatedProjects: [2],
  },
  {
    id: "tech",
    label: "Technology",
    cx: 540, cy: 278, r: 185,
    color: "#38bdf8",
    desc: "Spent a year speedrunning ML fundamentals and AI safety from first principles — not to serve it, but to understand it and see through it. Power concentrates here. So do the tools to build your way out. Both/and.",
    relatedEssays: [3, 4],
    relatedProjects: [0, 1, 3],
  },
  {
    id: "philosophy",
    label: "Philosophy",
    cx: 420, cy: 472, r: 162,
    color: "#4ade80",
    desc: "Epistemology for its own sake. Truth-seeking not instrumentalised by profit or performance. Using frameworks to evaluate claims, identify my own patterns, and calibrate toward clarity rather than comfort.",
    relatedEssays: [1, 2, 5],
    relatedProjects: [1, 2],
  },
  {
    id: "society",
    label: "Society",
    cx: 180, cy: 416, r: 108,
    color: "#facc15",
    desc: "Social contracts are breaking in real time. Coercive structures leave marks. Raised by the algorithm, shaped by insight. Still noticing the undercurrent — all of it informing how I read power, consent, and collective dynamics.",
    relatedEssays: [3, 5],
    relatedProjects: [],
  },
  {
    id: "creation",
    label: "Creation",
    cx: 672, cy: 414, r: 102,
    color: "#f472b6",
    desc: "Curiosity-guided projects. Novelty and whimsy are legitimate values. There's a sliver of 'fuck the establishment' here, a sliver of 'use the tools to build your own thing.' A foot in the old world, always making.",
    relatedEssays: [4],
    relatedProjects: [0, 1, 3],
  },
]

// Intersection positions verified to sit inside the correct overlap zones.
const INTERSECTIONS = [
  { id: "cogArch",   label: "Cognitive Architecture",  formula: "M ∩ T",     domains: ["mindbody", "tech"],                  cx: 420, cy: 220 },
  { id: "phenom",    label: "Phenomenology",            formula: "M ∩ P",     domains: ["mindbody", "philosophy"],            cx: 332, cy: 415 },
  { id: "align",     label: "AI Alignment",             formula: "T ∩ P",     domains: ["tech", "philosophy"],                cx: 508, cy: 415 },
  { id: "structdif", label: "Structural Difference",    formula: "M ∩ S",     domains: ["mindbody", "society"],               cx: 225, cy: 358 },
  { id: "buildout",  label: "Building Your Way Out",    formula: "T ∩ C",     domains: ["tech", "creation"],                  cx: 626, cy: 354 },
  { id: "center",    label: "Both / And",               formula: "M ∩ T ∩ P", domains: ["mindbody", "tech", "philosophy"],    cx: 420, cy: 342 },
]

// ─── Content data ─────────────────────────────────────────────────────────────

const essays = [
  {
    title: "Life Is a Normal Distribution",
    date: "Aug 2026",
    desc: "Most things cluster. Variance is not failure. On overcorrecting with AI — then course-correcting — and what the bell curve teaches about calibration and the tyranny of optimization.",
    domains: ["philosophy", "tech"],
  },
  {
    title: "The Language of My Nervous System",
    date: "Jun 2026",
    desc: "Getting the vocabulary to describe a neurodivergent experience changed how I inhabit it. On pathology language, interoception, and what it means to finally be able to name how you're wired.",
    domains: ["mindbody", "society"],
  },
  {
    title: "Both/And: Against Forced Coherence",
    date: "Mar 2026",
    desc: "Why do we insist contradictions resolve? On holding tension without collapsing it — the contra as cognitive practice and ethical commitment, not as brand.",
    domains: ["philosophy", "mindbody"],
  },
  {
    title: "What the Algorithm Did to Us",
    date: "Jan 2026",
    desc: "Genetics + environment. The screen as environment. Power concentration, ambient dissociation, and trying to calibrate your attention back to what actually matters — when the infrastructure profits from your distraction.",
    domains: ["tech", "society"],
  },
  {
    title: "Using the Master's Tools (Carefully)",
    date: "Oct 2025",
    desc: "AI to build, AI to understand AI — while remaining fundamentally skeptical of it. On holding contradictory relationships with technologies you depend on and have critiques of simultaneously.",
    domains: ["tech", "philosophy", "creation"],
  },
  {
    title: "Individuality Is Not Performance",
    date: "Jul 2025",
    desc: "Being genuinely individual is harder than performing individuality. What it costs to actually resist legibility — as opposed to styling yourself as someone who resists it.",
    domains: ["mindbody", "society", "philosophy"],
  },
]

const projects = [
  {
    name: "Neuro-Linguistic Mapper",
    stack: ["Python", "PyTorch", "spaCy"],
    desc: "Probes transformer attention heads for syntactic vs. semantic representations — testing whether grammar and meaning are separable in learned models. What it reveals about language models as cognitive mirrors.",
    domains: ["tech", "mindbody", "philosophy"],
    status: "active",
  },
  {
    name: "Belief Calibration Tracker",
    stack: ["Python", "FastAPI", "React"],
    desc: "Personal Brier-score system for logged predictions. Surfaces your calibration curve and identifies domains of systematic overconfidence. Anti-Goodhart's-law by design.",
    domains: ["philosophy", "tech"],
    status: "active",
  },
  {
    name: "Consciousness Ontology Graph",
    stack: ["Python", "NetworkX", "D3.js"],
    desc: "Living knowledge graph of theories of consciousness — IIT, Global Workspace, HOT, Predictive Processing — with relationship types, contradictions, and open questions annotated.",
    domains: ["mindbody", "philosophy", "tech"],
    status: "ongoing",
  },
  {
    name: "Curiosity Ledger",
    stack: ["Obsidian", "Python", "custom CLI"],
    desc: "Personal second brain built on relational notes, not hierarchical folders. Probability trees for working through decisions. Anti-algorithm by architecture: no feeds, no engagement loops.",
    domains: ["tech", "creation", "philosophy"],
    status: "ongoing",
  },
]

const principles = [
  {
    n: "01",
    title: "Uncertainty Is Information",
    body: "Not knowing precisely is data. Holding uncertainty honestly is more rigorous than false confidence. Calibrate toward the truth, not toward comfort.",
  },
  {
    n: "02",
    title: "Both / And Over Either / Or",
    body: "Contradictions can coexist. Forcing resolution often loses more than it gains. The tension between opposing truths is usually where the real information lives.",
  },
  {
    n: "03",
    title: "Question the Frameworks You Question With",
    body: "Every tool for thinking has assumptions baked in. The frameworks I use to evaluate claims need scrutiny too — especially the ones that feel most natural.",
  },
  {
    n: "04",
    title: "Human Taste and Judgment Win",
    body: "Against optimisation for its own sake. Against flattening individuality to legibility. Genuine discernment, developed over time, beats any algorithm. Including this one.",
  },
  {
    n: "05",
    title: "Kindness and Epistemic Humility Compound",
    body: "Being kind to people while being rigorous about claims are not in tension. Both are possible. Neither compromises the other.",
  },
]

const thoughts = [
  {
    date: "Aug 31, 2026",
    tag: "Both / And",
    body: "I overcorrected with AI — every hour planned, every note processed, every decision routed through a model. Then I corrected. Now I'm figuring out the actual right relationship. It keeps shifting. That's probably the honest answer.",
  },
  {
    date: "Aug 18, 2026",
    tag: "Neurodivergence",
    body: "Getting the language of pathology wasn't about pathologising myself — it was finally having words for things I'd already been living. The vocabulary preceded the clarity. Now I can describe my nervous system to myself.",
  },
  {
    date: "Aug 5, 2026",
    tag: "Power / Tech",
    body: "The algorithm gave me language, community, intellectual access. It also flattened things, extracted attention, made ambient dissociation feel normal. Genetics + environment. It's the environment we built together and didn't consent to.",
  },
  {
    date: "Jul 19, 2026",
    tag: "Epistemics",
    body: "The normal distribution keeps coming up as the right metaphor for how I think about everything. Life isn't optimisation toward a maximum — it's variance around a mean. Calibrate for the tails. Expect them.",
  },
]

const nuance = [
  {
    label: "Create",
    body: "Making is thinking. The constraint of output forces precision that reading, talking, and planning together never quite require — even when what you make is imperfect.",
  },
  {
    label: "Consume",
    body: "Reading widely is not enough without frameworks for evaluation. The goal is models that generate new predictions, not a larger pile of interesting things you once encountered.",
  },
  {
    label: "Curate",
    body: "Attention is the real resource. Your information diet shapes the prior you bring to everything else. Choosing what to not attend to matters as much as what you do.",
  },
  {
    label: "Coherence",
    body: "The views should fit together — or the contradictions should be named. Invisible incoherence is intellectual rot. Visible contradiction is sometimes just intellectual honesty.",
  },
]

// ─── Interactive: Normal Distribution ─────────────────────────────────────────

type CurveRegion = "left" | "center" | "right" | null

function NormalCurve() {
  const [hov, setHov] = useState<CurveRegion>(null)

  const curve = "M 10,148 C 60,148 130,18 200,18 C 270,18 340,148 390,148"
  const fill  = `${curve} Z`

  const labels: Record<NonNullable<CurveRegion>, string> = {
    left:   "the unexpected · rare events · calibrate for tails",
    center: "where most things cluster · base rates matter · the probable",
    right:  "the unexpected · rare events · calibrate for tails",
  }

  const regionColor = hov === "center" ? "#4ade80" : "#c084fc"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <svg viewBox="0 0 400 165" style={{ width: "100%", display: "block", overflow: "visible" }}>
        <defs>
          <clipPath id="nc-l"><rect x="0"   y="0" width="115" height="165"/></clipPath>
          <clipPath id="nc-c"><rect x="115" y="0" width="170" height="165"/></clipPath>
          <clipPath id="nc-r"><rect x="285" y="0" width="115" height="165"/></clipPath>
        </defs>

        {/* Filled regions, clipped */}
        {(["left", "center", "right"] as const).map(r => (
          <path
            key={r}
            d={fill}
            fill={r === "center" ? "#4ade80" : "#c084fc"}
            fillOpacity={hov === r ? 0.18 : 0.04}
            clipPath={`url(#nc-${r[0]})`}
            style={{ transition: "fill-opacity 0.22s", pointerEvents: "none" }}
          />
        ))}

        {/* Baseline */}
        <line x1="10" y1="150" x2="390" y2="150" stroke="#3a3852" strokeWidth="1"/>

        {/* σ dividers */}
        <line x1="115" y1="22" x2="115" y2="150" stroke="#4a4860" strokeWidth="0.8" strokeDasharray="3 4"/>
        <line x1="285" y1="22" x2="285" y2="150" stroke="#4a4860" strokeWidth="0.8" strokeDasharray="3 4"/>

        {/* Mean line */}
        <line x1="200" y1="18" x2="200" y2="150" stroke="#4ade80" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="2 5"/>

        {/* Curve stroke */}
        <path d={curve} fill="none" stroke={regionColor} strokeWidth="1.5"
          strokeOpacity={hov ? 0.9 : 0.55}
          style={{ transition: "stroke-opacity 0.22s, stroke 0.22s" }}/>

        {/* Annotations */}
        <text x="200" y="160" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em" opacity="0.7">μ</text>
        <text x="115" y="160" textAnchor="middle" fill="#6a6480" fontSize="7.5" fontFamily="JetBrains Mono, monospace">−1σ</text>
        <text x="285" y="160" textAnchor="middle" fill="#6a6480" fontSize="7.5" fontFamily="JetBrains Mono, monospace">+1σ</text>

        {/* Hover targets */}
        <rect x="0"   y="0" width="115" height="165" fill="transparent" style={{ cursor: "default" }}
          onMouseEnter={() => setHov("left")}  onMouseLeave={() => setHov(null)}/>
        <rect x="115" y="0" width="170" height="165" fill="transparent" style={{ cursor: "default" }}
          onMouseEnter={() => setHov("center")} onMouseLeave={() => setHov(null)}/>
        <rect x="285" y="0" width="115" height="165" fill="transparent" style={{ cursor: "default" }}
          onMouseEnter={() => setHov("right")} onMouseLeave={() => setHov(null)}/>
      </svg>

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, color: regionColor,
        letterSpacing: "0.07em", minHeight: 14,
        opacity: hov ? 0.85 : 0,
        transition: "opacity 0.2s, color 0.22s",
      }}>
        {hov ? labels[hov] : ""}
      </p>
    </div>
  )
}

// ─── Interactive: Probability Decision Tree ───────────────────────────────────

interface TreeNode {
  id: string
  x: number
  y: number
  r: number
  label: string
  color: string
  desc: string
  failure?: string
  value?: number   // epistemic value 0–5
  caution?: string // base-rate note
}

interface TreeEdge {
  from: string
  to: string
  label: string
  prob: string
  note: string
}

// Paths from root to each leaf (for highlight)
const PATHS: Record<string, string[]> = {
  l2a: ["root", "l1a", "l2a"],
  l2b: ["root", "l1a", "l2b"],
  l2c: ["root", "l1b", "l2c"],
  l2d: ["root", "l1b", "l2d"],
}

const TREE_NODES: TreeNode[] = [
  {
    id: "root", x: 190, y: 22, r: 17,
    label: "encounter",
    color: "#7eb8d4",
    desc: "A new claim, idea, model, or piece of evidence enters your field. The epistemic moment before you've done anything with it.",
    caution: "Most errors happen here — in the half-second before you've actually looked.",
  },
  {
    id: "l1a", x: 90, y: 96, r: 13,
    label: "seems to fit",
    color: "#4ade80",
    desc: "Creates apparent coherence. Feels consistent with what you already hold. This feeling is real but not reliable — it's also what confirmation bias feels like.",
    caution: "~70% of encounters land here. Most are not tested.",
  },
  {
    id: "l1b", x: 290, y: 96, r: 13,
    label: "seems to conflict",
    color: "#f472b6",
    desc: "Creates friction. Inconsistent with your current model or values. Friction is information — don't resolve it prematurely.",
    caution: "~30% of encounters. Discomfort biases toward dismissal.",
  },
  {
    id: "l2a", x: 32, y: 178, r: 10,
    label: "integrate",
    color: "#4ade80",
    desc: "You've tested it. The evidence independently holds. Incorporate with proportional confidence — not certainty.",
    failure: "Integrating without actually testing. Confidence not earned. This looks identical to good integration from the outside.",
    value: 4,
  },
  {
    id: "l2b", x: 148, y: 178, r: 10,
    label: "interrogate",
    color: "#facc15",
    desc: "The default move when something seems to fit. Pause before integrating. Ask what would falsify this. Check if you'd accept the same evidence if it conflicted.",
    failure: "Skipping this step entirely. Moving straight to integrate because it felt right.",
    value: 5,
  },
  {
    id: "l2c", x: 232, y: 178, r: 10,
    label: "update",
    color: "#c084fc",
    desc: "Your prior was actually wrong. The new model is better. Update proportionally — not fully, not zero. This is the highest-value outcome in the tree.",
    failure: "Overcorrecting. Swinging entirely to the new view. Or — more common — finding a reason not to update at all.",
    value: 5,
  },
  {
    id: "l2d", x: 348, y: 178, r: 10,
    label: "flag & sit",
    color: "#f472b6",
    desc: "The conflict is about values, not evidence. There's no factual resolution available. Name it clearly. Don't suppress it or force false resolution.",
    failure: "Treating a values clash as an epistemic one and trying to argue your way through it. Or quietly suppressing it.",
    value: 4,
  },
]

const TREE_EDGES: TreeEdge[] = [
  { from: "root", to: "l1a", label: "fits",      prob: "~70%", note: "apparent coherence" },
  { from: "root", to: "l1b", label: "conflicts", prob: "~30%", note: "friction as signal" },
  { from: "l1a",  to: "l2a", label: "tested",    prob: "~25%", note: "evidence independently holds" },
  { from: "l1a",  to: "l2b", label: "default",   prob: "~75%", note: "interrogate before integrating" },
  { from: "l1b",  to: "l2c", label: "epistemic", prob: "~40%", note: "prior was wrong" },
  { from: "l1b",  to: "l2d", label: "values",    prob: "~60%", note: "not a factual gap" },
]

const VALUE_LABELS = ["", "low", "moderate", "meaningful", "high", "critical"]

function DecisionTree() {
  const [selNode, setSelNode] = useState<string | null>(null)
  const [hovNode, setHovNode] = useState<string | null>(null)

  const nodeMap = Object.fromEntries(TREE_NODES.map(n => [n.id, n]))
  const focusId  = hovNode ?? selNode
  const activePath = focusId && PATHS[focusId] ? PATHS[focusId] : (focusId ? [focusId] : [])

  const edgeActive = (e: TreeEdge) =>
    activePath.includes(e.from) && activePath.includes(e.to)

  const nodeActive = (id: string) => activePath.includes(id)

  const data = focusId ? nodeMap[focusId] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <svg viewBox="0 0 380 205" style={{ width: "100%", display: "block", overflow: "visible" }}>
        {/* Edges */}
        {TREE_EDGES.map((e, i) => {
          const from  = nodeMap[e.from]
          const to    = nodeMap[e.to]
          const lit   = edgeActive(e)
          const midX  = (from.x + to.x) / 2
          const midY  = (from.y + to.y) / 2 - 3
          const isLeft = to.x < from.x

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y + from.r + 1}
                x2={to.x}   y2={to.y - to.r - 1}
                stroke={lit ? (nodeMap[to.id].color) : "#4a4860"}
                strokeWidth={lit ? 1.6 : 0.9}
                strokeOpacity={lit ? 0.85 : (focusId ? 0.2 : 0.55)}
                style={{ transition: "stroke-opacity 0.22s, stroke-width 0.22s, stroke 0.22s" }}
              />
              {/* edge label */}
              <text
                x={midX + (isLeft ? -6 : 6)} y={midY}
                fill={lit ? "#9a94b0" : "#4a4860"}
                fillOpacity={focusId ? (lit ? 1 : 0.2) : 0.8}
                fontSize="6" fontFamily="JetBrains Mono, monospace"
                textAnchor={isLeft ? "end" : "start"}
                style={{ transition: "fill-opacity 0.22s", userSelect: "none", pointerEvents: "none" }}
              >
                {e.label}
              </text>
              {/* prob */}
              <text
                x={midX + (isLeft ? -6 : 6)} y={midY + 8}
                fill={lit ? nodeMap[to.id].color : "#352f4a"}
                fillOpacity={focusId ? (lit ? 0.9 : 0.1) : 0.55}
                fontSize="5.5" fontFamily="JetBrains Mono, monospace"
                textAnchor={isLeft ? "end" : "start"}
                style={{ transition: "fill-opacity 0.22s", userSelect: "none", pointerEvents: "none" }}
              >
                {e.prob}
              </text>
            </g>
          )
        })}

        {/* Nodes */}
        {TREE_NODES.map(n => {
          const isActive = nodeActive(n.id)
          const isSel    = selNode === n.id
          const dimmed   = !!focusId && !isActive

          return (
            <g key={n.id}
              onMouseEnter={() => setHovNode(n.id)}
              onMouseLeave={() => setHovNode(null)}
              onClick={() => setSelNode(s => s === n.id ? null : n.id)}
              style={{ cursor: "pointer" }}>
              {/* outer ring when selected */}
              {isSel && (
                <circle cx={n.x} cy={n.y} r={n.r + 6}
                  fill="none" stroke={n.color} strokeWidth="0.6"
                  strokeOpacity="0.3" strokeDasharray="3 4"
                  style={{ pointerEvents: "none" }}/>
              )}
              <circle
                cx={n.x} cy={n.y} r={n.r + (isActive ? 1.5 : 0)}
                fill={n.color}
                fillOpacity={isActive ? 0.22 : (dimmed ? 0.03 : 0.07)}
                stroke={n.color}
                strokeWidth={isActive ? 1.6 : 1}
                strokeOpacity={isActive ? 1 : (dimmed ? 0.15 : 0.4)}
                style={{ transition: "all 0.22s" }}
              />
              <text
                x={n.x} y={n.y + 0.5}
                textAnchor="middle" dominantBaseline="middle"
                fill={n.color}
                fillOpacity={isActive ? 1 : (dimmed ? 0.2 : 0.6)}
                fontSize={n.id === "root" ? "7.5" : "6.5"}
                fontFamily="JetBrains Mono, monospace"
                style={{ transition: "fill-opacity 0.22s", pointerEvents: "none", userSelect: "none" }}
              >
                {n.label}
              </text>
              {/* value dots for leaf nodes */}
              {n.value !== undefined && (
                <g style={{ pointerEvents: "none" }}>
                  {[1,2,3,4,5].map(v => (
                    <circle key={v}
                      cx={n.x - 10 + (v - 1) * 5} cy={n.y + n.r + 6}
                      r={1.5}
                      fill={n.color}
                      fillOpacity={v <= n.value! ? (isActive ? 0.9 : 0.35) : 0.08}
                      style={{ transition: "fill-opacity 0.22s" }}
                    />
                  ))}
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Rich panel */}
      <div style={{
        minHeight: 96,
        marginTop: 8,
        paddingLeft: 14,
        borderLeft: `2px solid ${data?.color ?? "#1a1828"}`,
        opacity: data ? 1 : 0,
        transition: "opacity 0.25s, border-color 0.22s",
      }}>
        {data && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: data.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {data.label}
              </span>
              {data.value !== undefined && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, color: "#4a4860", letterSpacing: "0.08em" }}>
                  epistemic value · {VALUE_LABELS[data.value]}
                </span>
              )}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, lineHeight: 1.7, color: "#7a7490", marginBottom: data.failure ? 10 : 0 }}>
              {data.desc}
            </p>
            {data.failure && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, lineHeight: 1.65, color: "#4a3a52", borderLeft: "1px solid #2a2040", paddingLeft: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#f472b640", letterSpacing: "0.1em" }}>failure mode · </span>
                {data.failure}
              </p>
            )}
            {data.caution && (
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#352f4a", letterSpacing: "0.06em", marginTop: 8 }}>
                {data.caution}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Interactive: Venn Diagram ────────────────────────────────────────────────

function VennDiagram({
  activeDomain,
  setActiveDomain,
}: {
  activeDomain: string | null
  setActiveDomain: (id: string | null) => void
}) {
  const [hovDomain, setHovDomain] = useState<string | null>(null)
  const [hovInter, setHovInter] = useState<string | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 120)
    return () => clearTimeout(t)
  }, [])

  const effDomain = hovInter ? null : (hovDomain ?? activeDomain)

  const circleOpacity = (id: string) => {
    if (hovInter) {
      const inter = INTERSECTIONS.find(i => i.id === hovInter)
      return inter?.domains.includes(id) ? 1 : 0.12
    }
    if (effDomain) return effDomain === id ? 1 : 0.12
    return 0.72
  }

  const interOpacity = (inter: typeof INTERSECTIONS[0]) => {
    if (hovInter === inter.id) return 1
    if (hovInter) return 0.3
    if (effDomain && inter.domains.includes(effDomain)) return 1
    if (effDomain) return 0.35
    return 0.65
  }

  const hoverDomainData = effDomain ? DOMAINS.find(d => d.id === effDomain) ?? null : null
  const hoverInterData  = hovInter  ? INTERSECTIONS.find(i => i.id === hovInter) ?? null : null
  const showPanel       = !!(hoverDomainData || hoverInterData)

  return (
    <div className="hero-venn" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <svg
        viewBox="0 0 840 660"
        style={{ width: "100%", display: "block" }}
        aria-label="Set theory diagram: bidirectional influences between Mind/Body, Technology, Philosophy, Society, and Creation"
      >
        <defs>
          {DOMAINS.map(d => (
            <filter key={d.id} id={`gw-${d.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          ))}
        </defs>

        {DOMAINS.map((d, i) => {
          const circ  = 2 * Math.PI * d.r
          const op    = circleOpacity(d.id)
          const isLit = op === 1
          const isSel = activeDomain === d.id && !hovDomain && !hovInter

          return (
            <g key={d.id} className={`venn-g-${i}`}>
              {/* subtle fill tint — makes overlaps visible */}
              <circle cx={d.cx} cy={d.cy} r={d.r}
                fill={d.color} fillOpacity={isLit ? 0.055 : 0.01}
                style={{ transition: "fill-opacity 0.3s", pointerEvents: "none" }}/>

              {/* animated stroke */}
              <circle cx={d.cx} cy={d.cy} r={d.r}
                fill="none" stroke={d.color}
                strokeWidth={isLit ? 2.8 : 1.8}
                strokeOpacity={op}
                filter={isLit ? `url(#gw-${d.id})` : undefined}
                strokeDasharray={circ}
                strokeDashoffset={drawn ? 0 : circ}
                style={{
                  transition: [
                    `stroke-dashoffset 2.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.28}s`,
                    "stroke-opacity 0.3s",
                    "stroke-width 0.22s",
                  ].join(", "),
                  pointerEvents: "none",
                }}/>

              {/* dashed halo when this domain is the active filter */}
              {isSel && (
                <circle cx={d.cx} cy={d.cy} r={d.r + 9}
                  fill="none" stroke={d.color}
                  strokeWidth={0.6} strokeOpacity={0.28}
                  strokeDasharray="4 6"
                  style={{ pointerEvents: "none" }}/>
              )}

              {/* wide transparent hit area */}
              <circle cx={d.cx} cy={d.cy} r={d.r}
                fill="none" stroke="transparent" strokeWidth={34}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovDomain(d.id)}
                onMouseLeave={() => setHovDomain(null)}
                onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}/>

              {/* domain label */}
              <text x={d.cx} y={d.cy - d.r - 13}
                textAnchor="middle"
                fill={d.color} fillOpacity={op}
                fontSize="9.5" fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.11em"
                style={{ transition: "fill-opacity 0.3s", pointerEvents: "none", userSelect: "none" }}>
                {d.label.toUpperCase()}
              </text>
            </g>
          )
        })}

        {/* Intersection zones */}
        {INTERSECTIONS.map(inter => {
          const op       = interOpacity(inter)
          const isCenter = inter.id === "center"
          const isHov    = hovInter === inter.id

          return (
            <g key={inter.id}>
              <circle cx={inter.cx} cy={inter.cy}
                r={isCenter ? 28 : 20}
                fill="transparent" style={{ cursor: "crosshair" }}
                onMouseEnter={() => setHovInter(inter.id)}
                onMouseLeave={() => setHovInter(null)}/>

              {/* marker */}
              {isCenter ? (
                <circle cx={inter.cx} cy={inter.cy}
                  r={isHov ? 6 : 3.5}
                  fill="#ffffff" fillOpacity={op}
                  className={isHov ? undefined : "center-dot"}
                  style={{ transition: "fill-opacity 0.22s", pointerEvents: "none" }}/>
              ) : (
                <circle cx={inter.cx} cy={inter.cy}
                  r={1.8} fill="#4a4860" fillOpacity={op * 0.7}
                  style={{ transition: "fill-opacity 0.22s", pointerEvents: "none" }}/>
              )}

              {/* label */}
              <text x={inter.cx} y={inter.cy + (isCenter ? 18 : 13)}
                textAnchor="middle"
                fill={isCenter ? "#e2ddd6" : "#a09ab8"}
                fillOpacity={op}
                fontSize={isCenter ? "9" : "8"}
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.05em"
                style={{ transition: "fill-opacity 0.22s", pointerEvents: "none", userSelect: "none" }}>
                {inter.label}
              </text>

              {/* formula */}
              {!isCenter && (
                <text x={inter.cx} y={inter.cy + 23}
                  textAnchor="middle"
                  fill="#6a6480" fillOpacity={op * 0.9}
                  fontSize="7" fontFamily="JetBrains Mono, monospace"
                  style={{ transition: "fill-opacity 0.22s", pointerEvents: "none", userSelect: "none" }}>
                  {inter.formula}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Info panel */}
      <div style={{
        minHeight: 82,
        paddingLeft: 16,
        borderLeft: `2px solid ${hoverInterData ? "#4a4860" : (hoverDomainData?.color ?? "#1a1828")}`,
        opacity: showPanel ? 1 : 0,
        transition: "opacity 0.28s, border-color 0.28s",
      }}>
        {hoverInterData ? (
          <>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3a3852", letterSpacing: "0.12em", marginBottom: 6 }}>
              {hoverInterData.formula}
              <span style={{ marginLeft: 10, color: "#252338" }}>
                {hoverInterData.domains.map(id => DOMAINS.find(d => d.id === id)?.label).join(" · ")}
              </span>
            </p>
            <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 20, color: "#ddd8d0", fontWeight: 400 }}>
              {hoverInterData.label}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#3a3852", marginTop: 4 }}>
              these domains feed into each other bidirectionally — always have
            </p>
          </>
        ) : hoverDomainData ? (
          <>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: hoverDomainData.color, letterSpacing: "0.12em", marginBottom: 6, opacity: 0.85 }}>
              {hoverDomainData.label.toUpperCase()}
              <span style={{ color: "#3a3852" }}>
                {activeDomain === hoverDomainData.id && !hovDomain ? " · click to deselect" : " · click to filter"}
              </span>
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.68, color: "#524e68", maxWidth: 480 }}>
              {hoverDomainData.desc}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links: [string, string][] = [
    ["Writing",         "#writing"],
    ["Projects",        "#projects"],
    ["Principles",      "#principles"],
    ["Current Thoughts","#thoughts"],
  ]

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      backgroundColor: scrolled ? "rgba(8,8,16,0.96)" : "rgba(8,8,16,0.6)",
      borderBottom: "1px solid rgba(26,24,40,0.9)",
      transition: "background-color 0.35s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 36px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, color: "#ddd8d0", textDecoration: "none" }}>
          Your Name
        </a>

        <div className="hidden md:flex" style={{ gap: 40 }}>
          {links.map(([label, href]) => (
            <a key={href} href={href}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, letterSpacing: "0.025em", color: "#5a5472", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#bab6c8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5a5472")}>
              {label}
            </a>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "none", color: "#5a5472", cursor: "pointer", padding: 4 }}
          aria-label="Toggle menu">
          <svg width="18" height="14" stroke="currentColor" strokeWidth="1.4" fill="none">
            {open
              ? <><line x1="2" y1="2" x2="16" y2="12"/><line x1="16" y1="2" x2="2" y2="12"/></>
              : <><line x1="0" y1="2" x2="18" y2="2"/><line x1="0" y1="7" x2="18" y2="7"/><line x1="0" y1="12" x2="18" y2="12"/></>}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid #1a1828", padding: "14px 36px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#5a5472", textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHead({
  label,
  filter,
  onClearFilter,
}: {
  label: string
  filter?: { name: string; color: string } | null
  onClearFilter?: () => void
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1828", paddingBottom: 10, marginBottom: 38 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.24em", color: "#302e44", textTransform: "uppercase" }}>
        {label}
      </span>
      {filter && (
        <button onClick={onClearFilter}
          style={{ background: "none", border: "1px solid #252338", padding: "2px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.07em", color: filter.color }}>
          {filter.name}
          <span style={{ color: "#4a4860", fontSize: 12, lineHeight: 1 }}>×</span>
        </button>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null)
  const [heroIn, setHeroIn] = useState(false)
  const revWriting    = useReveal()
  const revProjects   = useReveal()
  const revPrinciples = useReveal()
  const revThoughts   = useReveal()
  const revMaps       = useReveal()
  const revNuance     = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 300)
    return () => clearTimeout(t)
  }, [])

  const activeData = DOMAINS.find(d => d.id === activeDomain) ?? null

  return (
    <div style={{ backgroundColor: "#080810", minHeight: "100vh" }}>
      {/* Thin viewport frame — quiet nod to Eileenie's border */}
      <div style={{ position: "fixed", inset: 5, zIndex: 9999, pointerEvents: "none", border: "1px solid rgba(192,132,252,0.09)" }}/>

      <Nav/>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-grid">
        {/* Left: identity */}
        <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? "none" : "translateY(16px)", transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s" }}>

          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(38px, 5vw, 68px)",
            lineHeight: 1.08, fontWeight: 400,
            letterSpacing: "-0.015em",
            color: "#ddd8d0", marginBottom: 18,
          }}>
            everything<br/>
            connects.<br/>
            <em style={{ color: "#c084fc", fontStyle: "italic" }}>nothing</em><br/>
            is cleanly<br/>
            bounded.
          </h1>

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: "#252338", marginBottom: 26, textTransform: "lowercase" }}>
            neurodivergent · epistemologist · contra · builder
          </p>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.8, color: "#5a5472", maxWidth: 360, marginBottom: 36 }}>
            I think about minds — biological and artificial — and the systems built around them.
            About what it means to seek truth without instrumentalising it,
            and to hold contradictions without forcing them to resolve.
          </p>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <a href="#writing"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.1em", color: "#7eb8d4", textDecoration: "none", borderBottom: "1px solid rgba(126,184,212,0.28)", paddingBottom: 2, transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#a8d4e8"; e.currentTarget.style.borderColor = "rgba(168,212,232,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#7eb8d4"; e.currentTarget.style.borderColor = "rgba(126,184,212,0.28)" }}>
              read essays →
            </a>
            <a href="#maps"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.1em", color: "#4a4860", textDecoration: "none", borderBottom: "1px solid #252338", paddingBottom: 2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7a7490")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4a4860")}>
              three maps →
            </a>
          </div>

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#201e30", letterSpacing: "0.1em", marginTop: 44 }}>
            ↑ hover the diagram · hover intersections · click a circle to filter
          </p>
        </div>

        {/* Right: Venn */}
        <VennDiagram activeDomain={activeDomain} setActiveDomain={setActiveDomain}/>
      </section>

      {/* ── Content column ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px 140px" }}>

        {/* Writing */}
        <section id="writing" ref={revWriting} className="reveal" style={{ paddingTop: 108, marginBottom: 108 }}>
          <SectionHead
            label="Writing"
            filter={activeData ? { name: activeData.label, color: activeData.color } : null}
            onClearFilter={() => setActiveDomain(null)}
          />
          {essays.map((e, i) => {
            const active = !activeDomain || e.domains.includes(activeDomain)
            return (
              <div key={i} className="card-row" style={{ padding: "19px 0", borderBottom: "1px solid #1a1828", opacity: active ? 1 : 0.16, transition: "opacity 0.38s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17.5, color: "#7eb8d4", fontWeight: 400 }}>
                    {e.title}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#252338", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {e.date}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#4e4a64" }}>
                  {e.desc}
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 9, flexWrap: "wrap" }}>
                  {e.domains.map(id => {
                    const d = DOMAINS.find(x => x.id === id)
                    return (
                      <span key={id} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: d?.color ?? "#4a4860", opacity: 0.4, letterSpacing: "0.05em" }}>
                        {d?.label ?? id}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        {/* Projects */}
        <section id="projects" ref={revProjects} className="reveal" style={{ marginBottom: 108 }}>
          <SectionHead
            label="Curiosity Projects"
            filter={activeData ? { name: activeData.label, color: activeData.color } : null}
            onClearFilter={() => setActiveDomain(null)}
          />
          {projects.map((p, i) => {
            const active = !activeDomain || p.domains.includes(activeDomain)
            return (
              <div key={i} className="card-row" style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "0 22px", padding: "20px 0", borderBottom: "1px solid #1a1828", opacity: active ? 1 : 0.16, transition: "opacity 0.38s", alignItems: "start" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#201e30", paddingTop: 4 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17.5, color: "#d8d4cc", fontWeight: 400 }}>
                      {p.name}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#252338", letterSpacing: "0.07em" }}>
                      {p.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 9, flexWrap: "wrap" }}>
                    {p.stack.map(s => (
                      <span key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3a3852", border: "1px solid #1a1828", padding: "1.5px 8px", letterSpacing: "0.05em" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#4e4a64" }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </section>

        {/* Principles */}
        <section id="principles" ref={revPrinciples} className="reveal" style={{ marginBottom: 108 }}>
          <SectionHead label="Principles"/>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {principles.map(p => (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "0 24px", alignItems: "start" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#201e30", paddingTop: 4 }}>
                  {p.n}
                </span>
                <div>
                  <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18.5, color: "#d8d4cc", fontWeight: 400, marginBottom: 9 }}>
                    {p.title}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.74, color: "#4e4a64" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Thoughts */}
        <section id="thoughts" ref={revThoughts} className="reveal" style={{ marginBottom: 108 }}>
          <SectionHead label="Current Thoughts"/>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {thoughts.map((t, i) => (
              <div key={i} style={{ paddingLeft: 22, borderLeft: "1px solid #1a1828", position: "relative" }}>
                <div className="thought-dot" style={{ position: "absolute", left: -4.5, top: 7, width: 8, height: 8, borderRadius: "50%", border: "1px solid rgba(192,132,252,0.4)", backgroundColor: "#080810" }}/>
                <div style={{ display: "flex", gap: 14, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#252338", letterSpacing: "0.08em" }}>
                    {t.date}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "rgba(126,184,212,0.38)", border: "1px solid rgba(126,184,212,0.13)", padding: "1.5px 9px", letterSpacing: "0.09em" }}>
                    {t.tag}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.8, color: "#5a5472" }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Three Maps */}
        <section id="maps" ref={revMaps} className="reveal" style={{ marginBottom: 108 }}>
          <SectionHead label="Three Maps"/>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.78, color: "#4e4a64", marginBottom: 40 }}>
            Three visual metaphors I keep returning to.
            The third one is the diagram at the top of this page — nothing you encounter exists in isolation,
            and the influences are always bidirectional.
          </p>

          <div className="maps-grid">
            {/* Normal Distribution */}
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#4ade8080", textTransform: "uppercase", marginBottom: 16 }}>
                Normal Distribution
              </p>
              <NormalCurve/>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.72, color: "#4e4a64", marginTop: 12 }}>
                Life clusters around a mean. Variance is the structure of things, not an error in your model.
                I overcorrected with AI — micromanaging every decision, processing every note.
                Then I found the distribution. Now I calibrate.
              </p>
            </div>

            {/* Decision Tree */}
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7eb8d480", textTransform: "uppercase", marginBottom: 16 }}>
                Probability Tree
              </p>
              <DecisionTree/>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.72, color: "#4e4a64", marginTop: 12 }}>
                Every belief is conditional on something. Following the branches honestly —
                updating when wrong, holding open when uncertain — matters more than
                arriving at the "correct" conclusion quickly.
              </p>
            </div>
          </div>
        </section>

        {/* Big Nuance */}
        <section ref={revNuance} className="reveal" style={{ marginBottom: 108 }}>
          <SectionHead label="Big Nuance"/>
          <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#d8d4cc", fontWeight: 400, lineHeight: 1.3, marginBottom: 36, letterSpacing: "-0.01em" }}>
            Create, Consume,<br/>Curate, Coherence
          </p>
          <div className="nuance-grid">
            {nuance.map((item, i) => (
              <div key={i} style={{ padding: "28px 24px", borderRight: i % 2 === 0 ? "1px solid #1a1828" : "none", borderBottom: i < 2 ? "1px solid #1a1828" : "none" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", color: "#c084fc", textTransform: "uppercase", marginBottom: 12, opacity: 0.7 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.74, color: "#4e4a64" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ paddingTop: 40, borderTop: "1px solid #1a1828", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#201e30", letterSpacing: "0.07em" }}>
            © 2026
          </span>
          <div style={{ display: "flex", gap: 28 }}>
            {(["email", "github"] as const).map(s => (
              <a key={s} href="#"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#252338", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#6a6480")}
                onMouseLeave={e => (e.currentTarget.style.color = "#252338")}>
                {s}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
