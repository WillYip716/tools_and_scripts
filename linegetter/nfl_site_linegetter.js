const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.espn.com/nfl/lines';

let teams = "";
let spread = "";
let overunder = "";
let lines = [];

puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    $('tbody tr', html).each((index,element) => {
        
        let field = $(element).find("td");
        if(index%2==0){
          teams = $(field[0]).text();
          if($(field[2]).text().charAt(0) == "-"){
            spread = "+" + $(field[2]).text().slice(1);
          }
          else{
            overunder = $(field[2]).text();
          }
        }
        else{
          teams = teams + " at " + $(field[0]).text();
          if($(field[2]).text().charAt(0) == "-"){
            spread = $(field[2]).text();
          }
          else{
            overunder = $(field[2]).text();
          }
          lines.push(teams + " (" +spread+ ", " + overunder+")");
        }
        
    });
    for (let i = 0; i < lines.length; i++) {
      console.log(lines[i]);
    }
  })
  .catch(function(err) {
    //handle error
  });