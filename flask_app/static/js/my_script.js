document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('team-info'); 

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

    const viewGameCell = document.createElement('td');
    const viewGameButton = document.createElement('button');
    viewGameButton.type = "button";
    viewGameButton.classList.add("btn", "btn-outline-success", "view-game-btn");
    viewGameButton.textContent = "View Game";
    viewGameButton.setAttribute('data-home', team.home_team);
    viewGameButton.setAttribute('data-away', team.away_team);

    viewGameButton.addEventListener('click', function(){
        const homeTeam = team.home_team;
        const awayTeam = team.away_team;

        fetchOddsData(homeTeam, awayTeam)
            .then(function(oddsData) {
                populateModal(homeTeam, awayTeam, oddsData);

                $('#gameModal').modal('show');
            })
            .catch(function(error) {
                console.error("error fetching odds", error);
            })
    });


    viewGameCell.appendChild(viewGameButton);

    teamRow.appendChild(homeTeamCell);
    teamRow.appendChild(awayTeamCell);
    teamRow.appendChild(viewGameCell);

    tableBody.appendChild(teamRow);
}




function fetchOddsData(homeTeam, awayTeam) {
    const apiUrl = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=b4418957800fb40d56e91f6373cb876c&regions=us&markets=h2h&oddsFormat=american';

    return fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            return extractOddsData(data, homeTeam, awayTeam);
        });
}


function extractOddsData(data, homeTeam, awayTeam) {
    const oddsData = {};

    if ('data' in data) {
        data['data'].forEach((team) => {
            if (team['home_team'] === homeTeam && team['away_team'] === awayTeam) {
                team['bookmakers'].forEach((bookmaker) => {
                    bookmaker['markets'].forEach((market) => {
                        if (market['key'] === 'h2h') {
                            market['outcomes'].forEach((outcome) => {
                                oddsData[bookmaker['title']] = outcome['price'];
                            });
                        }
                    });
                });
            }
        });
    }

    return oddsData;
}

// modal population
function populateModal(homeTeam, awayTeam, oddsData) {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = `${homeTeam} vs. ${awayTeam} Odds`;

    const oddsTable = document.createElement('table');
    oddsTable.classList.add('table', 'table-bordered');

    const tableHead = document.createElement('thead');
    tableHead.classList.add('thead-dark');

    const headRow = document.createElement('tr');
    const bookmakerHead = document.createElement('th');
    bookmakerHead.textContent = 'Bookmaker';
    const oddsHead = document.createElement('th');
    oddsHead.textContent = 'Odds';

    headRow.appendChild(bookmakerHead);
    headRow.appendChild(oddsHead);
    tableHead.appendChild(headRow);

    const tableBody = document.createElement('tbody');
    tableBody.classList.add("modal-body");

    for (const bookmaker in oddsData) {
        const oddsRow = document.createElement('tr');
        const bookmakerCell = document.createElement('td');
        const oddsCell = document.createElement('td');

        bookmakerCell.textContent = bookmaker;
        oddsCell.textContent = oddsData[bookmaker];

        oddsRow.appendChild(bookmakerCell);
        oddsRow.appendChild(oddsCell);

        tableBody.appendChild(oddsRow);
    }

    oddsTable.appendChild(tableHead);
    oddsTable.appendChild(tableBody);

    modalBody.appendChild(modalTitle);
    modalBody.appendChild(oddsTable);
}