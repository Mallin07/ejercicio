const sportCheck = document.getElementById("sportCheck");
const foodCheck = document.getElementById("foodCheck");
const saveBtn = document.getElementById("saveBtn");
const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

function getData() {
  return JSON.parse(localStorage.getItem("dailyTracker")) || {};
}

function saveData(data) {
  localStorage.setItem("dailyTracker", JSON.stringify(data));
}

function getTodayKey() {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function loadToday() {
  const data = getData();
  const today = getTodayKey();

  if (data[today]) {
    sportCheck.checked = data[today].sport;
    foodCheck.checked = data[today].food;
  }
}

saveBtn.addEventListener("click", () => {
  const data = getData();
  const today = getTodayKey();

  data[today] = {
    sport: sportCheck.checked,
    food: foodCheck.checked
  };

  saveData(data);
  renderCalendar();
});

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day", "empty");
    calendar.appendChild(empty);
  }

  const data = getData();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const currentDay = new Date(year, month, day);
    currentDay.setHours(0, 0, 0, 0);

    const hasRegister = data[dateKey];

    let sportDone = false;
    let foodDone = false;

    if (hasRegister) {
      sportDone = data[dateKey].sport;
      foodDone = data[dateKey].food;
    }

    const isFuture = currentDay > today;

    dayBox.innerHTML = `
      <strong>${day}</strong>

      <div class="icons">
        <span class="icon ${!isFuture ? (sportDone ? "green" : "red") : ""}">
          🏋️
        </span>

        <span class="icon ${!isFuture ? (foodDone ? "green" : "red") : ""}">
          🍗
        </span>
      </div>
    `;

    calendar.appendChild(dayBox);
  }
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

loadToday();
renderCalendar();