require("dotenv").config();
const Payments = require("../models/Payments");
const Products = require("../models/Products");
const Teachers = require("../models/Teachers");

class Pay {
  /**
   * [POST]
   *
   * @param {object}
   * @returns {array}
   */

  async success(req, res) {
    try {
      let { data } = req.body;
      if (!data) throw new Error("Parameter not passed: data");

      let paymentId = data.id;
      let products = data.purchase_units;

      if (!paymentId) throw new Error("Parameter not passed: paymentId");

      products.forEach(async (item) => {
        const payment = {
          userId: req.userId,
          paymentId: paymentId,
          email: item.payee.email_address || "",
          custom_id: item.custom_id || "",
          title: item.title || "",
          description: item.description || "",
          price: item.amount.value || "",
          currency: item.amount.currency_code || "",
        };

        if (!payment.userId) throw new Error("Parameter not passed: userId");
        if (!paymentId) throw new Error("Parameter not passed: paymentId");
        if (await Payments.findOne({ paymentId: payment.paymentId }))
          throw new Error("Payment error");

        await Payments.create(payment);
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

exports.payController = new Pay();
