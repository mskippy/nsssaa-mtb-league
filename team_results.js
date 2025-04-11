document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("division-select");
    const container = document.getElementById("team-results-container");
  
    fetch("data/team_results.json")
      .then((res) => res.json())
      .then((data) => {
        const divisions = Object.keys(data).sort();
  
        // Populate division dropdown
        divisions.forEach((division) => {
          const option = document.createElement("option");
          option.value = division;
          option.textContent = division;
          select.appendChild(option);
        });
  
        select.addEventListener("change", () => {
          const selected = select.value;
          container.innerHTML = "";
  
          if (!selected || !data[selected]) return;
  
          const teams = data[selected];
  
          let table = `<h3>${selected}</h3>
          <table class="result-table">
            <thead>
              <tr>
                <th>School</th>
                <th>R1</th><th>R2</th><th>R3</th>
                <th>R4</th><th>R5</th><th>R6</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>`;
  
          teams.forEach((team) => {
            table += `<tr>
              <td>${team.School}</td>
              <td>${team["R1 Pts"]}</td>
              <td>${team["R2 Pts"]}</td>
              <td>${team["R3 Pts"]}</td>
              <td>${team["R4 Pts"]}</td>
              <td>${team["R5 Pts"]}</td>
              <td>${team["R6 Pts"]}</td>
              <td><strong>${team.Total}</strong></td>
            </tr>`;
          });
  
          table += "</tbody></table>";
          container.innerHTML = table;
        });
      })
      .catch((err) => {
        console.error("Failed to load team results:", err);
        container.innerHTML = "<p>Failed to load team results data.</p>";
      });
  });
  