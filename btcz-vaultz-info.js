/*
 * Copyright 2021 The BitcoinZ Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHTHOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const express = require('express')
const app = express()
const morgan = require('morgan')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const rp = require('request-promise-native')
const config = require('./config')

const VaultZ = require('./VaultZ-addresses');
const VaultZaddr = VaultZ.addresses


morgan.token('id', function getId (req) {
  return req.id
})


// Application options
app.use(function (req, res, next) {
  req.id = uuid.v4()
  next()
})
app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] \
    ":method :url HTTP/:http-version" :status :res[content-length] \
    ":referrer" ":user-agent"'))
app.set('trust proxy', 'loopback')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json(null))


// WebApp needed path
app.use('/qr', express.static('qr'))
app.use('/css', express.static('docs/css'))
app.use('/js', express.static('docs/js'))
app.use('/images', express.static('docs/images'))
app.use(require('./controllers/website'))


// For EJS rendering
app.set('views', __dirname + '/docs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');







// Define Global VaultZ variables structure
global.vaultZ = {
  BlockHeight: 0,
  BlockHeightDate: Date(),
  AddressesCount: VaultZaddr.length,
  AddressesList: VaultZaddr,
  AddressesInUseCount: 0,
  Balance: 0,
  Rates: []
};








// Retreive VaultZ info function
async function RetreiveVaultZinfo () {
  try {


    let apiCallStr = "";
    let APIreq = {};
    let apiType = "";









    // Set blockchain API informations
    // Get it from the blockchain API array in config file
    // Also check if its iquidus or insight
    for (i = 0; i < config.blockchain.api.length; i++){

      global.vaultZ.BlockHeight = 0;
      global.vaultZ.BlockHeightDate = Date();
      global.vaultZ.Balance = 0;
      global.vaultZ.AddressesInUseCount = 0;

      let apiCallStr_count = "";
      let apiCallStr_bal = "";
      apiCallStr = config.blockchain.api[i].url;
      apiType = config.blockchain.api[i].type;

      if (apiType == "iquidus"){ //     ------------------------------------- If IQUIDUS API

        // Get block height
        apiCallStr_count = apiCallStr+"/api/getblockcount";
        APIreq = {method: 'GET', uri: apiCallStr_count};
        await rp(APIreq).then(response => {
          global.vaultZ.BlockHeight = response;
        }).catch((err) => {
          console.error('RetreiveVaultZinfo get blockchain', [ err.message, err.stack ])
        });

        // Get adresses balances and used count
        for (item of VaultZaddr){
          apiCallStr_bal = apiCallStr+"/ext/getbalance/"+item;
          APIreq = {method: 'GET', uri: apiCallStr_bal};

          await rp(APIreq).then(response => {
            if (!response.includes("address not found.") && Number(response)>=10){
              global.vaultZ.AddressesInUseCount ++;
              global.vaultZ.Balance += Number(response);
            }
          }).catch((err) => {
            console.error('RetreiveVaultZinfo get blockchain', [ err.message, err.stack ])
          });
        }

      } else if (apiType == "insight") { //    --------------------------------- If INSIGHT API

        // Get block height
        apiCallStr_count = apiCallStr+"/api/status";
        APIreq = {method: 'GET', uri: apiCallStr_count};
        await rp(APIreq).then(response => {
          global.vaultZ.BlockHeight = JSON.parse(response).info.blocks;
        }).catch((err) => {
          console.error('RetreiveVaultZinfo get blockchain', [ err.message, err.stack ])
        });

        // Get adresses balances and used count
        for (item of VaultZaddr){
          apiCallStr_bal = apiCallStr+"/api/addr/"+item+"/balance";
          APIreq = {method: 'GET', uri: apiCallStr_bal};

          await rp(APIreq).then(response => {
            if (!response.includes("Invalid address: Checksum mismatch. Code:1") && Number(response)>=10){
              global.vaultZ.AddressesInUseCount ++;
              global.vaultZ.Balance += Number(response)/100000000;
            }
          }).catch((err) => {
            console.error('RetreiveVaultZinfo get blockchain', [ err.message, err.stack ])
          });
        }

      }

      if (global.vaultZ.BlockHeight>0){
        console.log('RetreiveVaultZinfo get blockchain', vaultZ);
        break;
      }
    }


    if (global.vaultZ.BlockHeight<1){
      global.vaultZ = {"error": "No blockchain info set."};
      console.log('RetreiveVaultZinfo get blockchain', "No blockchain info set.");
      return;
    }




    // Set existing currency rates informations
    // Get it from the rate API array in config file
    global.vaultZ.Rates = [];
    for (i = 0; i < config.rate.api.length; i++){
      apiCallStr = config.rate.api[i];
      APIreq = {method: 'GET', uri: apiCallStr};

      await rp(APIreq).then(response => {
         for (item of JSON.parse(response)){
           if (config.rate.currency.includes(item.code)) {
             global.vaultZ.Rates.push({"code":item.code,"name":item.name,"rate":item.rate, "value":item.rate*global.vaultZ.Balance})
           }
         }
      }).catch((err) => {
        console.error('RetreiveVaultZinfo get currency', [ err.message, err.stack ])
      });

      if (global.vaultZ.Rates.length>0){
        console.log('RetreiveVaultZinfo get currency', global.vaultZ.Rates);
        break;
      }
    }

    if (global.vaultZ.Rates.length<1){
      console.log('RetreiveVaultZinfo get currency', "No currency rates set.");
    }






  } catch (error) {
    console.error('RetreiveVaultZinfo function', [ error.message, error.stack ])
  }
}






// Call the VaultZ info each n minutes.
RetreiveVaultZinfo()
setInterval(() => RetreiveVaultZinfo(), 60 * 1000 * config.server.updateEveryMinutes)



// Startup server
let server = app.listen(config.server.port, '127.0.0.1', function () {
  console.log('BOOTING UP', `Listening on port ${config.server.port}`)
})



module.exports = server
