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


// Route for the index main page
router.get('/', function (req, res) {
  (async function () {


    // Render page
    return res.render(path.join(__dirname + '/../docs/index.html'), {
        VaultZ_Tot: global.VaultZ_Tot,
        USD_Tot: global.usdValue,
        BTC_Tot: global.btcValue,
        VaultZ_Add_Count: global.AddressesCount,
        VaultZ_Add_List: global.AddressesList,
        VaultZ_Add_Bal: global.AddressesBalance,
        VaultZ_Add_Used_Count: global.VaultZ_used_addresses,
        BlockHeiht: global.BlockHeight,
        DateAtBlock: global.DateAtBlock
    });

  })().catch((error) => {
    console.error('/', [ error.message, error.stack ])
    res.status(500).send('500')
  }) // end async function
})



router.use(function (req, res) {
  res.status(404).send('404')
})

module.exports = router
