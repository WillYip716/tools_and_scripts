const axios = require('axios');
const cheerio = require('cheerio');


async function results(){

    const html = await axios.get('https://www.footballdb.com/scores/index.html');

    const lastweekslines = "Minnesota%20Vikings%20at%20New%20Orleans%20Saints%20%28-7.0%2C%2050.5%29%20%7C%20New%20Orleans%20Saints-7.0%2C%20over%2050.5%0ATampa%20Bay%20Buccaneers%20at%20Detroit%20Lions%20%28+9.5%2C%2054.0%29%20%7C%20Detroit%20Lions+9.5%2C%20under%2054.0%0ASan%20Francisco%2049ers%20at%20Arizona%20Cardinals%20%28-5.0%2C%2049.0%29%20%7C%20Arizona%20Cardinals-5.0%2C%20under%2049.0%0AMiami%20Dolphins%20at%20Las%20Vegas%20Raiders%20%28+3.0%2C%2047.5%29%20%7C%20Miami%20Dolphins-3.0%2C%20over%2047.5%0AAtlanta%20Falcons%20at%20Kansas%20City%20Chiefs%20%28-10.5%2C%2054.0%29%20%7C%20Atlanta%20Falcons+10.5%2C%20over%2054.0%0ACleveland%20Browns%20at%20New%20York%20Jets%20%28+9.5%2C%2047.5%29%20%7C%20Cleveland%20Browns-9.5%2C%20over%2047.5%0AIndianapolis%20Colts%20at%20Pittsburgh%20Steelers%20%28+1.5%2C%2044.5%29%20%7C%20Indianapolis%20Colts-1.5%2C%20over%2044.5%0AChicago%20Bears%20at%20Jacksonville%20Jaguars%20%28+7.5%2C%2047.0%29%20%7C%20Chicago%20Bears-7.5%2C%20over%2047.0%0ANew%20York%20Giants%20at%20Baltimore%20Ravens%20%28-10.5%2C%2044.5%29%20%7C%20Baltimore%20Ravens-10.5%2C%20over%2044.5%0ACincinnati%20Bengals%20at%20Houston%20Texans%20%28-7.5%2C%2046.0%29%20%7C%20Houston%20Texans-7.5%2C%20over%2046.0%0ADenver%20Broncos%20at%20Los%20Angeles%20Chargers%20%28-3.0%2C%2048.5%29%20%7C%20Denver%20Broncos+3.0%2C%20over%2048.5%0ACarolina%20Panthers%20at%20Washington%20%28-1.0%2C%2043.0%29%20%7C%20Carolina%20Panthers+1.0%2C%20over%2043.0%0APhiladelphia%20Eagles%20at%20Dallas%20Cowboys%20%28+2.5%2C%2049.5%29%20%7C%20Philadelphia%20Eagles-2.5%2C%20over%2049.5%0ALos%20Angeles%20Rams%20at%20Seattle%20Seahawks%20%28-1.5%2C%2047.5%29%20%7C%20Los%20Angeles%20Rams+1.5%2C%20over%2047.5%0ATennessee%20Titans%20at%20Green%20Bay%20Packers%20%28-3.0%2C%2056.0%29%20%7C%20Tennessee%20Titans+3.0%2C%20over%2056.0%0ABuffalo%20Bills%20at%20New%20England%20Patriots%20%28+7.0%2C%2046.0%29%20%7C%20New%20England%20Patriots+7.0%2C%20under%2046.0";


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
        'Washington':'Washington',
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

