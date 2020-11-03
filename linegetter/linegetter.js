const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.espn.com/nfl/lines';

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
    $('tbody tr', html).each(function() {
        //console.log($(this).text());
      let field = $(this).find("td");
      console.log($(field[0]).text());
      console.log($(field[2]).text());
      //console.log($(field[0]).find("td").text());
      //console.log($(field[1]).find("td").text());
      /*let data1 = $(field[0]).find("td")[2].text();
      let data2 = $(field[1]).find("td")[2].text();
      console.log(data1);
      console.log(data2);*/
    });
  })
  .catch(function(err) {
    //handle error
  });