const axios = require('axios');
const cheerio = require('cheerio');


async function results(){

    const html = await axios.get('https://www.footballdb.com/scores/index.html');

    const lastweekslines = "Miami%20Dolphins%20at%20Jacksonville%20Jaguars%20%28-3%2C%2047.5%29%20%7C%20Miami%20Dolphins+3%2C%20over%2047.5%0ALas%20Vegas%20Raiders%20at%20New%20England%20Patriots%20%28-6%2C%2046.5%29%20%7C%20New%20England%20Patriots-6%2C%20under%2046.5%0ALos%20Angeles%20Rams%20at%20Buffalo%20Bills%20%28-2.5%2C%2047.5%29%20%7C%20Los%20Angeles%20Rams+2.5%2C%20over%2047.5%0AHouston%20Texans%20at%20Pittsburgh%20Steelers%20%28-3.5%2C%2045%29%20%7C%20Pittsburgh%20Steelers-3.5%2C%20under%2045%0ASan%20Francisco%2049ers%20at%20New%20York%20Giants%20%28+4.5%2C%2041%29%20%7C%20San%20Francisco%2049ers-4.5%2C%20over%2041%0ATennessee%20Titans%20at%20Minnesota%20Vikings%20%28+2.5%2C%2047.5%29%20%7C%20Tennessee%20Titans-2.5%2C%20under%2047.5%0AWashington%20Football%20Team%20at%20Cleveland%20Browns%20%28-7%2C%2044%29%20%7C%20Washington%20Football%20Team+7%2C%20under%2044%0ACincinnati%20Bengals%20at%20Philadelphia%20Eagles%20%28-6.5%2C%2046.5%29%20%7C%20Cincinnati%20Bengals+6.5%2C%20over%2046.5%0AChicago%20Bears%20at%20Atlanta%20Falcons%20%28-3.5%2C%2047.5%29%20%7C%20Chicago%20Bears+3.5%2C%20over%2047.5%0ANew%20York%20Jets%20at%20Indianapolis%20Colts%20%28-10.5%2C%2044%29%20%7C%20Indianapolis%20Colts-10.5%2C%20over%2044%0ACarolina%20Panthers%20at%20Los%20Angeles%20Chargers%20%28-7.5%2C%2044%29%20%7C%20Los%20Angeles%20Chargers-7.5%2C%20over%2044%0ADetroit%20Lions%20at%20Arizona%20Cardinals%20%28-5.5%2C%2054.5%29%20%7C%20Arizona%20Cardinals-5.5%2C%20under%2054.5%0ATampa%20Bay%20Buccaneers%20at%20Denver%20Broncos%20%28+6%2C%2043.5%29%20%7C%20Tampa%20Bay%20Buccaneers-6%2C%20under%2043.5%0ADallas%20Cowboys%20at%20Seattle%20Seahawks%20%28-4.5%2C%2055.5%29%20%7C%20Seattle%20Seahawks-4.5%2C%20over%2055.5%0AGreen%20Bay%20Packers%20at%20New%20Orleans%20Saints%20%28-3.5%2C%2051.5%29%20%7C%20Green%20Bay%20Packers+3.5%2C%20over%2051.5%0AKansas%20City%20Chiefs%20at%20Baltimore%20Ravens%20%28-3%2C%2053.5%29%20%7C%20Kansas%20City%20Chiefs+3%2C%20over%2053.5";


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

