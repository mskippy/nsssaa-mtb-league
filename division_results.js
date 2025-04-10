// Fetch the results data
fetch('/data/results.json')
  .then(response => response.json())
  .then(data => {
    const teamsDivisions = data.teams;
    const ridersDivisions = data.riders;

    // Get references to the results containers
    const teamsContainer = document.getElementById('team-results');
    const ridersContainer = document.getElementById('rider-results');
    const divisionSelect = document.getElementById('division-select');

    // Create the division dropdown menu
    Object.keys(teamsDivisions).forEach(division => {
      let option = document.createElement("option");
      option.value = division;
      option.textContent = division;
      divisionSelect.appendChild(option);
    });

    // Function to render teams based on selected division
    function renderTeams(division) {
      const divisionData = teamsDivisions[division];
      let divisionHTML = `<h3>${division} - Top 3 Teams</h3><table><thead><tr><th>Rank</th><th>Team</th><th>Race 1</th><th>Race 2</th><th>Race 3</th><th>Race 4</th><th>Race 5</th><th>Race 6</th><th>Total</th></tr></thead><tbody>`;

      divisionData.forEach((team, index) => {
        divisionHTML += `<tr>
          <td>${index + 1}</td>
          <td>${team.name}</td>
          <td>${team.race1 || 'N/A'}</td>
          <td>${team.race2 || 'N/A'}</td>
          <td>${team.race3 || 'N/A'}</td>
          <td>${team.race4 || 'N/A'}</td>
          <td>${team.race5 || 'N/A'}</td>
          <td>${team.race6 || 'N/A'}</td>
          <td>${team.total || 'N/A'}</td>
        </tr>`;
      });

      divisionHTML += `</tbody></table>`;
      teamsContainer.innerHTML = divisionHTML;
    }

    // Function to render riders based on selected division
    function renderRiders(division) {
      const divisionData = ridersDivisions[division];
      let divisionHTML = `<h3>${division} - Top 5 Riders</h3><table><thead><tr><th>Rank</th><th>Rider</th><th>School</th><th>Points</th></tr></thead><tbody>`;

      divisionData.forEach((rider, index) => {
        divisionHTML += `<tr>
          <td>${index + 1}</td>
          <td>${rider.name}</td>
          <td>${rider.school}</td>
          <td>${rider.points || 'N/A'}</td>
        </tr>`;
      });

      divisionHTML += `</tbody></table>`;
      ridersContainer.innerHTML = divisionHTML;
    }

    // Event listener for dropdown selection change
    divisionSelect.addEventListener('change', function() {
      const selectedDivision = divisionSelect.value;
      renderTeams(selectedDivision); // Render teams based on selected division
      renderRiders(selectedDivision); // Render riders based on selected division
    });

    // Default render of the first division (e.g., Sr Boys) when page loads
    renderTeams(Object.keys(teamsDivisions)[0]);
    renderRiders(Object.keys(ridersDivisions)[0]);

  })
  .catch(error => console.error('Error loading the results.json file:', error));
