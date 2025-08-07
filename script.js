const calendarEl = document.getElementById("calendar");
const formEl = document.getElementById("form");

const days = 7;
const startHour = 10;
const endHour = 18;

// 日付生成
const today = new Date();
const dates = [...Array(days)].map((_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return {
    date: d.toISOString().split("T")[0],
    label: `${d.getMonth() + 1}/${d.getDate()}(${["日","月","火","水","木","金","土"][d.getDay()]})`
  };
});

// 時間生成
const hours = [...Array(endHour - startHour + 1)].map((_, i) => `${startHour + i}:00`);

// テーブル生成
const table = document.createElement("table");
const thead = document.createElement("thead");
const headerRow = document.createElement("tr");
headerRow.appendChild(document.createElement("th")); // 時間列の空白

dates.forEach(d => {
  const th = document.createElement("th");
  th.textContent = d.label;
  headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);

// 本体
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
      formEl.textContent = `*** ${d.label} ${hour} を選択しました`;
    });
    row.appendChild(cell);
  });

  tbody.appendChild(row);
});
table.appendChild(tbody);
calendarEl.appendChild(table);