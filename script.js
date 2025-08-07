document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const formEl = document.getElementById("form");
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  const startHour = 10;
  const endHour = 18;
  let weekOffset = 0;

 function generateDates(offset) {
  const today = new Date();
  const currentDay = today.getDay(); // 0=日, 1=月, ..., 6=土
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDay + offset * 7); // 週の先頭（日曜）を算出

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

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));

    dates.forEach(d => {
      const th = document.createElement("th");
      th.textContent = d.label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    hours.forEach(hour => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = hour;
      row.appendChild(timeCell);

      dates.forEach(d => {
        const cell = document.createElement("td");
        cell.textContent = "◎";
        cell.classList.add("available");
        cell.addEventListener("click", () => {
          formEl.classList.remove("hidden");
          formEl.textContent = `${d.label} ${hour} を選択しました`;
        });
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    calendarEl.appendChild(table);
  }

  prevBtn.addEventListener("click", () => {
    weekOffset--;
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    weekOffset++;
    renderCalendar();
  });

  renderCalendar();
});