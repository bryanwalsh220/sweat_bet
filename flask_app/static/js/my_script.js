document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('tbody');

    fetch('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=b4418957800fb40d56e91f6373cb876c&regions=us&markets=h2h&oddsFormat=american')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach((team) => {
                    displayTeamInfo(team, tableBody);
                });
            } else {
                tableBody.textContent = "No team data available.";
            }
        })
        .catch((err) => {
            tableBody.textContent = "Failed to fetch data: " + err.message;
        });
});

function displayTeamInfo(team, tableBody) {
    const teamRow = document.createElement('tr');
    
    const awayTeamCell = document.createElement('td');
    awayTeamCell.textContent = team.away_team;

    const homeTeamCell = document.createElement('td');
    homeTeamCell.textContent = team.home_team;

    const moneyHomeCell = document.createElement('td');
    const moneyAwayCell = document.createElement('td');

    const homeOddsContainer = document.createElement('div');
    homeOddsContainer.classList.add("collapse");

    const awayOddsContainer = document.createElement('div');
    awayOddsContainer.classList.add("collapse");

    team.bookmakers.forEach((bookmaker) => {
        bookmaker.markets.forEach((market) => {
            if (market.key === 'h2h') {
                market.outcomes.forEach((outcome) => {
                    if (outcome.name === team.away_team) {
                        const oddsEntry = document.createElement('p');
                        oddsEntry.textContent = `${bookmaker.title}: ${outcome.price}`;
                        awayOddsContainer.appendChild(oddsEntry);
                    } else if (outcome.name === team.home_team) {
                        const oddsEntry = document.createElement('p');
                        oddsEntry.textContent = `${bookmaker.title}: ${outcome.price}`;
                        homeOddsContainer.appendChild(oddsEntry);
                    }
                });
            }
        });
    });

    const homeButton = createCollapsibleButton("Home MoneyLine Odds", homeOddsContainer);
    const awayButton = createCollapsibleButton("Away MoneyLine Odds", awayOddsContainer);

    moneyAwayCell.appendChild(awayButton);
    moneyHomeCell.appendChild(homeButton);

    teamRow.appendChild(homeTeamCell);
    teamRow.appendChild(awayTeamCell);
    teamRow.appendChild(moneyHomeCell);
    teamRow.appendChild(moneyAwayCell);

    tableBody.appendChild(teamRow);
}


// collapsible tables 

function createCollapsibleButton(text, content) {
    const button = document.createElement('button');
    button.type = "button";
    button.classList.add("btn", "btn-outline-info", "text-center");
    button.textContent = text;

    
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", `#${content.id}`);

    return button;
}
