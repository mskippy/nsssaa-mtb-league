
fetch('data/results.json')
    .then(res => res.json())
    .then(data => {
        const teamDiv = document.getElementById('team-results');
        const riderDiv = document.getElementById('rider-results');

        for (const division in data.teams) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${division}</h3><ol>${
                let teamTable = `<table class="result-table"><thead><tr><th>Rank</th><th>Team</th><th>Points</th></tr></thead><tbody>`;
data.teams[division].forEach((team, index) => {
  teamTable += `<tr><td>${index + 1}</td><td>${team.name}</td><td>${team.points}</td></tr>`;
});
teamTable += `</tbody></table>`;
div.innerHTML += teamTable;

            }</ol>`;
            teamDiv.appendChild(div);
        }

        for (const division in data.riders) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${division}</h3><ol>${
                let riderTable = `<table class="result-table"><thead><tr><th>Rank</th><th>Name (School)</th><th>Points</th></tr></thead><tbody>`;
data.riders[division].forEach((rider, index) => {
  riderTable += `<tr><td>${index + 1}</td><td>${rider.name} (${rider.school})</td><td>${rider.points}</td></tr>`;
});
riderTable += `</tbody></table>`;
div.innerHTML += riderTable;


            }</ol>`;
            riderDiv.appendChild(div);
        }
    });
