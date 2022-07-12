# Daffy-v2.0
TTRPG Discord Bot created for Custom Fan Game. 

Daffy-v2.0 is a revamped version of the original Daffy, which was created for the Alticane HGW TTRPG. Daffy-v2.0 now facilitates the Cataclysm HGW TTRPG. None of the game content used in Daffy is official -- everything is fanmade. 

# Installation
After cloning the repo, create an .env file with the following tokens:
```
TOKEN='Your_Discord_Bot_Token'
GOOGLE_KEY='Your_Google_API_Key'
SHEET_ID='Your_Google_Sheet_ID'
```
Your Google Sheet ID can be found as follows:
`https://docs.google.com/spreadsheets/d/the_sheet_ID_is_here/edit#gid=0`

The shape and layout the Google Sheet will need will be detailed in a later section.

<br/>
After setting up your environment, run the following commands:

```
npm install
```

<br/>

This should install all necessary modules. In the case `npm install` doesn't work, the bot uses the following modules:

```
googleapis, discord.js, dotenv
```

<br/>

# Google Sheet Shape

The bot pulls data from the Google Sheet in order to compile a list of valid characters (Masters, Servants, and NPCs) and players. The sheet names are appropriately: Servants, Masters, Players, NPCs. You can see the necessary structure of the sheets below: 

<br/>
<img width="1199" alt="Servant Shape" src="https://user-images.githubusercontent.com/72323090/178381487-d773f7dd-a426-4040-bc6c-628e93671789.png">
<img width="1316" alt="Master Shape" src="https://user-images.githubusercontent.com/72323090/178381506-7fc41127-c525-4b22-a20a-51bd95dab908.png">
<img width="595" alt="Player Shape" src="https://user-images.githubusercontent.com/72323090/178381512-f63c9998-7294-44f7-b9e7-69431921e0fe.png">
<img width="1249" alt="NPC Shape" src="https://user-images.githubusercontent.com/72323090/178381518-8cdf09b9-af16-4746-9115-0de0c2a71642.png">
<br/>

*The image field of all characters requires a Discord message link containing the desired image.*

<br/>

# Running the Bot

Once the bot is ready, you can run the command `node daffybot.js` in order to start the bot. You should be in the repo directory when you run this command.

In the Discord application, in a server and channel the bot has access to, you can run `-help` to get a full list of valid commands and functionality. 

