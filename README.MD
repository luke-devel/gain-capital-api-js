#
# <b>Gain Capital API with Lightstreamer</b> 

## Update: This README isnt fully current. To run the base app use:
  ```sh
// Choose any market pair after "express", it is a search query 
// sometimes the order of the two markets matter, and will error if they are misordered
$ npm run express gbp/usd
OR
$ yarn express gbp/usd
```
## To place a buy order of the market pair chosen above (market pair must match):
```sh
make a POST request to http://localhost:3030/placeorder with username and password headers
```
![POST Example](https://i.imgur.com/Co4nIRa.png "POST Example")

## Uses node.js and lightstreamer-client (7.2.4) to get real time market data from GainCapital


## <u>Usage</u>:
## 1. Install git --> https://git-scm.com/downloads
## 2. Install Node.js --> https://nodejs.org/en/download/
## 3. Enter a working directory then use these commands
```sh
$ git clone https://github.com/luke-ols0/gain-capital-api-js.git
$ cd gain-capital-api-js
```
## 4. Create a file named .env located in your currenty directory
```sh
# The touch command creates a file called .env to store environment variables
$ touch .env
# Open this .env file with any text editor such as vim, vscode, or notepad. Then paste in this text with your correct username, password, and app key from gaincapital. You can also choose any port number that is open.
APP_USERNAME=YourUsername
APP_PASSWORD=YourPassword
APP_KEY=YourAppKey
PORT=3030
# Save the .env file
```
## 5. Run npm install
```sh
# npm will install all of your dependencies for you
$ npm install
```
## 6. To run the command line build, with argument
```sh
# To run the command line build WITH parameter
# npm run build <Query> - You can search any currency and get results
$ npm run build usd
# OR:
$ npm run build eur
# OR: 
$ npm run build gbp/usd
```
![Output](https://i.imgur.com/5V4LCiR.png "Console Output")

## 7. To run the express API server
```sh
# To run the express API server (OR: yarn run express)
$ npm run express
```

## 8. How to access the API
```sh
# You will access your express API by using your localhost address and the PORT you set earlier in your .env file.

GET REQEUST TO => http://localhost:3030/markets/getmarketinfo

# You MUST set the 'market' header to whatever you want your market search query to be. 
# set 'username' header to your account username .env value
# set 'password' header to your account password .env value
# This username and password check is only done on your own express server, to make sure that random GET requests to your url doesnt result in API throttling
```
## Use Postman to see the GET request and response data

![Postman](https://i.imgur.com/KwYeLql.png "GET Request With Postman")
