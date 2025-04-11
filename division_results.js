document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("school-select");
  const container = document.getElementById("school-results-container");

  fetch("data/school_results.json")
    .then(res => res.json())
    .then(data => {
      // Extract all unique schools
      const schools = [...new Set(Object.keys(data))];

      // Populate school dropdown
      schools.forEach(school => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const selectedSchool = select.value;
        if (!selectedSchool) {
          container.innerHTML = "";
          return;
        }

        // Filter and sort riders by school
        const schoolRiders = Object.keys(data)
          .map(division => ({
            division,
            riders: data[division].filter(rider => rider.school === selectedSchool)
          }))
          .filter(item => item.riders.length > 0)
          .sort((a, b) => {
            const order = ["Sr Boys", "Jr Boys", "Juv Boys", "Bant Boys"];
            return order.indexOf(a.division) - order.indexOf(b.division);
          });

        // Build tables for each division
        let html = '';
        schoolRiders.forEach(({ division, riders }) => {
          riders.sort((a, b) => b.points - a.points); // Sort by total points descending

          let table = `<h3>${division}</h3><table class="result-table">
            <thead>
              <tr>
                <th>Name</th><th>Plate</th><th>Race 1</th><th>Race 2</th><th>Race 3</th>
                <th>Race 4</th><th>Race 5</th><th>Race 6</th><th>Total Points</th>
              </tr>
            </thead><tbody>`;

          riders.forEach(rider => {
            table += `<tr>
              <td>${rider.name}</td>
              <td>${rider.plate}</td>
              <td>${rider["R1 Place"]} (${rider["R1 Pts"]})</td>
              <td>${rider["R2 Place"]} (${rider["R2 Pts"]})</td>
              <td>${rider["R3 Place"]} (${rider["R3 Pts"]})</td>
              <td>${rider["R4 Place"]} (${rider["R4 Pts"]})</td>
              <td>${rider["R5 Place"]} (${rider["R5 Pts"]})</td>
              <td>${rider["R6 Place"]} (${rider["R6 Pts"]})</td>
              <td><strong>${rider.points}</strong></td>
            </tr>`;
          });

          table += "</tbody></table>";
          html += table;
        });

        container.innerHTML = html;
      });
    });
});
