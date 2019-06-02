/*
 * Copyright 2019 The BitcoinZ Project
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
const uuid = require('node-uuid')
const bodyParser = require('body-parser')
const rp = require('request-promise')
const config = require('./config')

const VaultZ = require('./VaultZ-addresses');
const VaultZadd = VaultZ.addresses


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


// Define Global variable
global.BlockHeight = 0;                     // The Actual block height
global.DateAtBlock = Date();                // Get the date at block height

global.AddressesCount = VaultZadd.length;   // VaultZ Addresses count
global.AddressesList = VaultZadd;           // VaultZ Addresses list []
global.AddressesBalance = [];               // VaultZ Addresses balance []

global.VaultZ_used_addresses = 0;           // VaultZ used addresses count
global.VaultZ_Tot = 0;                      // VaultZ Actual TOT Balance

global.usdValue = 0;


// Retreive VaultZ info function
async function RetreiveVaultZinfo () {
  try {

    let usdRate = 0;

    // get the exchange rate
    let apiCall = "http://pay.btcz.app/api/get_btcz_rate";
    let requestOptions = {
      method: 'GET',
      uri: apiCall
    };

    await rp(requestOptions).then(response => {
       const objectValue = JSON.parse(response);
       usdRate = Number(objectValue.USD);
    }).catch((err) => {
      console.error({ err })
    });

    // get the block height
    apiCall = "http://btczexplorer.blockhub.info/api/getblockcount";
    requestOptions = {
      method: 'GET',
      uri: apiCall
    };

    await rp(requestOptions).then(response => {
      global.BlockHeight = response;
    }).catch((err) => {
      console.error({ err })
    });

    global.DateAtBlock = Date();

    let CountUsed = 0;
    let Tot = 0;
    let i = -1;
    for (item of VaultZadd){  // loop around the addresses
      i++;

      // Get the balance of this address
      apiCall = "http://btczexplorer.blockhub.info/ext/getbalance/"+item;
      requestOptions = {
        method: 'GET',
        uri: apiCall
      };



      await rp(requestOptions).then(response => {
        if (!response.includes("address not found.")){
          CountUsed += 1;
          global.AddressesBalance[i] = Number(response);
          Tot += Number(response);
        }
      }).catch((err) => {
        console.error({ err })
      });


    } // End for

    global.VaultZ_used_addresses = CountUsed;
    global.VaultZ_Tot = numberWithSpaces(Tot);


    global.usdValue = numberWithSpaces((Tot*usdRate).toFixed(2))


  } catch (error) {
    console.error('RetreiveVaultZinfo function', [ error.message, error.stack ])
  } // end try
}

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}


// Call the VaultZ info each 5 minutes.
RetreiveVaultZinfo()
setInterval(() => RetreiveVaultZinfo(), 60 * 1000 *5)


// Startup server
let server = app.listen(config.port, '127.0.0.1', function () {
  console.log('BOOTING UP', ['Listening on port %d', config.port])
})

module.exports = server
