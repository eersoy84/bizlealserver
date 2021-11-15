const formattedPrice = (value) => {
    return `${value?.toLocaleString(undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}${' '}₺`;

}

module.exports = {
    formattedPrice,
  };