const { Cart } = require("../model/Cart");

exports.addToCart = async (req, res) => {
  const { userId, productId, title, img, quantity, size, color, price } =
    req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist for the userId, create a new one
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            title,
            img,
            quantity,
            size,
            color,
            price,
            totalPrice: quantity * price,
          },
        ],
        totalAmount: quantity * price, // Initial totalAmount
      });
      await cart.save();
      res.status(200).json(cart);
    } else {
      // Check if the product already exists in the cart
      const existingProductIndex = cart.products.findIndex(
        (product) =>
          product.productId === productId &&
          product.size === size &&
          product.color === color
      );

      if (existingProductIndex !== -1) {
        // If the product already exists, update its quantity and total price
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].totalPrice += quantity * price;
      } else {
        // If the product is new, add it to the cart
        cart.products.push({
          productId,
          title,
          img,
          quantity,
          size,
          color,
          price,
          totalPrice: quantity * price,
        });
      }

      // Update total amount in the cart
      cart.totalAmount += quantity * price;

      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    // Find the cart document for the given userId
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex((product) => {
      return product._id.toString() === itemId;
    });

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    const { quantity, price } = cart.products[productIndex];
    cart.products.splice(productIndex, 1);

    // Update total amount in the cart
    cart.totalAmount -= quantity * price;

    // If there are no more products in the cart, delete the cart
    if (cart.products.length === 0) {
      await Cart.findOneAndDelete({ userId });
      return res.status(200).json({ message: "Cart deleted" });
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get the cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the provided userId
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(200)
        .json({ success: false, message: "Cart not found for the user" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    // Retrieve all carts
    const carts = await Cart.find();

    res.status(200).json(carts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProductQuantity = async (req, res) => {
  const { itemId, newQuantity } = req.body;
  const { userId } = req.params;

  try {
    // Find the cart document for the given userId
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product index in the cart
    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === itemId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the product
    const oldQuantity = cart.products[productIndex].quantity;
    const price = cart.products[productIndex].price;
    cart.products[productIndex].quantity = newQuantity;
    cart.products[productIndex].totalPrice = newQuantity * price;

    // Update total amount in the cart
    cart.totalAmount += (newQuantity - oldQuantity) * price;

    // Save the updated cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product quantity updated successfully", cart });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
