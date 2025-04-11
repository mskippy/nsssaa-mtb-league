document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("team-results-container");
  
    fetch("data/team_results.json")
      .then((res) => res.json())
      .then((data) => {
        // Define the division order
        const divisionOrder = [
          "Sr Boys", "Jr Boys", "Jr/Sr Girls", "Bant/Juv Girls", "Juv Boys", "Bant Boys"
        ];
  
        let htmlContent = "";
  
        // Loop through each division and display it
        divisionOrder.forEach((division) => {
          const teams = data[division];
  
          // Filter out teams with no points
          const filteredTeams = teams.filter((team) => team.Total > 0);
  
          if (filteredTeams.length > 0) {
            // Create the table for the division
            htmlContent += `<h3>${division}</h3>
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
  
            filteredTeams.forEach((team) => {
              htmlContent += `<tr>
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
  
            htmlContent += "</tbody></table>";
          }
        });
  
        // Render the table content
        container.innerHTML = htmlContent;
      })
      .catch((err) => {
        console.error("Failed to load team results:", err);
        container.innerHTML = "<p>Failed to load team results data.</p>";
      });
  });
  