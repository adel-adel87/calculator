const TARIFFS = Object.freeze({
  t1: 11.43,
  t2: 4.15,
  t3: 8.00,
  cold: 67.77,
  hot: 317.71
});

const fieldIds = [
  "t1Previous", "t1Current",
  "t2Previous", "t2Current",
  "t3Previous", "t3Current",
  "coldPrevious", "coldCurrent",
  "hotPrevious", "hotCurrent"
];

const $ = (id) => document.getElementById(id);

function parseNumber(id, fieldName) {
  const raw = $(id).value
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");

  if (!raw) {
    throw new Error(`Введите значение в поле:\n${fieldName}`);
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Некорректное значение в поле:\n${fieldName}`);
  }

  if (value < 0) {
    throw new Error(`Значение не может быть отрицательным:\n${fieldName}`);
  }

  return value;
}

function calculateConsumption(previous, current, meterName) {
  if (current < previous) {
    throw new Error(
      `Текущие показания для «${meterName}» не могут быть меньше предыдущих.`
    );
  }

  return current - previous;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatMoney(value) {
  return `${formatNumber(value)} ₽`;
}

function showError(message) {
  $("errorMessage").textContent = message;
  $("errorDialog").classList.remove("hidden");
}

function hideError() {
  $("errorDialog").classList.add("hidden");
}

function calculate() {
  try {
    const t1Previous = parseNumber("t1Previous", "Предыдущие показания T1");
    const t1Current = parseNumber("t1Current", "Текущие показания T1");
    const t1Consumption = calculateConsumption(t1Previous, t1Current, "T1");
    const t1Cost = t1Consumption * TARIFFS.t1;

    const t2Previous = parseNumber("t2Previous", "Предыдущие показания T2");
    const t2Current = parseNumber("t2Current", "Текущие показания T2");
    const t2Consumption = calculateConsumption(t2Previous, t2Current, "T2");
    const t2Cost = t2Consumption * TARIFFS.t2;

    const t3Previous = parseNumber("t3Previous", "Предыдущие показания T3");
    const t3Current = parseNumber("t3Current", "Текущие показания T3");
    const t3Consumption = calculateConsumption(t3Previous, t3Current, "T3");
    const t3Cost = t3Consumption * TARIFFS.t3;

    const electricityConsumptionTotal =
      t1Consumption + t2Consumption + t3Consumption;

    const electricityCostTotal =
      t1Cost + t2Cost + t3Cost;

    const coldPrevious = parseNumber(
      "coldPrevious",
      "Предыдущие показания холодной воды"
    );

    const coldCurrent = parseNumber(
      "coldCurrent",
      "Текущие показания холодной воды"
    );

    const coldConsumption = calculateConsumption(
      coldPrevious,
      coldCurrent,
      "Холодная вода"
    );

    const coldCost = coldConsumption * TARIFFS.cold;

    const hotPrevious = parseNumber(
      "hotPrevious",
      "Предыдущие показания горячей воды"
    );

    const hotCurrent = parseNumber(
      "hotCurrent",
      "Текущие показания горячей воды"
    );

    const hotConsumption = calculateConsumption(
      hotPrevious,
      hotCurrent,
      "Горячая вода"
    );

    const hotCost = hotConsumption * TARIFFS.hot;
    const waterCostTotal = coldCost + hotCost;
    const grandTotal = electricityCostTotal + waterCostTotal;

    $("t1Calculation").textContent =
      `${formatNumber(t1Consumption)} кВт·ч × ${formatNumber(TARIFFS.t1)} ₽`;
    $("t1Result").textContent = formatMoney(t1Cost);

    $("t2Calculation").textContent =
      `${formatNumber(t2Consumption)} кВт·ч × ${formatNumber(TARIFFS.t2)} ₽`;
    $("t2Result").textContent = formatMoney(t2Cost);

    $("t3Calculation").textContent =
      `${formatNumber(t3Consumption)} кВт·ч × ${formatNumber(TARIFFS.t3)} ₽`;
    $("t3Result").textContent = formatMoney(t3Cost);

    $("electricityConsumptionTotal").textContent =
      `${formatNumber(electricityConsumptionTotal)} кВт·ч`;

    $("electricityCostTotal").textContent =
      formatMoney(electricityCostTotal);

    $("coldCalculation").textContent =
      `${formatNumber(coldConsumption)} м³ × ${formatNumber(TARIFFS.cold)} ₽`;
    $("coldResult").textContent = formatMoney(coldCost);

    $("hotCalculation").textContent =
      `${formatNumber(hotConsumption)} м³ × ${formatNumber(TARIFFS.hot)} ₽`;
    $("hotResult").textContent = formatMoney(hotCost);

    $("waterCostTotal").textContent = formatMoney(waterCostTotal);
    $("grandTotal").textContent = formatMoney(grandTotal);

    $("grandTotal").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (error) {
    showError(error.message || "Произошла неизвестная ошибка.");
  }
}

function clearAll() {
  fieldIds.forEach((id) => {
    $(id).value = "";
  });

  [
    "t1Calculation", "t2Calculation", "t3Calculation",
    "t1Result", "t2Result", "t3Result",
    "electricityConsumptionTotal", "electricityCostTotal",
    "coldCalculation", "coldResult",
    "hotCalculation", "hotResult",
    "waterCostTotal"
  ].forEach((id) => {
    $(id).textContent = "—";
  });

  $("grandTotal").textContent = "0,00 ₽";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("calculateButton").addEventListener("click", calculate);
$("clearButton").addEventListener("click", clearAll);
$("closeDialogButton").addEventListener("click", hideError);

$("errorDialog").addEventListener("click", (event) => {
  if (event.target === $("errorDialog")) {
    hideError();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideError();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((error) => {
        console.warn("Service Worker registration failed:", error);
      });
  });
}
