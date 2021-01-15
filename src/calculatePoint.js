const dayjs = require('dayjs')

let datenow = dayjs().format('DD/MMM/YYYY hh:mm:ss A')

function promotionDalta(priceRiseStartDate, priceRiseEndDate) {
  //เช็คว่ามีโปรโมชั่นไหม และอยู่ในช่วงโปรโมชั่นไหม
  return priceRiseStartDate && priceRiseEndDate && dayjs(datenow).isBefore(priceRiseEndDate) && dayjs(datenow).isAfter(priceRiseStartDate)
    ? currentProduct.samePriseDelta : 1
}

module.exports = {
  pointOil: function (volumn, maxCapabilityOil, currentProduct) {
    const promotion = promotionDalta(currentProduct.priceRiseStartDate, currentProduct.priceRiseEndDate)
    //คำนวณว่า จำนวนน้ำมันที่เติมมาเกินจำนวนที่จำกัดที่นำไปคำนวณ Point ต่อวันหรือไม่
    let newVolumn = volumn > maxCapabilityOil ? maxCapabilityOil : volumn 

    if (currentProduct.ProductGroup === 'Gasohol') {
      if (memberCardType != 'Normal') {
        return (newVolumn * 1.25) * promotion
      } else {
        return (newVolumn * 1) * promotion
      }
    } else if (currentProduct.ProductGroup === 'Diesel') {
      if (memberCardType != 'Normal') {
        return (newVolumn / 2) * 1 * promotion
      } else {
        return (newVolumn / 4) * 1 * promotion
      }
    }
  },

  pointNonOil: async (price, maxCapabilityNonOil, currentProduct) => {
    const promotion = promotionDalta(currentProduct.priceRiseStartDate, currentProduct.priceRiseEndDate)
    //คำนวณว่า จำนวนเงินที่จ่ายเกินจำนวนที่จำกัดที่นำไปคำนวณ Point ต่อวันหรือไม่
    let newPrice = price > maxCapabilityNonOil ? maxCapabilityNonOil : price
    return newPrice / 25 * promotion
  }
}