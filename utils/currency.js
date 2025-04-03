export const formatPrice = (amount, currency) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    // Convert amount if needed
    const convertedAmount = amount * (currency.rate || 1);
  
    return formatter.format(convertedAmount);
  };
  
  export const convertCurrency = (amount, fromRate, toRate) => {
    return (amount / fromRate) * toRate;
  };
  
  export const getCurrencySymbol = (code) => {
    const symbols = {
      USD: '$',
      GBP: '£',
      KES: 'KSh',
      NGN: '₦',
      ZAR: 'R',
      INR: '₹',
      AED: 'د.إ'
    };
    return symbols[code] || '$';
  };