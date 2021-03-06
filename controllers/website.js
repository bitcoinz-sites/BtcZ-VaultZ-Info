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


const express = require('express')
const router = express.Router()
const path = require('path');
const rp = require('request-promise-native')

// Format number as strings xxx xxx xxx.xxx
function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}


// Route for the api json return info
router.get('/api', function (req, res) {
  (async function () {



  return res.send(JSON.stringify(global.vaultZ))


  })().catch((error) => {
    console.error('/api', [ error.message, error.stack ])
    return res.send(JSON.stringify({'error': 'API error, please contact the pay.btcz.app admin'}))
  }) // end async function
})







// Route for the api json return info
router.get('/js/halvingcountdown.js', function (req, res) {
  (async function () {


    let apiCallStr_count = "https://btczexplorer.blockhub.info/api/getblockcount";
    let APIreq = {method: 'GET', uri: apiCallStr_count};
    await rp(APIreq).then(response => {
      global.BlockHeightNow = response;
    }).catch((err) => {
      console.error('RetreiveVaultZinfo get blockchain', [ err.message, err.stack ])
    });




  return res.render(path.join(__dirname + '/../docs/js/halvingcountdown.js'), {

      BlockHeiht: global.BlockHeightNow

  });


  })().catch((error) => {
    console.error('/api', [ error.message, error.stack ])
    return res.send(JSON.stringify({'error': 'API error, please contact the pay.btcz.app admin'}))
  }) // end async function
})









// Route for the index main page
router.get('/', function (req, res) {
  (async function () {

    let BTC_val = 0;
    let USD_val = 0;
    for (item of global.vaultZ.Rates){
      if(item.code=="USD"){USD_val=item.value}
      if(item.code=="BTC"){BTC_val=item.value}
    }



    // Render page
    return res.render(path.join(__dirname + '/../docs/index.html'), {
        VaultZ_Tot: numberWithSpaces(global.vaultZ.Balance.toFixed(0)),


        USD_Tot: numberWithSpaces(USD_val.toFixed(0)),
        BTC_Tot: numberWithSpaces(BTC_val.toFixed(3)),


        VaultZ_Add_Count: global.vaultZ.AddressesCount,
        VaultZ_Add_Used_Count: global.vaultZ.AddressesInUseCount,
        BlockHeiht: numberWithSpaces(global.vaultZ.BlockHeight),
        DateAtBlock: global.vaultZ.BlockHeightDate
    });








  })().catch((error) => {
    console.error('/', [ error.message, error.stack ])
    return res.status(500).send('500')
  }) // end async function
})















router.use(function (req, res) {
  res.status(404).send('404')
})



module.exports = router
