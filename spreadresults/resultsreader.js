const axios = require('axios');
const cheerio = require('cheerio');


async function results(){

    const html = await axios.get('https://www.footballdb.com/scores/index.html');

    const lastweekslines = "[enter encoded results here]";


    const $ = await cheerio.load(html.data);
    let data = {};
    let parser = new RegExp(/(^[A-Za-z ]+)\s/);
    let linereader = new RegExp(/([A-Za-z0-9 ]*)\sat\s([A-Za-z0-9 ]*)\s\((\+|\-)([0-9.]*),\s([0-9.]*)\)\s\|\s([A-Za-z0-9 ]*)(\+|\-)([0-9.]*),\s(over|under)\s([0-9.]*)/);

    const teamkeys = {
        'Cincinnati Bengals':'Cincinnati',
        'Cleveland Browns':'Cleveland',
        'New York Giants':'NY Giants',
        'Chicago Bears':'Chicago',
        'Atlanta Falcons':'Atlanta',
        'Dallas Cowboys':'Dallas',
        'Detroit Lions':'Detroit',
        'Green Bay Packers':'Green Bay',
        'Minnesota Vikings':'Minnesota',
        'Indianapolis Colts':'Indianapolis',
        'Buffalo Bills':'Buffalo',
        'Miami Dolphins':'Miami',
        'San Francisco 49ers':'San Francisco',
        'New York Jets':'NY Jets',
        'Los Angeles Rams':'LA Rams',
        'Philadelphia Eagles':'Philadelphia',
        'Denver Broncos':'Denver',
        'Pittsburgh Steelers':'Pittsburgh',
        'Carolina Panthers':'Carolina',
        'Tampa Bay Buccaneers':'Tampa Bay',
        'Jacksonville Jaguars':'Jacksonville',
        'Tennessee Titans':'Tennessee',
        'Washington Football Team':'Washington',
        'Arizona Cardinals':'Arizona',
        'Baltimore Ravens':'Baltimore',
        'Houston Texans':'Houston',
        'Kansas City Chiefs':'Kansas City',
        'Los Angeles Chargers':'LA Chargers',
        'New England Patriots':'New England',
        'Seattle Seahawks':'Seattle',
        'New Orleans Saints':'New Orleans',
        'Las Vegas Raiders':'Las Vegas'
    };
    

    $("tbody").each((index,element) => {
                let field = $(element).find("tr");         
                data[$(field[0]).find("td.left").text().match(parser)[1]] = $(field[0]).find("td.center").text();
                data[$(field[1]).find("td.left").text().match(parser)[1]] = $(field[1]).find("td.center").text();
    });



    let linesArr = unescape(lastweekslines).split("\n");
    console.log(linesArr);
    let parsedLine, oppteam, spreadteam, ounum,spreadscore,totalscore;
    let spreadrecord = {"wins":0,"losses":0,"push":0};
    let ourecord = {"wins":0,"losses":0,"push":0}; 
    for(let i = 0; i < linesArr.length; i++){
        parsedLine = linesArr[i].match(linereader);
        console.log(parsedLine);
        spreadteam = parsedLine[6];
        if(spreadteam === parsedLine[1]){
            oppteam = parsedLine[2];
        }else{
            oppteam = parsedLine[1];
        }
        spreadteam = teamkeys[spreadteam];
        oppteam = teamkeys[oppteam];
        ounum = parseFloat(parsedLine[10]);
        totalscore = parseFloat(data[spreadteam]) + parseFloat(data[oppteam]);

        if(parsedLine[7] === "+"){
            spreadscore = parseFloat(data[spreadteam]) + parseFloat(parsedLine[8]);
        }
        else{
            spreadscore = parseFloat(data[spreadteam]) - parseFloat(parsedLine[8]);
        }

        if(((totalscore > ounum)&&(parsedLine[9] === "over"))||((totalscore < ounum)&&(parsedLine[9] === "under"))){
            ourecord["wins"] = ourecord["wins"] + 1;
        }
        else if(totalscore === ounum){
            ourecord["push"] = ourecord["push"] + 1;
        }
        else{
            ourecord["losses"] = ourecord["losses"] + 1;
        }

        if(spreadscore > parseFloat(data[oppteam])){
            spreadrecord["wins"] = spreadrecord["wins"] + 1;
        }
        else if(spreadscore === parseFloat(data[oppteam])){
            spreadrecord["push"] = spreadrecord["push"] + 1;
        }
        else{
            spreadrecord["losses"] = spreadrecord["losses"] + 1;
        }
        
        console.log(parsedLine[0]);
        console.log("spreadscore: "+ spreadscore);
        console.log("oppscore: "+ parseFloat(data[oppteam]));
        console.log("final score: " + spreadteam + " " + data[spreadteam] + " " + oppteam + " " + data[oppteam]);
        console.log("totalscore: " + totalscore);
        console.log("record Spread: " + spreadrecord["wins"] + "-" + spreadrecord["losses"] + "-" + spreadrecord["push"]);
        console.log("record O/U: " + ourecord["wins"] + "-" + ourecord["losses"] + "-" + ourecord["push"]);
    }
    
}

results();

