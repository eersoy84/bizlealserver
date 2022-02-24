const { iyzipay } = require('../config/iyzipay')
const httpStatus = require('http-status');

const createOrderRequest = (request) => {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutFormInitialize.create(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })
}


const createSubMerchant = (request) => {
    return new Promise((resolve, reject) => {
        iyzipay.subMerchant.create(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })

}

const approveSubMerchant = (request, callback) => {
    return new Promise((resolve, reject) => {
        iyzipay.subMerchant.approve(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })
}
const createRetrieveOrder = (request) => {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutForm.retrieve(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })
}

const approvePayment = (request) => {
    return new Promise((resolve, reject) => {
        iyzipay.approval.create(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })
}
const disapprovePayment = (request) => {
    return new Promise((resolve, reject) => {
        iyzipay.disapproval.create(request, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.status !== 'success') {
                return reject(result)
            }
            resolve(result)
        });
    })
}


module.exports = {
    createOrderRequest,
    createSubMerchant,
    approveSubMerchant,
    createRetrieveOrder,
    approvePayment,
    disapprovePayment
}

