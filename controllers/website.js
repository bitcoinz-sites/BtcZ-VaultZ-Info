


const express = require('express')
const app = express();
const router = express.Router()
const qr = require('qr-image')
const fs = require('fs')
const path = require('path');
const config = require('../config');
const rp = require('request-promise');




// Route for the index main page
router.get('/', function (req, res) {
  (async function () {

    // Render page
    return res.render(path.join(__dirname + '/../docs/index.html'), {
        VaultZ_Tot: global.VaultZ_Tot,
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
