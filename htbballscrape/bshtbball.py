import requests,re
from bs4 import BeautifulSoup
import csv



with open('bballprojections.html', 'r') as f:

    contents = f.read()

    soup = BeautifulSoup(contents, 'html.parser')


"""url = 'https://hashtagbasketball.com/fantasy-basketball-projections'
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

league_table = soup.find('table', id = 'ContentPlaceHolder1_GridView1')
"""

league_table = soup.find('tbody')
output = []

for player in league_table.find_all('tr'):
    
    stats = player.find_all('td')
    if len(stats):
        if "R" not in stats[0].text:
            """print("name:" , stats[1].find('span').string)
            print("POS:" , stats[2].text)
            print("Team:" , stats[3].text)
            print("Games:" , stats[4].text)
            print("Min:" , stats[5].text)
            print("FG%:" ,stats[6].find('span').string)
            fg = re.search("([0-9.]*)\/([0-9.]*)",stats[6].find_all('span')[1].string)
            print("FGM" ,fg.group(1))
            print("FGA" ,fg.group(2))
            print("FGM/FGA:" ,stats[6].find_all('span')[1].string)
            print("FT%:" ,stats[7].find_all('span')[0].string)
            ft = re.search("([0-9.]*)\/([0-9.]*)",stats[7].find_all('span')[1].string)
            print("FTM" ,ft.group(1))
            print("FTA" ,ft.group(2))
            print("FTM/FTA:" ,stats[7].find_all('span')[1].string)
            print("3PM:" ,stats[8].find('span').string)
            print("PTS:" ,stats[9].find('span').string)
            print("TREB:" ,stats[10].find('span').string)
            print("AST:" ,stats[11].find('span').string)
            print("STL:" ,stats[12].find('span').string)
            print("BLK:" ,stats[13].find('span').string)
            print("TO:" ,stats[14].find('span').string)"""

            p = {"name":stats[1].find('span').string}
            p["POS"] = stats[2].text
            p["Team"] = stats[3].text
            p["Games"] = stats[4].text
            p["Min"] = stats[5].text
            p["FG%"] = stats[6].find('span').string
            fg = re.search("([0-9.]*)\/([0-9.]*)",stats[6].find_all('span')[1].string)
            p["FGM"] = fg.group(1)
            p["FGA"] = fg.group(2)
            p["FT%"] = stats[7].find('span').string
            ft = re.search("([0-9.]*)\/([0-9.]*)",stats[7].find_all('span')[1].string)
            p["FTM"] = ft.group(1)
            p["FTA"] = ft.group(2)
            p["3PM"] = stats[8].find('span').string
            p["PTS"] = stats[9].find('span').string
            p["TREB"] = stats[10].find('span').string
            p["AST"] = stats[11].find('span').string
            p["STL"] = stats[12].find('span').string
            p["BLK"] = stats[13].find('span').string
            p["TO"] = stats[14].find('span').string

            output.append(p)

keys = output[0].keys()
with open('fantasyprojections2021v2.csv', 'w', newline='')  as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(output)