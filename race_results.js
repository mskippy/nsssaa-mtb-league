document.addEventListener('DOMContentLoaded', () => {
    const divisionSelect = document.getElementById('division');
    const raceSelect = document.getElementById('race');
    const resultsTable = document.getElementById('resultsTable');
  
    fetch('race_results.json')
      .then(response => response.json())
      .then(data => {
        // Populate division dropdown
        const divisions = Object.keys(data);
        divisions.forEach(div => {
          const option = document.createElement('option');
          option.value = div;
          option.textContent = div;
          divisionSelect.appendChild(option);
        });
  
        // Initial load
        renderTable();
  
        // Re-render on dropdown change
        divisionSelect.addEventListener('change', renderTable);
        raceSelect.addEventListener('change', renderTable);
  
        function renderTable() {
          const selectedDiv = divisionSelect.value;
          const selectedRace = raceSelect.value;
  
          resultsTable.innerHTML = '';
  
          if (!selectedDiv || !selectedRace || !data[selectedDiv][selectedRace]) return;
  
          const results = data[selectedDiv][selectedRace];
  
          const table = document.createElement('table');
          table.classList.add('results-table');
  
          const thead = document.createElement('thead');
          thead.innerHTML = `
            <tr>
              <th>Name</th>
              <th>School</th>
              <th>Plate</th>
              <th>Place</th>
              <th>Points</th>
            </tr>`;
          table.appendChild(thead);
  
          const tbody = document.createElement('tbody');
          results.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${row.Name}</td>
              <td>${row.School}</td>
              <td>${row.Plate}</td>
              <td>${row.Place}</td>
              <td>${row.Points}</td>`;
            tbody.appendChild(tr);
          });
  
          table.appendChild(tbody);
          resultsTable.appendChild(table);
        }
      })
      .catch(error => {
        resultsTable.innerHTML = '<p>Error loading race results data.</p>';
        console.error(error);
      });
  });
  