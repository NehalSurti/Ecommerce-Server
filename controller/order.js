const { Order } = require("../model/Order");
const { User } = require("../model/User");

exports.createOrder = (req, res) => {
  try {
    const newOrder = new Order(req.body);
    newOrder
      .save()
      .then(async (order) => {
        const userId = order.userId;
        const userOrders = await Order.find({ userId: userId });
        const transactionalVolume = userOrders.reduce(
          (total, order) => total + order.amounts,
          0
        );

        await User.findByIdAndUpdate(
          userId,
          { $set: { transactions: transactionalVolume } },
          { new: true }
        );
        res.status(200).json(order);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllOrders = async (req, res) => {
  const query = /^(true|True|1)$/.test(req.query.new);
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(5)
      : await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMonthlyIncome = async (req, res) => {
  ly = new Date("2024-01-01");
  console.log(ly);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: ly },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amounts",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMonthlyIncomeforProduct = async (req, res) => {
  const productId = req.params.id;

  ly = new Date("2024-01-01");
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: ly },
          ...(productId && {
            products: { $elemMatch: { productId: productId } },
          }),
        },
      },
      {
        $unwind: "$products", // Unwind the products array to work with individual products
      },
      {
        $match: {
          ...(productId && { "products.productId": productId }), // Match the specific productId
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          // Calculate sales by multiplying price with quantity
          sales: { $multiply: ["$products.price", "$products.quantity"] },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
      {
        $group: {
          _id: null,
          monthlySales: { $push: { month: "$_id", total: "$total" } },
          totalSales: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: productId, // Set _id to be equal to productId
          monthlySales: 1,
          totalSales: 1,
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
