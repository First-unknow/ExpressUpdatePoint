const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
  findMember: function (memberId) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(process.env.MEMBER)
        .on('error', error => {
          reject(error);
        })
        .pipe(csv())
        .on('data', (row) => {
          if (memberId.length === 10) {
            if (row.mobileNumber === memberId) {
              resolve(row)
            }
          } else if (memberId.length === 16) {
            if (row.cardNumber === memberId) {
              resolve(row)
            }
          }
        })
    })
  },

  findProduct: function (productCode) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(process.env.PRODUCT)
        .on('error', error => {
          reject(error);
        })
        .pipe(csv())
        .on('data', (row) => {
          if (row.productCode === productCode) {
            resolve(row)
          }
        })
    })
  },

  findBuSize: function (terminalId) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(process.env.MERCHANT)
        .on('error', error => {
          reject(error);
        })
        .pipe(csv())
        .on('data', (row) => {
          if (row.terminalID === terminalId) {
            resolve(row.buSize === '' ? 'Default' : row.buSize)
          }
        })
    })
  },

  findCapabilityOil: function (memberClass, productGroup) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(process.env.CAPABILITY_OIL)
        .on('error', error => {
          reject(error);
        })
        .pipe(csv())
        .on('data', (row) => {
          if (row.memberClass === (memberClass === '' ? 'Default' : memberClass) && row.productGroup === productGroup) {
            resolve(row.capTime)
          }
        })
    })
  },

  findCapabilityNonOil: function (merchantBuSize) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(process.env.CAPABILITY_NON_OIL)
        .on('error', error => {
          reject(error);
        })
        .pipe(csv())
        .on('data', (row) => {
          if (row.buSize === merchantBuSize) {
            resolve(row.capTime)
          }
        })
    })
  },

}

