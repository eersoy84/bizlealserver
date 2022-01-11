var Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
    apiKey: 'sandbox-2K7KQygZsZp9zoBh62dQwQ8jjFp86Fcg',
    secretKey: 'sandbox-vNH8l6EdAQdCHh8MvFNklsXi4EiDWYw6',
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