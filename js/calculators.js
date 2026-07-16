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
