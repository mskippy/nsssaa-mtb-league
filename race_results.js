// race_results.js
fetch('data/race_comparison.json')
  .then(response => response.json())
  .then(data => {
    const raceSelect = document.getElementById('race-select');
    const container = document.getElementById('race-results-container');

    // Populate dropdown
    Object.keys(data).forEach(raceKey => {
      const option = document.createElement('option');
      option.value = raceKey;
      option.textContent = `${raceKey}: ${data[raceKey].race_name}`;
      raceSelect.appendChild(option);
    });

    raceSelect.addEventListener('change', () => {
      const selectedRace = raceSelect.value;
      container.innerHTML = '';
      if (!selectedRace || !data[selectedRace]) return;

      const { race_name, boys, girls } = data[selectedRace];
      container.appendChild(createTableSection('Boys Divisions', boys));
      container.appendChild(createTableSection('Girls Divisions', girls));
    });

    function createTableSection(title, divisions) {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        heading.textContent = title;
        section.appendChild(heading);
      
        const table = document.createElement('table');
        table.classList.add("result-table");
      
        const headerRow = document.createElement('tr');
        const divisionKeys = Object.keys(divisions);
        divisionKeys.forEach(div => {
          const th = document.createElement('th');
          th.textContent = div;
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
      
        const maxRows = Math.max(...divisionKeys.map(div => divisions[div].length));
      
        for (let i = 0; i < maxRows; i++) {
          const row = document.createElement('tr');
          divisionKeys.forEach(div => {
            const td = document.createElement('td');
            const fullText = divisions[div][i] || '';
            const [name, school] = fullText.split(/\s\((.*)\)/);  // split into name + school
            td.innerHTML = name ? `${name}<br><span class="school-name">${school || ''}</span>` : '';
            row.appendChild(td);
          });
          table.appendChild(row);
        }
      
        section.appendChild(table);
        return section;
      }
      
  })
  .catch(error => {
    console.error('Error loading race results:', error);
  });
