/** @typedef {{ id: string, label: string, description: string }} Service */

/** @type {Service[]} */
export const services = [
  {
    id: "ai-ml",
    label: "AI / ML",
    description:
      "We design and ship models, fine-tuning workflows, and evaluation harnesses that match your data and risk profile. Our teams bridge research and production so you move from experiment to stable APIs without surprises. Engagement spans architecture reviews through hands-on implementation.",
  },
  {
    id: "software-dev",
    label: "Software Development",
    description:
      "End-to-end engineering for backends, services, and integrations with an emphasis on clarity and long-term maintainability. We align on interfaces, testing strategy, and delivery cadence early so releases stay predictable. Stacks are chosen to fit your team—not the other way around.",
  },
  {
    id: "mobile",
    label: "Mobile App Development",
    description:
      "Native and cross-platform apps with performance, accessibility, and release pipelines treated as first-class concerns. We plan offline behavior, push, and analytics hooks where they matter for your product. Design systems and shared modules keep iOS and Android coherent.",
  },
  {
    id: "qa",
    label: "Quality Assurance",
    description:
      "Test strategy layered from unit and contract checks through exploratory passes and automated regression suites. We instrument CI so failures are fast, isolated, and actionable. Quality gates scale with your release frequency.",
  },
  {
    id: "digital-tx",
    label: "Digital Transformation",
    description:
      "Roadmaps that connect legacy operations to modern platforms without stopping the business. We prioritize quick wins alongside foundational changes in data and identity. Change management and training are part of the delivery, not an afterthought.",
  },
  {
    id: "web-app",
    label: "Web App Development",
    description:
      "SPAs, SSR, and edge-friendly frontends with attention to Core Web Vitals and security headers. API design and caching policies are co-developed with your backend constraints. We ship incremental milestones you can validate with real users.",
  },
  {
    id: "legacy",
    label: "Legacy System Modernization",
    description:
      "Strangler patterns, bounded contexts, and careful data migration to retire risk without big-bang cutovers. We document behavior, add seams for testing, and replace hot paths first. Downtime windows and rollback paths are explicit in the plan.",
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    description:
      "Infrastructure as code, observability, and environments that mirror production closely enough to trust. We tune autoscaling, secrets handling, and cost visibility for your workloads. On-call runbooks and incident drills close the loop.",
  },
  {
    id: "rpa",
    label: "Robotic Process Automation",
    description:
      "Automate repetitive workflows with guardrails, logging, and human-in-the-loop exits where judgment is required. Bots are versioned, monitored, and owned like any other service. We start from process maps and failure modes, not tool hype.",
  },
  {
    id: "iot",
    label: "IoT Solutions",
    description:
      "Device firmware, gateways, and cloud ingestion pipelines designed for intermittent connectivity and secure updates. We model telemetry schemas and device identity early to avoid rework at scale. Field diagnostics and OTA strategy are included.",
  },
  {
    id: "startup",
    label: "Startup Consulting",
    description:
      "Technical due diligence, MVP scoping, and hiring rubrics for founding teams under time pressure. We help you choose boring technology where it counts and invest novelty only in your differentiator. Investor-ready architecture narratives are part of the package.",
  },
  {
    id: "product-eng",
    label: "Product Engineering",
    description:
      "Cross-functional delivery that ties discovery, metrics, and engineering milestones into one rhythm. We embed with product and design to cut scope intelligently and ship learning loops. Ownership extends through launch and iteration.",
  },
  {
    id: "infra-sec",
    label: "IT Infrastructure & Cybersecurity",
    description:
      "Hardened networks, endpoint posture, and zero-trust patterns appropriate to your threat model. We map assets, patch cadence, and access policies to standards you actually enforce. Tabletop exercises validate playbooks before incidents happen.",
  },
  {
    id: "data-science",
    label: "Data Science & Analytics",
    description:
      "From exploratory analysis to dashboards and statistical models that stakeholders can interpret and trust. We document data lineage and assumptions so results stay reproducible. When ML enters, we connect experiments to serving and monitoring.",
  },
  {
    id: "bpo",
    label: "Business Process Optimization",
    description:
      "Map value streams, remove bottlenecks, and align tooling so teams spend time on outcomes—not handoffs. Metrics and SLAs are defined with owners and review cadences. Automation proposals follow only after the process is understood.",
  },
  {
    id: "emerging",
    label: "Emerging Technologies",
    description:
      "Practical pilots for new stacks—edge AI, confidential compute, or novel runtimes—with clear kill criteria and cost ceilings. We separate proof of value from vendor roadmaps. What ships is what your team can operate for years.",
  },
];
