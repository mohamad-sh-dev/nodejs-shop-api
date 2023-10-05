const jalalimoment = require('jalali-moment');

const invoiceNumberGenerator = () => jalalimoment().format('jYYYYjMMjDDHHMMSS') + String(process.hrtime()[1]).padStart(9, 0);

module.exports = {
    invoiceNumberGenerator
};
