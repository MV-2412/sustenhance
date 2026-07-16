const ARCHETYPES = {
  clinical: {
    name: "The Medical Navigator",
    service: "Clinical Nutrition",
    href: "services.html#clinical",
    intro: "your priority right now is managing a health condition through food, not just general healthy eating",
  },
  sports: {
    name: "The Performance Seeker",
    service: "Sports-Specific Nutrition",
    href: "services.html#sports",
    intro: "you're training for a result, so your nutrition needs to be built around performance and recovery, not a generic diet",
  },
  wellness: {
    name: "The Balanced Builder",
    service: "Wellness Nutrition",
    href: "services.html#wellness",
    intro: "you're after sustainable, everyday balance rather than a short-term fix",
  },
  bespoke: {
    name: "The Custom Planner",
    service: "Bespoke Nutrition Plans",
    href: "services.html#bespoke",
    intro: "your situation doesn't fit a standard category, so a plan built entirely around you is the right starting point",
  },
  unsure: {
    name: "The Open Explorer",
    service: "a Discovery Call",
    href: "contact.html#booking",
    intro: "you know something needs to change but haven't landed on a clear goal yet, and that's a completely normal place to start from",
  },
};

const BARRIER_INSIGHTS = {
  time: "Your biggest blocker is time. Meenu builds plans around realistic prep, not recipes that assume you have two spare hours a day.",
  consistency: "You tend to start strong and then fall off. The plan needs built-in check-ins and small, repeatable habits, not just a one-time diet chart.",
  clarity: "You're not sure what's actually right for your body. That's exactly what a proper assessment solves before any plan is written.",
  condition: "A medical condition is complicating things. Your plan should be coordinated with that condition from day one, not layered on top of it later.",
  accountability: "You've been missing real support. Ongoing check-ins with Meenu, not a PDF you never open again, make the difference here.",
};

const PATTERN_NOTES = {
  structured: "Since you're already fairly structured, the focus will be on refining what's working rather than starting from zero.",
  inconsistent: "With good days and chaotic ones, the plan will lean on flexible defaults you can fall back on when things get busy.",
  restrictive: "Given a history of frequent dieting, the approach will prioritize sustainability over restriction.",
  none: "With no real plan in place yet, you'll get clear, simple structure to start from, nothing overwhelming.",
};

const URGENCY_NOTES = {
  asap: "You said you want to start as soon as possible, let's get a call on the calendar this week.",
  month: "You're aiming to start within the month. Booking a call now means you're not scrambling to catch up later.",
  exploring: "You're just exploring for now, no pressure at all. A quick call can still save you weeks of guessing.",
};

const form = document.getElementById("assessmentForm");
const steps = Array.from(form.querySelectorAll(".quiz-question"));
const totalSteps = steps.length;
const progressFill = document.getElementById("quizProgressFill");
const stepLabel = document.getElementById("quizStepLabel");
const backBtn = document.getElementById("quizBackBtn");
const nextBtn = document.getElementById("quizNextBtn");
const nudge = document.getElementById("quizNudge");

const resultCard = document.getElementById("quizResult");
const resultTitle = document.getElementById("resultTitle");
const resultService = document.getElementById("resultService");
const resultBody = document.getElementById("resultBody");
const resultInsights = document.getElementById("resultInsights");
const resultUrgency = document.getElementById("resultUrgency");
const resultSecondaryCta = document.getElementById("resultSecondaryCta");
const retakeBtn = document.getElementById("retakeBtn");

let current = 0;

function currentStepAnswered() {
  const stepEl = steps[current];
  const radios = stepEl.querySelectorAll("input[type=radio]");
  if (radios.length) {
    return Array.from(radios).some((input) => input.checked);
  }
  const textInputs = stepEl.querySelectorAll("input[type=text], input[type=email]");
  if (textInputs.length) {
    return Array.from(textInputs).every((input) => input.value.trim() !== "" && input.checkValidity());
  }
  return true;
}

function renderStep() {
  steps.forEach((step, i) => (step.hidden = i !== current));
  progressFill.style.width = `${((current + 1) / totalSteps) * 100}%`;
  stepLabel.textContent = `Step ${current + 1} of ${totalSteps}`;
  backBtn.hidden = current === 0;
  nextBtn.textContent = current === totalSteps - 1 ? "Get My Nutrition Profile" : "Next";
  nudge.hidden = true;
}

function computeResult() {
  const data = new FormData(form);
  const goal = data.get("goal");
  const pattern = data.get("pattern");
  const barrier = data.get("barrier");
  const medical = data.get("medical");
  const timeline = data.get("timeline");
  const name = (data.get("fullName") || "").trim();
  const email = (data.get("contactEmail") || "").trim();

  let key = goal;
  let medicalOverride = false;
  if (medical === "yes" && goal !== "clinical") {
    key = "clinical";
    medicalOverride = true;
  }

  const archetype = ARCHETYPES[key] || ARCHETYPES.unsure;
  const firstName = name.split(" ")[0] || "there";

  let bodyText = `${firstName}, based on your answers, ${archetype.intro}. That points to ${archetype.service} as your best starting point.`;
  if (medicalOverride) {
    bodyText = `${firstName}, your main goal was ${ARCHETYPES[goal] ? ARCHETYPES[goal].service.toLowerCase() : "something else"}, but since you have a diagnosed condition, we'll start with ${archetype.service} to build on a safe foundation, then work your original goal in from there.`;
  }

  const insights = [];
  if (BARRIER_INSIGHTS[barrier]) insights.push(BARRIER_INSIGHTS[barrier]);
  if (PATTERN_NOTES[pattern]) insights.push(PATTERN_NOTES[pattern]);
  insights.push("Meenu personally reviews every submission before your follow-up, this isn't an auto-generated plan.");

  resultTitle.textContent = archetype.name;
  resultService.textContent = `Best fit: ${archetype.service}`;
  resultBody.textContent = bodyText;
  resultInsights.innerHTML = "";
  insights.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    resultInsights.appendChild(li);
  });
  resultUrgency.textContent = URGENCY_NOTES[timeline] || "";
  resultSecondaryCta.href = archetype.href;
  resultSecondaryCta.textContent = `See ${archetype.service} Details`;
  resultSecondaryCta.hidden = archetype.href.startsWith("contact.html");

  form.hidden = true;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

  sendResultToMeenu({ name, email, goal, pattern, barrier, medical, timeline, recommendation: archetype.service, profile: archetype.name });
}

function sendResultToMeenu(details) {
  const formData = new FormData();
  formData.append("access_key", "cbc4d079-54af-410a-a662-27e7da53b788");
  formData.append("subject", "New assessment result from Sust.Enhance website");
  formData.append("from_name", "Sust.Enhance website");
  formData.append("Name", details.name);
  formData.append("Email", details.email);
  formData.append("Main goal", details.goal || "");
  formData.append("Eating pattern", details.pattern || "");
  formData.append("Biggest barrier", details.barrier || "");
  formData.append("Diagnosed medical condition", details.medical || "");
  formData.append("Timeline", details.timeline || "");
  formData.append("Nutrition profile", details.profile || "");
  formData.append("Recommendation", details.recommendation || "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
    signal: controller.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}

nextBtn.addEventListener("click", () => {
  if (!currentStepAnswered()) {
    nudge.hidden = false;
    return;
  }
  if (current === totalSteps - 1) {
    computeResult();
    return;
  }
  current += 1;
  renderStep();
});

backBtn.addEventListener("click", () => {
  if (current === 0) return;
  current -= 1;
  renderStep();
});

retakeBtn.addEventListener("click", () => {
  form.reset();
  current = 0;
  renderStep();
  form.hidden = false;
  resultCard.hidden = true;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderStep();
