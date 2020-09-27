const axios = require('axios');
const cheerio = require('cheerio');


async function results(){

    const html = await axios.get('https://www.footballdb.com/scores/index.html?lg=NFL&yr=2020&type=reg&wk=2');

    const lastweekslines = "Cincinnati%20Bengals%20at%20Cleveland%20Browns%20%28-6%2C%2043.5%29%7C%20Bengals%20+6%2C%20under%0ALos%20Angeles%20Rams%20at%20Philadelphia%20Eagles%20%28+1%2C%2046%29%7C%20Rams%20-1%2C%20over%0ANew%20York%20Giants%20at%20Chicago%20Bears%20%28-6.5%2C%2042%29%7C%20Giants%20+6%2C%20over%0AAtlanta%20Falcons%20at%20Dallas%20Cowboys%20%28-5%2C%2052%29%7C%20Falcons%20+5%2C%20over%0ASan%20Francisco%2049ers%20at%20New%20York%20Jets%20%28+6.5%2C%2042.5%29%7C%2049ers%20-6.5%2C%20under%0ACarolina%20Panthers%20at%20Tampa%20Bay%20Buccaneers%20%28-9%2C%2049%29%7C%20Buccaneers%20-9%2C%20under%0ADetroit%20Lions%20at%20Green%20Bay%20Packers%20%28-6%2C%2047.5%29%7C%20Packers%20-6%2C%20over%0ABuffalo%20Bills%20at%20Miami%20Dolphins%20%28+5.5%2C%2041%29%7C%20Bills%20-5.5%2C%20under%0ADenver%20Broncos%20at%20Pittsburgh%20Steelers%20%28-6.5%2C%2041.5%29%7C%20Steelers%20-6.5%2C%20under%0AMinnesota%20Vikings%20at%20Indianapolis%20Colts%20%28-3%2C%2048%29%7C%20Vikings%20+3%2C%20over%0AJacksonville%20Jaguars%20at%20Tennessee%20Titans%20%28-9%2C%2042.5%29%7C%20Jags%20+%209%2C%20over%0AWashington%20Football%20Team%20at%20Arizona%20Cardinals%20%28-6.5%2C%2046.5%29%7C%20Cardinals%20-6.5%2C%20over%0AKansas%20City%20Chiefs%20at%20Los%20Angeles%20Chargers%20%28+8.5%2C%2047.5%29%7C%20Chiefs%20-8.5%2C%20over%0ABaltimore%20Ravens%20at%20Houston%20Texans%20%28+6.5%2C%2052.5%29%7C%20Ravens%20-6.5%2C%20over%0ANew%20England%20Patriots%20at%20Seattle%20Seahawks%20%28-4%2C%2045%29%7C%20Seahawks%20-4%2C%20under%0ANew%20Orleans%20Saints%20at%20Las%20Vegas%20Raiders%20%28+5.5%2C%2051.5%29%7C%20Raiders%20+5.5%2C%20over";


    const $ = await cheerio.load(html.data);
    let data = {};
    let parser = new RegExp(/(^[A-Za-z ]+)\s/);
    let linereader = new RegExp(/([A-Za-z0-9 ]*)\sat\s([A-Za-z ]*)\((\+|\-)([0-9.]*),\s([0-9.]*)\)\s\|\s([A-Za-z0-9 ]*)(\+|\-)([0-9.]*),\s(over|under)\s([0-9.]*)/);

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
    let spreadrecord = {wins:0,losses:0,push:0};
    let ourecord = {wins:0,losses:0,push:0}; 
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
            ourecord[wins] = ourecord[wins] + 1;
        }
        else if(totalscore === ounum){
            ourecord[push] = ourecord[push] + 1;
        }
        else{
            ourecord[losses] = ourecord[losses] + 1;
        }

        if(spreadscore > parseFloat(data[oppteam])){
            spreadrecord[wins] = ourecord[wins] + 1;
        }
        else if(spreadscore === parseFloat(data[oppteam])){
            spreadrecord[push] = ourecord[push] + 1;
        }
        else{
            spreadrecord[losses] = ourecord[losses] + 1;
        }
        
        console.log(parsedLine[0]);
        console.log("final score: " + spreadteam + " " + data[spreadteam] + " " + oppteam + " " + data[oppteam]);
        console.log("record Spread: " + spreadrecord[wins] + "-" + spreadrecord[losses] + "-" + spreadrecord[push]);
        console.log("record O/U: " + ourecord[wins] + "-" + ourecord[losses] + "-" + ourecord[push]);
    }
    
}

results();

