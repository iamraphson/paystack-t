const luhn = require('luhn');
const crypto = require('crypto');
class card {
  constructor(options) {
    this.options = options;
  }

  async find() {
    const data = await this.getCards();
    return {
      status: 'success',
      data
    };
  }

  async get(id) {
    const data = await this.getCard(id);
    return {
      status: 'success',
      data
    };
  }

  async create(data) {
    const { card } = data;
    if(!card){
      return {
        status: 'error',
        data: {
          message: 'Enter your card details'
        }
      }
    }
    const isValidCard = this.validateCard(card);
    if (isValidCard) {
      const cardBrand = this.determineCard(card);
      if (!cardBrand) {
        return {
          status: 'error',
          data: {
            message: 'Unknown Brand'
          }
        };
      }
      const _data = {
        _id: crypto.randomBytes(8).toString('hex'),
        card_number: card,
        brand: cardBrand
      };
      const result = await this.insertCard(_data);
      return {
        status: 'success',
        data: {
          message: 'Card saved',
          card: result.card_number,
          brand: result.brand
        }
      };
    } else {
      return {
        status: 'error',
        data: {
          message: 'Invalid card'
        }
      };
    }
  }

  getCard(_id) {
    return new Promise((resolve, reject) => {
      this.options.Model.findOne({ _id }, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  getCards() {
    return new Promise((resolve, reject) => {
      this.options.Model.find({}, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  insertCard(_data) {
    return new Promise((resolve, reject) => {
      this.options.Model.insert(_data, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  validateCard(cardNumber) {
    return luhn.validate(cardNumber);
  }

  determineCard(cardNumber) {
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      return 'VISA';
    } else if (
      /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(
        cardNumber
      )
    ) {
      return 'MASTERCARD';
    } else if (
      /^((506(0|1))|(507(8|9))|(6500))[0-9]{12,15}$/.test(cardNumber)
    ) {
      return 'VERVE';
    } else {
      return null;
    }
  }
}

module.exports = card;
