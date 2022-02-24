var Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
    apiKey: 'sandbox-N3PL5uggGNofh05XNXl8z58gejKCjpPc',
    secretKey: 'sandbox-n6kda9314had0abeVNPvWs1uCKcZiWAs',
    uri: 'https://sandbox-api.iyzipay.com'
});
var url;
var redirect_url;
if (process.env.NODE_ENV === "development") {
    url = process.env.DEV_URL
    redirect_url = process.env.REDIRECT_DEV
} else {
    url = process.env.PROD_URL
    redirect_url = process.env.REDIRECT_PROD
}

module.exports = {
    iyzipay,
    Iyzipay,
    url,
    redirect_url
};