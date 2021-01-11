const express = require('express')
const bodyParser = require('body-parser')
const dayjs = require('dayjs')
const csv = require('csv-parser');
const fs = require('fs');

const app = express()

require('dotenv').config()

app.use(bodyParser.json())

app.post('/updatePoint', async (req, res, next) => {
  const memberId = req.body.memberId
  const productCode = req.body.productCode
  const terminalId = req.body.terminalId
  const volumn = req.body.volumn
  const price = req.body.price

  var memberObj = {}
  var productObj = {}
  fs.createReadStream(process.env.MEMBER)
    .pipe(csv())
    .on('data', (row) => {
      if (memberId.length === 10) {
        if (row.mobileNumber === memberId) {
          memberObj = row
        }
      } else if (memberId.length === 16) {
        if (row.cardNumber === memberId) {
          memberObj = row
        }
      }
    }).on('end', () => {
      if (Object.keys(memberObj).length === 0 && memberObj.constructor === Object) {
        res.status(404).send('Not found');
      }
      fs.createReadStream(process.env.PRODUCT)
        .pipe(csv())
        .on('data', (row) => {
          if (row.productCode === productCode) {
            productObj = row
          }
        }).on('end', () => {
          if (Object.keys(productObj).length === 0 && productObj.constructor === Object) {
            res.status(404).send('Not found');
          }
          var mockJSON = {
            memberId: memberId,
            productName: productObj.productName,
            receivePoint: 0
          }
          let datenow = dayjs().format('DD/MMM/YYYY hh:mm:ss A')
          const promotionDalta = productObj.priceRiseStartDate && productObj.priceRiseEndDate
            ? dayjs(datenow).isBefore(productObj.priceRiseEndDate) && dayjs(datenow).isAfter(productObj.priceRiseStartDate)
              ? productObj.samePriseDelta : 1 : 1
          var capability;
          if (productObj.productType === 'Oil') {
            fs.createReadStream(process.env.CAPABILITY_OIL)
              .pipe(csv())
              .on('data', (row) => {
                if (row.memberClass === (memberObj.memberClass === '' ? 'Default' : memberObj.memberClass) && row.productGroup === productObj.ProductGroup) {
                  capability = row.capTime
                }
              }).on('end', () => {
                let newVolumn = volumn > capability ? capability : volumn
                if (productObj.ProductGroup === 'Gasohol') {
                  if (memberObj.cardType != 'Normal') {
                    mockJSON.receivePoint = newVolumn * 1.25 * promotionDalta
                  } else {
                    mockJSON.receivePoint = newVolumn * 1 * promotionDalta
                  }
                } else if (productObj.ProductGroup === 'Diesel') {
                  if (memberObj.cardType != 'Normal') {
                    mockJSON.receivePoint = (newVolumn / 2) * 1 * promotionDalta
                  } else {
                    mockJSON.receivePoint = (newVolumn / 4) * 1 * promotionDalta
                  }
                }
                res.status(202).json(mockJSON)
              })
          } else if (productObj.productType === 'Non-Oil') {
            var merchantBuSize;
            fs.createReadStream(process.env.MERCHANT)
              .pipe(csv())
              .on('data', (row) => {
                if (row.terminalID === terminalId) {
                  merchantBuSize = row.buSize === '' ? 'Default' : row.buSize
                }
              }).on('end', () => {
                if (merchantBuSize === undefined){
                  res.status(404).send('Not found');
                }
                fs.createReadStream(process.env.CAPABILITY_NON_OIL)
                  .pipe(csv())
                  .on('data', (row) => {
                    if (row.buSize === merchantBuSize) {
                      capability = row.capTime
                    }
                  }).on('end', () => {
                    let newPrice = price > capability ? capability : price
                    const receivePoint = newPrice / 25 * promotionDalta
                    mockJSON.receivePoint = receivePoint
                    res.status(202).json(mockJSON)
                  })
              })
          } else {
            res.status(404)
          }
        })
    });
})

app.listen(7000, () => {
  console.log('Start server at port 7000.')
})

