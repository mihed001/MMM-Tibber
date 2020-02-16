
const RP = require('request-promise');

const gqlEndpoint = "https://api.tibber.com/v1-beta/gql"
// const subEndpoint = "wss://api.tibber.com/v1-beta/gql/subscriptions"

// Reference: https://developer.tibber.com/docs/reference#priceinfo
const queryPrice = `{ "query": "{  
    viewer{  
     homes {
       currentSubscription {
         priceInfo {
           current {
             total
             startsAt
             level
           }
           today {
             total
             startsAt
             level
           }
           tomorrow {
             total
             startsAt
             level
           }
         }
       }
     }
    }  
 }" }`

const queryConsumption = `{ "query": "{  
  viewer {
    homes {
      lastHourConsumption: consumption(resolution: HOURLY, last: 1) {
        nodes {
          from
          to
          unitPrice
          unitPriceVAT
          cost
          consumption
          consumptionUnit
        }
      }
      lastDayConsumption: consumption(resolution: DAILY, last: 1) {
        nodes {
          from
          to
          unitPrice
          unitPriceVAT
          cost
          consumption
          consumptionUnit
        }
      }
      lastWeekConsumption: consumption(resolution: WEEKLY, last: 1) {
        nodes {
          from
          to
          unitPrice
          unitPriceVAT
          cost
          consumption
          consumptionUnit
        }
      }
      lastMonthConsumption: consumption(resolution: MONTHLY, last: 1) {
        nodes {
          from
          to
          unitPrice
          unitPriceVAT
          cost
          consumption
          consumptionUnit
        }
      }
      lastAnnualConsumption: consumption(resolution: ANNUAL, last: 1) {
        nodes {
          from
          to
          unitPrice
          unitPriceVAT
          cost
          consumption
          consumptionUnit
        }
      }
    }
  }
 }" }`
 
const rp = require('request-promise');

exports.getConsumption = function (tibberToken) {
    return new Promise((resolve, reject) => {
        rp({
            headers: {
                'Authorization': 'Bearer ' + tibberToken,
                'Content-Type': 'application/json'
            },
            uri: gqlEndpoint,
            body: queryConsumption.replace(/\n/g, ''),
            method: 'POST',
            resolveWithFullResponse: true,
            followRedirect: false,
        })
            .then(res => {
                resO = JSON.parse(res.body);
                resolve(resO.data.viewer.homes[0])
            })
            .catch(e => {
                reject(e)
            })
    })
}

exports.getPrices = function (tibberToken) {
    return new Promise((resolve, reject) => {
        rp({
            headers: {
                'Authorization': 'Bearer ' + tibberToken,
                'Content-Type': 'application/json'
            },
            uri: gqlEndpoint,
            body: queryPrice.replace(/\n/g, ''),
            method: 'POST',
            resolveWithFullResponse: true,
            followRedirect: false,
        })
            .then(res => {
                resO = JSON.parse(res.body);
                resolve(resO.data.viewer.homes[0].currentSubscription.priceInfo)
            })
            .catch(e => {
                reject(e)
            })
    })
}
