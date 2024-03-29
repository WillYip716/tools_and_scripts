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
spreadrecord = {"wins":0,"losses":0,"push":0}


predictions = "Boston%20Celtics%20%40%20Orlando%20Magic(%2B11.5)%20%7C%20Orlando%20Magic%2B11.5%0APortland%20Trail%20Blazers%20%40%20Cleveland%20Cavaliers(%2B12.0)%20%7C%20Portland%20Trail%20Blazers-12.0%0AMemphis%20Grizzlies%20%40%20Minnesota%20Timberwolves(%2B3.5)%20%7C%20Minnesota%20Timberwolves%2B3.5%0APhoenix%20Suns%20%40%20Atlanta%20Hawks(%2B1.0)%20%7C%20Hawks%2B1.0%0APhiladelphia%2076ers%20%40%20Houston%20Rockets(%2B14.5)%20%7C%20Philadelphia%2076ers-14.5%0ASacramento%20Kings%20%40%20Indiana%20Pacers(-6.5)%20%7C%20Indiana%20Pacers-6.5%0AWashington%20Wizards%20%40%20Milwaukee%20Bucks(-3.5)%20%7C%20Milwaukee%20Bucks-3.5%0ANew%20York%20Knicks%20%40%20Denver%20Nuggets(-4.0)%20%7C%20Denver%20Nuggets-4.0%0ASan%20Antonio%20Spurs%20%40%20Utah%20Jazz(-6.5)%20%7C%20Utah%20Jazz-6.5"

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