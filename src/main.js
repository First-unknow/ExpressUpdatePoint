const express = require('express')
const bodyParser = require('body-parser')

const readCSV = require('./readCSV');
const calculatePoint = require('./calculatePoint')

const app = express()

require('dotenv').config()

app.use(bodyParser.json())

app.post('/updatePoint', async (req, res) => {
  const memberId = req.body.memberId
  const productCode = req.body.productCode
  const terminalId = req.body.terminalId
  const volumn = req.body.volumn
  const price = req.body.price

  if (Object.getOwnPropertyNames(req.body).length == 0) {
    res.status(400).send('Bad Request');
  }

  if ((Object.keys(memberId).length === 0) || (Object.keys(productCode).length === 0) || (Object.keys(terminalId).length === 0)
    || (Object.keys(volumn).length === 0) || (Object.keys(price).length === 0)) {
    res.status(403).send('Forbidden');
  }
  try {

    const currentMember = await readCSV.findMember(memberId)
    const currentProduct = await readCSV.findProduct(productCode)

    //เช็คว่าเจอ member ไหม
    if (Object.keys(currentMember).length === 0 && currentMember.constructor === Object) {
      res.status(404).send('Not found');
    }

    //เช็คว่าเจอ product ไหม
    if (Object.keys(currentProduct).length === 0 && currentProduct.constructor === Object) {
      res.status(404).send('Not found');
    }

    let mockupRes = {
      memberId: memberId,
      productName: currentProduct.productName,
      receivePoint: 0
    }
    
    if (currentProduct.productType === 'Oil') {
      const maxCapabilityOil = await readCSV.findCapabilityOil(currentMember.memberClass, currentProduct.ProductGroup)
      
      mockupRes.receivePoint = calculatePoint.pointOil(volumn, maxCapabilityOil, currentProduct, currentMember.cardType)
      res.status(202).json(mockupRes)

    } else if (currentProduct.productType === 'Non-Oil') {
      const maxCapabilityNonOil = await readCSV.findCapabilityNonOil(await readCSV.findBuSize(terminalId))

      mockupRes.receivePoint = await calculatePoint.pointNonOil(price, maxCapabilityNonOil, currentProduct)
      res.status(202).json(mockupRes)

    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    console.log("🚀 ~ file: main.js ~ line 122 ~ app.post ~ e", e)
    res.status(400).send('Bad Request')
  }
})

app.listen(7000, () => {
  console.log('Start server at port 7000.')
})

