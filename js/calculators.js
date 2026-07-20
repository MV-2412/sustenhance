function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

const BMI_INSIGHTS = {
  "Underweight": "May indicate insufficient energy or nutrient intake. Worth a closer look, especially alongside recent weight history and any digestive or hormonal symptoms.",
  "Normal weight": "Generally a lower-risk range, but BMI alone doesn't capture muscle mass, fat distribution, or metabolic health, so it's a starting point, not a verdict.",
  "Overweight": "Associated with somewhat higher risk for some conditions, but context matters: activity level, waist circumference, and lab markers tell a fuller story than this number alone.",
  "Obese": "Associated with higher risk for several conditions, but sustainable change starts with a plan built around your specific history, not just this number.",
};

document.getElementById("bmiForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const heightCm = parseFloat(document.getElementById("bmiHeight").value);
  const weightKg = parseFloat(document.getElementById("bmiWeight").value);
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const category = bmiCategory(bmi);

  const scaleMin = 15;
  const scaleMax = 35;
  const markerPct = Math.min(100, Math.max(0, ((bmi - scaleMin) / (scaleMax - scaleMin)) * 100));

  const result = document.getElementById("bmiResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>${bmi.toFixed(1)}</strong>: ${category}</p>
    <div class="gauge">
      <div class="gauge-track">
        <span class="gauge-zone gauge-zone-under"></span>
        <span class="gauge-zone gauge-zone-normal"></span>
        <span class="gauge-zone gauge-zone-over"></span>
        <span class="gauge-zone gauge-zone-obese"></span>
      </div>
      <div class="gauge-marker" id="bmiMarker" style="left:0%"></div>
    </div>
    <div class="gauge-labels"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>35+</span></div>
    <p class="calculator-note">${BMI_INSIGHTS[category]}</p>
  `;

  const marker = document.getElementById("bmiMarker");
  requestAnimationFrame(() => {
    marker.style.left = `${markerPct}%`;
  });
});

document.getElementById("calorieForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const sex = document.getElementById("calSex").value;
  const age = parseFloat(document.getElementById("calAge").value);
  const heightCm = parseFloat(document.getElementById("calHeight").value);
  const weightKg = parseFloat(document.getElementById("calWeight").value);
  const activity = parseFloat(document.getElementById("calActivity").value);

  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === "male" ? 5 : -161;
  const calories = Math.round(bmr * activity);

  const proteinG = Math.round(1.6 * weightKg);
  const proteinCal = proteinG * 4;
  const fatCal = calories * 0.25;
  const fatG = Math.round(fatCal / 9);
  const carbCal = Math.max(0, calories - proteinCal - fatCal);
  const carbG = Math.round(carbCal / 4);

  const proteinPct = (proteinCal / calories) * 100;
  const fatPct = (fatCal / calories) * 100;
  const carbPct = 100 - proteinPct - fatPct;

  const mildLoss = Math.round(calories - 250);
  const loss = Math.round(calories - 500);
  const gain = Math.round(calories + 300);

  const result = document.getElementById("calorieResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>~${calories.toLocaleString()} kcal/day</strong> to maintain your current weight at this activity level.</p>
    <div class="macro-bar" id="macroBar">
      <span class="macro-seg macro-protein" style="width:0%"></span>
      <span class="macro-seg macro-carb" style="width:0%"></span>
      <span class="macro-seg macro-fat" style="width:0%"></span>
    </div>
    <ul class="macro-legend">
      <li><span class="macro-dot macro-protein"></span>Protein: <strong>${proteinG}g</strong></li>
      <li><span class="macro-dot macro-carb"></span>Carbs: <strong>${carbG}g</strong></li>
      <li><span class="macro-dot macro-fat"></span>Fat: <strong>${fatG}g</strong></li>
    </ul>
    <ul class="calorie-reference">
      <li>Gradual fat loss: <strong>~${mildLoss.toLocaleString()} kcal/day</strong></li>
      <li>Faster fat loss: <strong>~${loss.toLocaleString()} kcal/day</strong></li>
      <li>Lean gain: <strong>~${gain.toLocaleString()} kcal/day</strong></li>
    </ul>
    <p class="calculator-note">This is an estimate from the Mifflin-St Jeor equation. Real needs shift with muscle mass, hormones, sleep, and stress, an actual plan adjusts as your body responds.</p>
  `;

  const bar = document.getElementById("macroBar");
  const segs = bar.querySelectorAll(".macro-seg");
  requestAnimationFrame(() => {
    segs[0].style.width = `${proteinPct}%`;
    segs[1].style.width = `${carbPct}%`;
    segs[2].style.width = `${fatPct}%`;
  });
});

document.getElementById("waterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const weightKg = parseFloat(document.getElementById("waterWeight").value);
  const liters = weightKg * 0.035;
  const cups = liters / 0.24;
  const fillPct = Math.min(100, (liters / 5) * 100);

  const result = document.getElementById("waterResult");
  result.hidden = false;
  result.innerHTML = `
    <div class="water-visual">
      <div class="water-glass">
        <div class="water-fill" id="waterFill" style="height:0%"></div>
      </div>
      <p class="calculator-result-text"><strong>~${liters.toFixed(1)} L/day</strong><br>about ${Math.round(cups)} cups</p>
    </div>
    <p class="calculator-note">A general baseline. Add roughly 400-600ml per hour of exercise, and more in hot or humid weather. Pale yellow urine is a simpler day-to-day hydration check than any formula.</p>
  `;

  const fill = document.getElementById("waterFill");
  requestAnimationFrame(() => {
    fill.style.height = `${fillPct}%`;
  });
});

document.getElementById("wellnessForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const age = parseFloat(document.getElementById("wellnessAge").value);
  const exercise = parseInt(document.getElementById("wellnessExercise").value, 10);
  const sleep = parseInt(document.getElementById("wellnessSleep").value, 10);
  const diet = parseInt(document.getElementById("wellnessDiet").value, 10);
  const smokes = document.getElementById("wellnessSmoke").value === "yes";

  const exerciseAdjust = { 0: 3, 1: 1, 2: -1, 3: -3 }[exercise];
  const sleepAdjust = { 0: 3, 1: 0, 2: -2 }[sleep];
  const dietAdjust = { 0: 3, 1: 0, 2: -2 }[diet];
  const smokeAdjust = smokes ? 5 : 0;

  const wellnessAge = Math.max(18, Math.round(age + exerciseAdjust + sleepAdjust + dietAdjust + smokeAdjust));
  const diff = wellnessAge - age;

  let message;
  if (diff <= -3) message = "Your habits are working in your favor, keep it up.";
  else if (diff < 3) message = "Your habits roughly match your actual age.";
  else message = "There's real room to close this gap with a few consistent changes.";

  const result = document.getElementById("wellnessResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>${wellnessAge} years</strong> estimated wellness age, vs your actual age of ${age}.</p>
    <p class="calculator-note">${message} This is a rough lifestyle indicator, not a medical or biological age test.</p>
  `;
});

document.getElementById("ibwForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const sex = document.getElementById("ibwSex").value;
  const heightCm = parseFloat(document.getElementById("ibwHeight").value);
  const heightIn = heightCm / 2.54;
  const base = sex === "male" ? 50 : 45.5;
  const overBase = Math.max(0, heightIn - 60);
  const ibw = base + 2.3 * overBase;
  const rangeLow = ibw * 0.9;
  const rangeHigh = ibw * 1.1;

  const result = document.getElementById("ibwResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>~${ibw.toFixed(1)} kg</strong><br>healthy range: ${rangeLow.toFixed(1)}-${rangeHigh.toFixed(1)} kg</p>
    <p class="calculator-note">Based on the Devine formula. It doesn't account for muscle mass, frame size, or build, an athletic or larger-framed body can be healthy well outside this range.</p>
  `;
});

document.getElementById("fiberForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const sex = document.getElementById("fiberSex").value;
  const age = parseFloat(document.getElementById("fiberAge").value);

  let grams;
  if (sex === "male") grams = age <= 50 ? 38 : 30;
  else grams = age <= 50 ? 25 : 21;

  const result = document.getElementById("fiberResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>~${grams} g/day</strong></p>
    <p class="calculator-note">Roughly the fiber in 5-6 servings of vegetables, fruit, and whole grains combined. Increase gradually and drink enough water alongside it to avoid digestive discomfort.</p>
  `;
});

document.getElementById("pregnancyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const heightCm = parseFloat(document.getElementById("pregHeight").value);
  const weightKg = parseFloat(document.getElementById("pregWeight").value);
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category, gainLow, gainHigh;
  if (bmi < 18.5) { category = "Underweight"; gainLow = 12.5; gainHigh = 18; }
  else if (bmi < 25) { category = "Normal weight"; gainLow = 11.5; gainHigh = 16; }
  else if (bmi < 30) { category = "Overweight"; gainLow = 7; gainHigh = 11.5; }
  else { category = "Obese"; gainLow = 5; gainHigh = 9; }

  const result = document.getElementById("pregnancyResult");
  result.hidden = false;
  result.innerHTML = `
    <p class="calculator-result-text"><strong>${gainLow}-${gainHigh} kg</strong> total recommended gain<br>pre-pregnancy category: ${category}</p>
    <p class="calculator-note">Based on IOM guidelines for a singleton pregnancy. Most of this gain happens in the 2nd and 3rd trimesters, roughly 0.3-0.5 kg per week. Twin pregnancies and individual medical history change these numbers, always confirm with your OB and a dietician.</p>
  `;
});
