"use strict";

const NodeHelper = require("node_helper");
const tibber = require("./tibber");

module.exports = NodeHelper.create({
  start: function() {
    console.log(this.name + ": Starting node helper");
    this.loaded = false;
  },

  log: function(...args) {
    if (this.config.logging) {
      console.log(args);
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "TIBBER_CONFIG") {
      var config = payload;
      this.config = config;
      this.loaded = true;
      let self = this;

      if (config.showConsumptionInfo) this.readTibberConsumption(config);
      if (config.showPriceInfo) this.readTibberPrices(config);
      setInterval(function() {
		if (config.showConsumptionInfo) self.readTibberConsumption(config);
		if (config.showPriceInfo) self.readTibberPrices(config);
      }, 1000 * 60 * 60); // Every hour
    }
  },

  readTibberConsumption: function(config) {
    this.log("readTibberConsumption");
    let consumption = {
      lastHour: null,
      lastDay: null,
      lastWeek: null,
      lastMonth: null,
      annual: null,
    };
    tibber
      .getConsumption(config.tibberToken)
      .then(res => {
        consumption.lastHour = res.lastHourConsumption;
        consumption.lastDay = res.lastDayConsumption;
        consumption.lastWeek = res.lastWeekConsumption;
        consumption.lastMonth = res.lastMonthConsumption;
        consumption.annual = res.annualConsumption;
        this.log("Tibber consumption: ", JSON.stringify(consumption));
        this.sendSocketNotification("TIBBER_CONSUMPTION_DATA", consumption);
      })
      .catch(e => {
        console.log("Error getting Tibber consumption: ", e);
      });
  },

  readTibberPrices: function(config) {
    this.log("readTibberPrices");
    let prices = {
      current: null,
      twoDays: []
    };
    tibber
      .getPrices(config.tibberToken)
      .then(res => {
        prices.current = res.current.total;
        // prices.twoDays = res.today;
        prices.twoDays = res.today.concat(res.tomorrow);
        this.log("Tibber prices: ", JSON.stringify(prices));
        this.sendSocketNotification("TIBBER_PRICE_DATA", prices);
      })
      .catch(e => {
        console.log("Error getting Tibber prices: ", e);
      });
  }
});
