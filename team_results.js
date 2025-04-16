document.addEventListener('DOMContentLoaded', function () {
  fetch('data/team_results_fixed.json')
    .then(response => response.json())
    .then(data => {
      console.log("Team Results JSON Loaded:", data);

      const divisionOrder = [
        'Sr Boys',
        'Jr Boys',
        'Jr/Sr Girls',
        'Bant/Juv Girls',
        'Juv Boys',
        'Bant Boys'
      ];

      const divisionSection = document.getElementById('division-results');

      divisionOrder.forEach(division => {
        const teamsRaw = data[division] || [];

        console.log(`Loaded ${teamsRaw.length} teams for division: ${division}`, teamsRaw);

        const teams = teamsRaw.filter(team =>
          team.Total !== null && team.Total !== 0 && !isNaN(team.Total)
        );


        if (teams.length === 0) return;

        // Create and append division heading
        const heading = document.createElement('h2');
        heading.innerText = division;
        divisionSection.appendChild(heading);

        // Create table
        const table = document.createElement('table');
        table.classList.add('team-results-table');

        // Create header row
        const headers = ['Rank', 'School', 'Race 1', 'Race 2', 'Race 3', 'Race 4', 'Race 5', 'Race 6', 'Total'];
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
          const th = document.createElement('th');
          th.innerText = header;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body rows
        const tbody = document.createElement('tbody');
        teams.forEach((team, index) => {
          const row = document.createElement('tr');
          const cells = [
            index + 1,
            team.School,
            team.Race1 ?? '',
            team.Race2 ?? '',
            team.Race3 ?? '',
            team.Race4 ?? '',
            team.Race5 ?? '',
            team.Race6 ?? '',
            team.Total
          ];
          cells.forEach(cell => {
            const td = document.createElement('td');
            td.innerText = cell;
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        divisionSection.appendChild(table);
      });
    })
    .catch(error => {
      console.error('Error loading team results data:', error);
    });
});
