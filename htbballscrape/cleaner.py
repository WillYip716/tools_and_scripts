import pandas as pd
import numpy as np


#drop_duplicates

import pandas as pd

"""df = pd.read_csv('fantasyprojections2021v2.csv')

cleaned = df.drop_duplicates()

cleaned.to_csv("cleaned.csv",index=False)"""

df = pd.read_csv('cleaned.csv')

df["Team"] = df["Team"].replace("BRO", "BKN")
df["Team"] = df["Team"].replace("OKL", "OKC")

df.to_csv("cleaned.csv",index=False)

print(df["Team"].unique())
#['DEN' 'BRO' 'GSW' 'POR' 'MIN' 'WAS' 'BOS' 'PHI' 'MIL' 'LAC' 'DAL' 'LAL' 'ATL' 'TOR' 'MIA' 'IND' 'OKL' 'CHI' 'PHX' 'CHA' 'NOP' 'MEM' 'SAC' 'UTA' 'NYK' 'SAS' 'CLE' 'DET' 'HOU' 'ORL' 'FA']

#teams = ["MIA","PHI","TOR","LAC","OKC","IND","HOU","DEN","WAS","SAC","SAS","LAL","DAL","MEM","BOS","POR","BKN","PHX","UTA","ORL","MIL","NOP","NYK","DET","CHA","ATL","GSW","CLE","CHI","MIN"]

