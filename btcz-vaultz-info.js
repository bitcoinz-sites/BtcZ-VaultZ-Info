


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



// Retreive VaultZ info function
async function RetreiveVaultZinfo () {
  try {

    // get the block height
    let apiCall = "http://btczexplorer.blockhub.info/api/getblockcount";
    let requestOptions = {
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
        } else {
          global.AddressesBalance[i] = 0;
        }
      }).catch((err) => {
        console.error({ err })
      });


    } // End for

    global.VaultZ_used_addresses = CountUsed;
    global.VaultZ_Tot = Tot;


  } catch (error) {
    console.error('RetreiveVaultZinfo function', [ error.message, error.stack ])
  } // end try
}


// Call the VaultZ info each 5 minutes.
RetreiveVaultZinfo()
setInterval(() => RetreiveVaultZinfo(), 60 * 1000 *5)


// Startup server
let server = app.listen(config.port, '127.0.0.1', function () {
  console.log('BOOTING UP', ['Listening on port %d', config.port])
})

module.exports = server
