document.addEventListener("DOMContentLoaded", () => {
    fetch("data/division_results.json")
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("division-select");
        const tableDiv = document.getElementById("results-table");
  
        // Populate dropdown
        const divisions = Object.keys(data);
        divisions.forEach(division => {
          const option = document.createElement("option");
          option.value = division;
          option.textContent = division;
          select.appendChild(option);
        });
  
        // Render default (first) division
        renderDivision(data, divisions[0]);
  
        select.addEventListener("change", () => {
          const selected = select.value;
          renderDivision(data, selected);
        });
  
        function renderDivision(data, division) {
          const riders = data[division];
          let html = `
            <h3>${division}</h3>
            <table class="result-table">
              <thead>
                <tr>
                  <th>Rank</th><th>Name</th><th>School</th><th>Plate</th>
                  <th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>R5</th><th>R6</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
          `;
  
          riders.forEach((rider, index) => {
            html += `
              <tr>
                <td>${index + 1}</td>
                <td>${rider.name}</td>
                <td>${rider.school}</td>
                <td>${rider["Plate #"]}</td>
                <td>${rider["R1 Place"] ?? "-"}</td>
                <td>${rider["R2 Place"] ?? "-"}</td>
                <td>${rider["R3 Place"] ?? "-"}</td>
                <td>${rider["R4 Place"] ?? "-"}</td>
                <td>${rider["R5 Place"] ?? "-"}</td>
                <td>${rider["R6 Place"] ?? "-"}</td>
                <td>${rider["Top 5"]}</td>
              </tr>
            `;
          });
  
          html += "</tbody></table>";
          tableDiv.innerHTML = html;
        }
      })
      .catch(err => {
        console.error("Failed to load division results:", err);
        document.getElementById("results-table").innerHTML = "<p>Error loading data.</p>";
      });
  });
  