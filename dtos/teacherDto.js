module.exports = class userDto {
  name;
  uid;

  constructor(model) {
    this.name = model.name;
    this.uid = model.uid;
  }
};
