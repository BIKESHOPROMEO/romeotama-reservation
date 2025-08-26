let availabilityData = [];

document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  const startHour = 10;
  const endHour = 18;
  let weekOffset = 0;

  async function fetchAvailability() {
    try {
    const res = await fetch("/api/calendar-availability");
    availabilityData = await res.json();
  } catch (err) {
    console.error("空き状況取得エラー:", err);
  }
}

  function isSlotAvailable(date, time) {
    return availabilityData.some(slot => slot.date === date && slot.time === time && slot.available);
 }

  function generateDates(offset) {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay + offset * 7);

    return [...Array(7)].map((_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return {
        date: d.toISOString().split("T")[0],
        label: `${d.getMonth() + 1}/${d.getDate()}(${["日","月","火","水","木","金","土"][d.getDay()]})`
      };
    });
  }

  function generateHours() {
    return [...Array(endHour - startHour + 1)].map((_, i) => `${startHour + i}:00`);
  }

  function renderCalendar() {
    calendarEl.innerHTML = "";
    const dates = generateDates(weekOffset);
    const hours = generateHours();
    const todayStr = new Date().toISOString().split("T")[0];

    const table = document.createElement("table");

    // ヘッダー
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));

    dates.forEach(d => {
      const th = document.createElement("th");
      th.textContent = d.label;
      const dayOfWeek = new Date(d.date).getDay();
      if (dayOfWeek === 0) th.classList.add("sunday");
      else if (dayOfWeek === 6) th.classList.add("saturday");
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // ボディ
    const tbody = document.createElement("tbody");
    hours.forEach(hour => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = hour;
      row.appendChild(timeCell);

      dates.forEach(d => {
        const cell = document.createElement("td");
        const hourNum = parseInt(hour.split(":")[0]);
        const isAvailable = isSlotAvailable(d.date, hour);

        const isPast = d.date < todayStr;
        const isToday = d.date === todayStr;
        const isFuture = d.date > todayStr;

        if (isPast) {
          cell.textContent = "×";
          cell.classList.add("unavailable");
        } else if (isToday) {
          cell.textContent = "◎";
          cell.classList.add("available");
          cell.addEventListener("click", () => {
            alert("【本日の予約は直接店舗へお電話にてお問い合わせ下さい】");
          });
        } else if (isFuture && isAvailable) {
          cell.textContent = "◎";
          cell.classList.add("available");
          cell.addEventListener("click", () => {
            const selectedDate = d.date;
            const selectedTime = hour;
            const url = new URL("https://yoyaku-form.vercel.app/");
		url.searchParams.set("date", selectedDate);
		url.searchParams.set("time", selectedTime);
		window.location.href = url.toString();
	});
        } else {
          cell.textContent = "×";
          cell.classList.add("unavailable");
        }

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    calendarEl.appendChild(table);
  }

async function initializeCalendar() {
  await fetchAvailability();
  if (availabilityData.length > 0) {
    renderCalendar();
  } else {
    console.error("空き状況データが取得できませんでした");
    calendarEl.innerHTML = "<p>空き状況の取得に失敗しました。</p>";
	// ? ここに入れる！
    calendarEl.innerHTML = `
      <div class="error-message">
        <p>現在、空き状況の取得に失敗しています。</p>
        <p>時間をおいて再度アクセスいただくか、店舗までお問い合わせください。</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCalendar();

  prevBtn.addEventListener("click", () => {
    weekOffset--;
    await fetchAvailability();
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    weekOffset++;
    await fetchAvailability();
    renderCalendar();
  });
});
});