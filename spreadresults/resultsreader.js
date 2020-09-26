const axios = require('axios');
const cheerio = require('cheerio');


async function main(){
    const html = await axios.get('https://www.footballdb.com/scores/index.html?lg=NFL&yr=2020&type=reg&wk=2');

    const $ = await cheerio.load(html.data);
    let data = [];
    let test = new RegExp('^[A-Za-z]+');
    

    $("tbody").each((index,element) => {

                let field = $(element).find("tr");
                
                console.log($(field[0]).find("td.left").text());
                console.log($(field[0]).find("td.center").text());
                console.log($(field[1]).find("td.left").text());
                console.log($(field[1]).find("td.center").text());

    });

    

    
}

main();

