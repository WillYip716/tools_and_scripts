const axios = require('axios');
const cheerio = require('cheerio');


async function results(){

    const html = await axios.get('https://www.footballdb.com/scores/index.html');

    const lastweekslines = "New%20York%20Giants%20at%20Philadelphia%20Eagles%20%28-4.5%2C%2044.5%29%20%7C%20Philadelphia%20Eagles-4.5%2C%20over%2044.5%0ACleveland%20Browns%20at%20Cincinnati%20Bengals%20%28+3%2C%2050.5%29%20%7C%20Cleveland%20Browns-3%2C%20over%2050.5%0ADallas%20Cowboys%20at%20Washington%20Football%20Team%20%28+1%2C%2047.5%29%20%7C%20Washington%20Football%20Team+1%2C%20under%2047.5%0ADetroit%20Lions%20at%20Atlanta%20Falcons%20%28-2.5%2C%2055%29%20%7C%20Detroit%20Lions+2.5%2C%20over%2055%0ACarolina%20Panthers%20at%20New%20Orleans%20Saints%20%28-7.5%2C%2051%29%20%7C%20Carolina%20Panthers+7.5%2C%20over%2051%0ABuffalo%20Bills%20at%20New%20York%20Jets%20%28+12.5%2C%2045%29%20%7C%20Buffalo%20Bills-12.5%2C%20under%2045%0AGreen%20Bay%20Packers%20at%20Houston%20Texans%20%28+3.5%2C%2057%29%20%7C%20Green%20Bay%20Packers-3.5%2C%20over%2057%0APittsburgh%20Steelers%20at%20Tennessee%20Titans%20%28-1%2C%2050.5%29%20%7C%20Pittsburgh%20Steelers+1%2C%20under%2050.5%0ASeattle%20Seahawks%20at%20Arizona%20Cardinals%20%28+3.5%2C%2056.5%29%20%7C%20Seattle%20Seahawks-3.5%2C%20over%2056.5%0AJacksonville%20Jaguars%20at%20Los%20Angles%20Chargers%20%28-7.5%2C%2049%29%20%7C%20Los%20Angeles%20Chargers-7.5%2C%20over%2049%0ASan%20Francisco%2049ers%20at%20New%20England%20Patriots%20%28-2%2C%2043.5%29%20%7C%20San%20Francisco%2049ers+2%2C%20under%2043.5%0AKansas%20City%20Chiefs%20at%20Denver%20Broncos%20%28+9.5%2C%2046%29%20%7C%20Denver%20Broncos+9.5%2C%20over%2046%0ATampa%20Bay%20Buccaneers%20at%20Las%20Vegas%20Raiders%20%28-3.5%2C%2052.5%29%20%7C%20Tampa%20Bay%20Buccaneers-3.5%2C%20over%2052.5%0AChicago%20Bears%20at%20Los%20Angeles%20Rams%20%28-6%2C%2044.5%29%20%7C%20Los%20Angeles%20Rams-6%2C%20under%2044.5";


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

