fetch('data/results.json')
  .then(res => res.json())
  .then(data => {
    const divisionOrder = [
        "Sr Boys (Gr 11/12)",
        "Sr Girls (Gr 11/12)",
        "Jr Boys (Gr 10)",
        "Jr Girls (Gr 10)",
        "Juv Boys (Gr 9)",
        "Juv Girls (Gr 9)",
        "Bant Boys (Gr 8)",
        "Bant Girls (Gr 8)"
      ];
      
      divisionOrder.forEach(division => {
        if (data.teams[division]) {
          const div = document.createElement('div');
          div.classList.add('card');
          div.innerHTML = `<h3>${division}</h3>`;
      
          let teamTable = `<table class="result-table">
            <thead><tr><th>Rank</th><th>Team</th><th>Points</th></tr></thead><tbody>`;
      
          data.teams[division].forEach((team, index) => {
            teamTable += `<tr><td>${index + 1}</td><td>${team.name}</td><td>${team.points}</td></tr>`;
          });
      
          teamTable += `</tbody></table>`;
          div.innerHTML += teamTable;
          document.getElementById('team-results').appendChild(div);
        }
      
        if (data.riders[division]) {
          const div = document.createElement('div');
          div.classList.add('card');
          div.innerHTML = `<h3>${division}</h3>`;
      
          let riderTable = `<table class="result-table">
            <thead><tr><th>Rank</th><th>Name (School)</th><th>Points</th></tr></thead><tbody>`;
      
          data.riders[division].forEach((rider, index) => {
            riderTable += `<tr><td>${index + 1}</td><td>${rider.name} (${rider.school})</td><td>${rider.points}</td></tr>`;
          });
      
          riderTable += `</tbody></table>`;
          div.innerHTML += riderTable;
          document.getElementById('rider-results').appendChild(div);
        }
      });
      
  });
