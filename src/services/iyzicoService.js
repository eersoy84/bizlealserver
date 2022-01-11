const { iyzipay } = require('../config/iyzipay')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrderRequest = (request, callback) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Ödeme işlemi sırasında hata oluştu")
        }
        if (result.status === 'failure') {
            throw new ApiError(httpStatus.BAD_REQUEST, result.errorMessage)
        }
        callback(result)
    });
}


const createSubMerchant = (request, callback) => {
    iyzipay.subMerchant.create(request, (err, result) => {
        if (err) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Alt tedarikçi oluştururken hata oluştu!")
        }
        if (result.status === 'failure') {
            throw new ApiError(httpStatus.BAD_REQUEST, result.errorMessage)
        }
        callback(result)
    });
}

const approveSubMerchant = (request, callback) => {
    iyzipay.subMerchant.approve(request, (err, result) => {
        if (err) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Alt üye iş yeri oluştururken hata oluştu!")
        }
        if (result.status === 'failure') {
            throw new ApiError(httpStatus.BAD_REQUEST, result.errorMessage)
        }
        callback(result)
    });
}
const createRetrieveOrder = (request, callback) => {
    iyzipay.checkoutForm.retrieve(request, (err, result) => {
        if (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Ödeme işlemi sırasında hata oluştu")
        }
        if (result.status === 'failure') {
            throw new ApiError(httpStatus.BAD_REQUEST, result.errorMessage)
        }
        callback(result)
    });
}


module.exports = {
    createOrderRequest,
    createSubMerchant,
    approveSubMerchant,
    createRetrieveOrder
}

