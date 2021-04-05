# BitcoinZ VaultZ Info
Official VaultZ website : https://vaultz.btcz.app


## About

BtcZ-VaultZ-Info is an info board about the actual balance at block height of the community VaultZ.

With the implementation of VaultZ (a fair system for gathering Community funds with 5% donation from all the mining rewards), it is more obvious that we are going to need a certain frame of rules for the best usage of those funds.

Read more informations about the motivation of the VaultZ project in the official [BitcoinZ Forum](https://forum.btcz.rocks/t/a-new-community-funding-mechanism/843) thread.



## How to use this

If you already host a website, see [Online usage](#OnlineUsage) section to know how to get some live statistics and widgets about the BitcoinZ blockchain by pulling info online (without fullnode needs).

You can also fork this project and run it on your own server if you want. See below some basic informations about installation and configuration of this nodejs application. You can also contribute to add new functionalities or modify displayed informations by creating a PR.

Some informations hare updated manually, like the VaultZ payouts and and infra annual costs. See more details how this is managed in the [Update guideline](#guideline) section.



#### Requirements

* Nodejs v8.x.x
* Linux VPS (probably)
* PM2
* Apache2 (or other)
* Domain (IP) and DNS access



#### Installation

Clone from github source and test the info board:
```shell
git clone https://github.com/MarceluCH/BtcZ-VaultZ-Info.git
cd BtcZ-VaultZ-Info
npm install
npm start
```
The info board will respond at localhost on port 2555 (by default).   
`curl http://localhost:2255`



#### Application configuration
Setup some nodejs application parameters in the [config.js](config.js) file:

```javascript
// Configure the server port and informations update interval.
server: {
  port: 2255,
  updateEveryMinutes: 5,
},
...

// Add others available API to get infos from the blockchain.
// The application will loop trough all and break by the first available.
blockchain: {
  api: [
    {url:"https://explorer.btcz.app", type: "insight"},
    {url:"https://btczexplorer.blockhub.info", type: "iquidus"},
    {url:"https://explorer.btcz.rocks", type: "insight"},
  ],
...

// Same for the rate API.
rate: {
  api: [
    "https://masq.btcz.rocks/rates",
    "https://masq.btcz.app/rates",
  ],

  // Remove or add here some others fiat currencies.
  currency: ['BTC','USD','EUR'],
},
```


#### Apache configuration

For a proper site display, you should add the below lines in your Apache *site-enabled conf* file.  
(Also check for a proper SSL certificate)

```text
<Location />
  ProxyPass http://127.0.0.1:2255
  ProxyPassReverse http://127.0.0.1:2255
</Location>

<Location /images/>
  ProxyPass http://127.0.0.1:2255/images/
  ProxyPassReverse http://127.0.0.1:2255/images/
</Location>

<Location /js/>
  ProxyPass http://127.0.0.1:2255/js/
  ProxyPassReverse http://127.0.0.1:2255/js/
</Location>

<Location /css/>
  ProxyPass http://127.0.0.1:2255/css/
  ProxyPassReverse http://127.0.0.1:2255/css/
</Location>

<Location /api/>
  ProxyPass http://127.0.0.1:2255/api/
  ProxyPassReverse http://127.0.0.1:2255/api/
</Location>

<Location /api >
  ProxyPass http://127.0.0.1:2255/api
  ProxyPassReverse http://127.0.0.1:2255/api
</Location>
```



## <a name="OnlineUsage"></a>Online usage
You can directly get some basic API calls and HTML widgets from the official [BTCzApp Team VaultZ website](https://vaultz.btcz.app).



#### Halving countdown widgets

Place the below HTML DIV tag in your source page where you will display the countdown.  
Note: The function call `load_js(); setInterval(..);` can be placed at end of page to not differ the rest of the page loading.

```html
<div id="btcz-halving-countdown" display="full2">
  <script>
    function load_js() {
      var element = document.getElementById("btcz-halving-countdown-script");
      if (!!element) element.parentNode.removeChild(element);
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.id = "btcz-halving-countdown-script"
      script.src= 'https://vaultz.btcz.app/js/halvingcountdown.js';
      head.appendChild(script);
    }
    load_js();
    setInterval(function(){ load_js();}, 100*1000);
  </script>
</div>
```

You can change the `display="full2"` attribut as below for different returns.
```
fulldatetime      Sat Oct 09 2021 10:03:09 GMT+0200 (Central European Summer Time)
countdown1        216d 12h 32m 26s
countdown2        216:11:26:54
full1             216d 12h 32m 26s <br/> Sat Oct 09 2021 09:56:46 GMT+0200 (Central European Summer Time)
full2             216:11:26:54 <br/> Sat Oct 09 2021 09:56:46 GMT+0200 (Central European Summer Time)
```



#### API calls
For live values make a GET request to uri : https://vaultz.btcz.app/api  
It returns a JSON like below.
```json
// 20210405003005
// https://vaultz.btcz.app/api

{
  "BlockHeight": 729803,
  "BlockHeightDate": "Mon Apr 05 2021 00:27:17 GMT+0200 (CEST)",
  "AddressesCount": 100,
  "AddressesList": [
    "t3eC2B44yVkyj7Q7RMkfBhkDisc4ieYtv5d",
    "t3cwTuGvHTkQc5ym8K39HkQRqgUeovcVXTy",
    ...
    "t3bi7pnM4mQ6RbQZwufGDt9m2uNnxHNBk37"
  ],
  "AddressesInUseCount": 21,
  "AddressesInUseDetails": [
    {
      "address": "t3SQTn4JtTXu8GurZsCzQx5xxH8MqJQ7iii",
      "balance": 8750625
    },
    ...
    {
      "address": "t3cESR3q2Hh6mJbyC6ZBu4Jz8Dp1t7mbHLY",
      "balance": 1095000
    }
  ],
  "Balance": 176107534.9739337,
  "Rates": [
    {
      "code": "BTC",
      "name": "Bitcoin",
      "rate": 5.3e-9,
      "value": 0.9333699353618486
    },
    {
      "code": "USD",
      "name": "US Dollar",
      "rate": 0.000307558523,
      "value": 54163.37334575389
    },
    {
      "code": "EUR",
      "name": "Eurozone Euro",
      "rate": 0.000261425627,
      "value": 46039.022749985044
    }
  ]
}
```



## <a name="guideline"></a>Update guideline

All update should be a part of PR process. Especialy the one concerning manual payouts table info.   
...To be completet ...

See also the [VaultZ-payouts.js](VaultZ-payouts.js) file to add payouts to the list.  
New project completed schould be added here manually.

```
{
  'name': "",
  'description': "",
  'btcz': "",
  'txid': "",
  'date': "",
  'block': "",
  'status': ""
},
```
