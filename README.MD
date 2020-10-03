# Gain Capital API

## Uses node.js and lightstreamer-client (7.2.4) to get real time market data from GainCapital

## Usage: 

## 1. Install git --> https://git-scm.com/downloads
## 2. Install Node.js --> https://nodejs.org/en/download/
```sh
# Install Node.js v14.x (change the '14' to '12' or '10' to downgrade)
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
```
## 3. Enter a working directory then use these commands
```sh
$ git clone https://github.com/luke-ols0/gain-capital-api-js.git
$ cd gain-capital-api-js
```
## 4. Create a file named .env located in your currenty directory
```sh
# The touch command creates a .env file so store environment variables
$ touch .env
# Open this .env file with any text editor such as vim, vscode, or notepad. Then paste in this text with your correct username, password, and app key from gaincapital. You can also choose any port number that is open.
APP_USERNAME=YourUsername
APP_PASSWORD=YourPassword
APP_KEY=YourAppKey
PORT=3333
```
## 5. Run npm install
```sh
# npm will install all of your dependencies for you
$ npm install
```
## 6. Now choose a command to run the express server, or price build
```sh
# To run the express API server (OR: yarn run express)
$ npm run express 
# To run the command line build WITH parameter (OR: yarn run express)
# npm run build <Query> - You can search any currency and get results
$ npm run build usd
# OR:
$ npm run build eur
# OR: 
$ npm run build gbp/usd
```





