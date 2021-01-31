module.exports = {
  server: {
    port: 2255,
    updateEveryMinutes: 5,
  },
  blockchain: {
    api: [
      {url:"https://explorer.btcz.app", type: "insight"},
      {url:"https://btczexplorer.blockhub.info", type: "iquidus"},
      {url:"https://explorer.btcz.rocks", type: "insight"},
    ],
  },
  rate: {
    api: [
      "https://masq.btcz.rocks/rates",
      "https://masq.btcz.app/rates",
    ],
    currency: ['BTC','USD','EUR'],
  },
}
