import pandas as pd
from nba_api.stats.endpoints import scoreboard
from datetime import datetime
import urllib.parse
import re

todaysdate = datetime.today().strftime('%Y-%m-%d')
codes =   {
    "Atlanta Hawks"	        :"ATL", 
    "Brooklyn Nets"	        :"BKN", 
    "Boston Celtics" 	    :"BOS", 
    "Charlotte Hornets" 	:"CHA", 
    "Chicago Bulls" 	    :"CHI", 
    "Cleveland Cavaliers"   :"CLE", 
    "Dallas Mavericks" 	    :"DAL", 
    "Denver Nuggets" 	    :"DEN", 
    "Detroit Pistons"	    :"DET", 
    "Golden State Warriors" :"GSW", 
    "Houston Rockets" 	    :"HOU", 
    "Indiana Pacers"  	    :"IND", 
    "Los Angeles Clippers" 	:"LAC", 
    "Los Angeles Lakers"	:"LAL", 
    "Memphis Grizzlies"     :"MEM", 
    "Miami Heat"	        :"MIA", 
    "Milwaukee Bucks"	    :"MIL", 
    "Minnesota Timberwolves":"MIN", 
    "New Orleans Pelicans"	:"NOP", 
    "New York Knicks" 	    :"NYK", 
    "Oklahoma City Thunder" :"OKC", 
    "Orlando Magic"	        :"ORL", 
    "Philadelphia 76ers"	:"PHI", 
    "Phoenix Suns" 	        :"PHX", 
    "Portland Trail Blazers":"POR", 
    "Sacramento Kings" 	    :"SAC", 
    "San Antonio Spurs" 	:"SAS", 
    "Toronto Raptors" 	    :"TOR", 
    "Utah Jazz" 	        :"UTA", 
    "Washington Wizards"	:"WAS", 
}
spreadrecord = {"wins":0,"losses":0,"push":0};


predictions = "Orlando%20Magic%20@%20Detroit%20Pistons%28-2.0%29%20%7C%20Orlando%20Magic+2.0%0AIndiana%20Pacers%20@%20Washington%20Wizards%28-4.5%29%20%7C%20Washington%20Wizards-4.5%0AGolden%20State%20Warriors%20@%20New%20Orleans%20Pelicans%28-2.5%29%20%7C%20New%20Orleans%20Pelicans-2.5%0APortland%20Trail%20Blazers%20@%20Atlanta%20Hawks%28-2.5%29%20%7C%20Portland%20Trail%20Blazers+2.5%0ANew%20York%20Knicks%20@%20Memphis%20Grizzlies%28-3.5%29%20%7C%20New%20York%20Knicks+3.5%0APhiladelphia%2076ers%20@%20Chicago%20Bulls%28+6.0%29%20%7C%20Philadelphia%2076ers-6.0%0ASan%20Antonio%20Spurs%20@%20Utah%20Jazz%28-7.5%29%20%7C%20San%20Antonio%20Spurs+7.5%0ADenver%20Nuggets%20@%20Los%20Angeles%20Lakers%28+5.0%29%20%7C%20Denver%20Nuggets-5.0"

predictions = urllib.parse.unquote(predictions)

predictions = predictions.split("\n")
prog = re.compile(r"([A-Za-z0-9 ]*)\s[at|@]\s([A-Za-z0-9 ]*)\((\+|\-)([0-9.]*)\)\s\|\s([A-Za-z0-9 ]*)(\+|\-)([0-9.]*)")

scores = scoreboard.Scoreboard(day_offset='0',game_date=todaysdate,league_id='00')
scores = scores.get_data_frames()[1]
results = dict(zip(scores.TEAM_ABBREVIATION, scores.PTS))

for i in predictions:
    parsed = prog.match(i)
    vscore = int(results[codes[parsed[1]]])
    hscore = int(results[codes[parsed[2]]])

    if parsed[1] == parsed[5] :
        if parsed[6] == "-" :
            vscore = vscore - float(parsed[7])
        else:
            vscore = vscore + float(parsed[7])
        if vscore > hscore:
            spreadrecord["wins"] = spreadrecord["wins"] + 1
        elif vscore == hscore:
            spreadrecord["push"] = spreadrecord["push"] + 1
        else:
            spreadrecord["losses"] = spreadrecord["losses"] + 1
    else:
        if parsed[6] == "-" :
            hscore = hscore - float(parsed[7])
        else:
            hscore = hscore + float(parsed[7])
        if hscore > vscore:
            spreadrecord["wins"] = spreadrecord["wins"] + 1
        elif vscore == hscore:
            spreadrecord["push"] = spreadrecord["push"] + 1
        else:
            spreadrecord["losses"] = spreadrecord["losses"] + 1


    print(codes[parsed[1]] + " vs " + codes[parsed[2]] + " " + str(vscore) + " to " + str(hscore))
    print(codes[parsed[5]] +" " + str(parsed[6]) + str(parsed[7]))
    print(spreadrecord)



#print(results)
#print(urllib.parse.unquote(predictions))