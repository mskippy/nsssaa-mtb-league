document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("division-select");
  const container = document.getElementById("division-table-container");

  fetch("data/division_results.json")
    .then(res => res.json())
    .then(data => {
      const divisions = Object.keys(data).sort();

      // Populate dropdown
      divisions.forEach(division => {
        const option = document.createElement("option");
        option.value = division;
        option.textContent = division;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const selected = select.value;
        if (!selected || !data[selected]) {
          container.innerHTML = "";
          return;
        }

        const riders = [...data[selected]];

        // Sort by "Top 5" points descending
        riders.sort((a, b) => (b["Top 5"] || 0) - (a["Top 5"] || 0));

        // Assign rank
        riders.forEach((rider, i) => {
          rider.Rank = i + 1;
        });

        // Build table
        let table = `<table class="result-table">
          <thead><tr>
            <th>Rank</th><th>Name</th><th>School</th><th>Plate #</th>
            <th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>R5</th><th>R6</th>
            <th>Top 5</th>
          </tr></thead><tbody>`;

        riders.forEach(r => {
          table += `<tr>
            <td>${r.Rank}</td>
            <td>${r["Student Name"]}</td>
            <td>${r["School"]}</td>
            <td>${r["Plate #"]}</td>
            <td>${format(r["R1 Pts"])}</td>
            <td>${format(r["R2 Pts"])}</td>
            <td>${format(r["R3 Pts"])}</td>
            <td>${format(r["R4 Pts"])}</td>
            <td>${format(r["R5 Pts"])}</td>
            <td>${format(r["R6 Pts"])}</td>
            <td><strong>${format(r["Top 5"])}</strong></td>
          </tr>`;
        });

        table += "</tbody></table>";
        container.innerHTML = table;
      });
    });

  function format(val) {
    return (val === undefined || val === null || val === "NaN") ? "-" : val;
  }
});
