import requests
from bs4 import BeautifulSoup


url = 'https://hashtagbasketball.com/fantasy-basketball-projections'
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

league_table = soup.find('table', id = 'ContentPlaceHolder1_GridView1')


for player in league_table.find_all('tr'):
    stats = player.find_all('td')
    if len(stats):

        print(stats[6].find('span').string)
        print(stats[7].find('span').string)
        print(stats[8].find('span').string)
        print(stats[9].find('span').string)
        print(stats[10].find('span').string)

    """for cells in player:
        #pl_team = row.find('td', class_ ='standing-table__cell standing-table__cell--name')
        #pl_team = pl_team['data-long-name']
        print()"""