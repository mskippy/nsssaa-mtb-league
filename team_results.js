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
            // Sort teams by Total points in descending order and add a rank
            filteredTeams.sort((a, b) => b.Total - a.Total);
            
            // Add rank to each team
            filteredTeams.forEach((team, index) => {
              team.rank = index + 1;  // Rank starts from 1
            });
  
            // Create the table for the division
            htmlContent += `<h3>${division}</h3>
            <table class="result-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>School</th>
                  <th>R1</th><th>R2</th><th>R3</th>
                  <th>R4</th><th>R5</th><th>R6</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>`;
  
            filteredTeams.forEach((team) => {
              // Manually log and verify the points for each race
              console.log(`Team: ${team.School}, R1: ${team["R1 Pts"]}, R2: ${team["R2 Pts"]}, R3: ${team["R3 Pts"]}, R4: ${team["R4 Pts"]}, R5: ${team["R5 Pts"]}, R6: ${team["R6 Pts"]}`);
  
              htmlContent += `<tr>
                <td>${team.rank}</td>
                <td>${team.School}</td>
                <td>${formatPoints(team["R1 Pts"])}</td>
                <td>${formatPoints(team["R2 Pts"])}</td>
                <td>${formatPoints(team["R3 Pts"])}</td>
                <td>${formatPoints(team["R4 Pts"])}</td>
                <td>${formatPoints(team["R5 Pts"])}</td>
                <td>${formatPoints(team["R6 Pts"])}</td>
                <td><strong>${formatPoints(team.Total)}</strong></td>
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
  
    // Function to format the points (replace 0 with dash)
    function formatPoints(value) {
      return value === 0 ? "-" : value;
    }
  });
  