module.exports = class userDto {
  email;
  id;
  balance;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.balance = model.balance;
  }
};
