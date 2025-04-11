document.addEventListener('DOMContentLoaded', function() {
  // Fetch team results data from the team_results.json file
  fetch('data/team_results.json')
    .then(response => response.json())
    .then(data => {
      // Debug: Check if data is fetched correctly
      console.log(data);

      // Define the division order
      const divisionOrder = ['Sr Boys', 'Jr Boys', 'Jr/Sr Girls', 'Bant/Juv Girls', 'Juv Boys', 'Bant Boys'];

      // Loop through the divisions in the defined order
      divisionOrder.forEach(division => {
        if (data[division]) {
          const divisionData = data[division];

          // Create the division table
          const table = document.createElement('table');
          table.classList.add('team-results-table');

          // Table Header
          const headerRow = document.createElement('tr');
          const headers = ['Rank', 'Team', 'Total Points'];
          headers.forEach(headerText => {
            const th = document.createElement('th');
            th.innerText = headerText;
            headerRow.appendChild(th);
          });
          table.appendChild(headerRow);

          // Table Rows (Ranking teams by Total Points)
          divisionData.forEach((team, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            rankCell.innerText = index + 1; // Rank based on order
            const teamCell = document.createElement('td');
            teamCell.innerText = team.name;
            const pointsCell = document.createElement('td');
            pointsCell.innerText = team.points > 0 ? team.points : '-'; // Show '-' if no points
            
            row.appendChild(rankCell);
            row.appendChild(teamCell);
            row.appendChild(pointsCell);

            table.appendChild(row);
          });

          // Append the table to the page (find the division section to append it)
          const divisionSection = document.getElementById('division-results'); // The container for division results
          const divisionHeader = document.createElement('h3');
          divisionHeader.innerText = division; // Division name (e.g., Sr Boys, Jr Boys)
          divisionSection.appendChild(divisionHeader);
          divisionSection.appendChild(table);
        }
      });
    })
    .catch(error => {
      console.error('Error loading team results data:', error);
    });
});
