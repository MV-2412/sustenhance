const RESULTS = {
  clinical: {
    title: "Clinical Nutrition",
    body: "Based on your answers, Clinical Nutrition is the best starting point: evidence-based plans coordinated with your care team, for conditions like diabetes, PCOS, gut health, or heart health.",
    href: "services.html",
  },
  sports: {
    title: "Sports-Specific Nutrition",
    body: "Based on your answers, Sports-Specific Nutrition is the best starting point: fueling, recovery, and performance strategies built around your training.",
    href: "services.html",
  },
  wellness: {
    title: "Wellness Nutrition",
    body: "Based on your answers, Wellness Nutrition is the best starting point: balanced, nutrient-dense plans for weight, pregnancy, or overall well-being.",
    href: "services.html",
  },
  bespoke: {
    title: "Bespoke Nutrition Plans",
    body: "Based on your answers, a fully Bespoke Nutrition Plan is the best starting point: a diet chart built entirely around your specific goals.",
    href: "services.html",
  },
  unsure: {
    title: "A Free Discovery Call",
    body: "No clear front-runner yet, and that's completely fine. A free discovery call is the fastest way to figure out the right starting point together.",
    href: "contact.html#booking",
  },
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
const resultBody = document.getElementById("resultBody");
const resultPrimaryCta = document.getElementById("resultPrimaryCta");
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
  nextBtn.textContent = current === totalSteps - 1 ? "Get My Recommendation" : "Next";
  nudge.hidden = true;
}

function computeResult() {
  const data = new FormData(form);
  const goal = data.get("goal");
  const pattern = data.get("pattern");
  const medical = data.get("medical");
  const timeline = data.get("timeline");
  const name = (data.get("fullName") || "").trim();
  const email = (data.get("contactEmail") || "").trim();

  let key = goal;
  if (medical === "yes" && goal !== "clinical") {
    key = "clinical";
  }

  let result = RESULTS[key] || RESULTS.unsure;

  if (timeline === "exploring" && key !== "clinical") {
    result = {
      title: result.title + ", Take Your Time",
      body: result.body + " Since you're just exploring, feel free to browse the Recipes and Blog first, no pressure to book anything yet.",
      href: result.href,
    };
  }

  resultTitle.textContent = result.title;
  resultBody.textContent = result.body + " Meenu will personally review your answers and follow up with a plan tailored to you.";
  resultPrimaryCta.href = result.href;
  resultPrimaryCta.textContent = result.href.startsWith("contact.html") ? "Book a Free Call" : "See Details";

  form.hidden = true;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

  sendResultToMeenu({ name, email, goal, pattern, medical, timeline, recommendation: result.title });
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
  formData.append("Diagnosed medical condition", details.medical || "");
  formData.append("Timeline", details.timeline || "");
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
