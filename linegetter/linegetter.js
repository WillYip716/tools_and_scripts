const axios = require('axios')
require('dotenv').config()


// An api key is emailed to you when you sign up to a plan
const api_key = process.env.KEY;
// To get odds for a sepcific sport, use the sport key from the last request
//   or set sport to "upcoming" to see live and upcoming across all sports
let sport_key = 'basketball_nba'

axios.get('https://api.the-odds-api.com/v3/odds', {
    params: {
        api_key: api_key,
        sport: sport_key,
        region: 'us', // uk | us | eu | au
        mkt: 'spreads' // h2h | spreads | totals
    }
}).then(response => {
    let temparr, odds, homeindex,awayindex;
    
    response.data.data.forEach(element => {

        temparr = element.sites;
        
        if(element.home_team == element.teams[0]){
            homeindex = 0;
            awayindex = 1;
        }else{
            homeindex = 1;
            awayindex = 0;
        }

        odds = temparr.find((i) => (i.site_key == "draftkings")).odds.spreads.points[homeindex];
        if(odds.indexOf("-") == -1){
            odds = "+" + odds;
        }

        console.log(element.teams[awayindex] + " @ " + element.teams[homeindex] + "(" + odds + ")");
    });

    //usage
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])

})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})