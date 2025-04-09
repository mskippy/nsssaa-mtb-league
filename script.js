
fetch('data/results.json')
    .then(res => res.json())
    .then(data => {
        const teamDiv = document.getElementById('team-results');
        const riderDiv = document.getElementById('rider-results');

        for (const division in data.teams) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${division}</h3><ol>${
                data.teams[division].map(team => `<li>${team.name} (${team.points} pts)</li>`).join('')
            }</ol>`;
            teamDiv.appendChild(div);
        }

        for (const division in data.riders) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${division}</h3><ol>${
                data.riders[division].map(rider => `<li>${rider.name} (${rider.points} pts)</li>`).join('')
            }</ol>`;
            riderDiv.appendChild(div);
        }
    });
