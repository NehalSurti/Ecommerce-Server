const { Wishlist } = require("../model/Wishlist");

exports.addOrUpdateWishlist = async (req, res) => {
  const { userId, productId, title, img, price } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If wishlist doesn't exist for the userId, create a new one
      wishlist = new Wishlist({
        userId,
        products: [{ productId, title, img, price }],
        totalQuantity: 1, // Initial totalQuantity is 1
      });
      await wishlist.save();
      res.status(200).json(wishlist);
    } else {
      await Wishlist.updateOne(
        { userId },
        {
          $push: {
            products: { productId, title, img, price },
          },
          $inc: {
            totalQuantity: 1,
          },
        },
        { new: true }
      );
      let wishlist = await Wishlist.findOne({ userId });
      res.status(200).json(wishlist);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteProductFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the wishlist document for the given userId
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // If there's only one product, remove the entire wishlist
    if (wishlist.products.length === 1) {
      await Wishlist.findOneAndDelete({ userId });
      return res.status(200).json({ message: "Wishlist deleted" });
    }

    // Remove the specified product from the products array
    await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } }, $inc: { totalQuantity: -1 } }
    );

    return res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error deleting product from wishlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get the wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the wishlist for the provided userId
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(200)
        .json({ success: false, message: "Wishlist not found for the user" });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// exports.deleteWishlist = async (req, res) => {
//   try {
//     await Wishlist.findByIdAndDelete(req.params.id);
//     res.status(200).json("Wishlist has been deleted...");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.getWishlist = async (req, res) => {
//   try {
//     const Wishlist = await Wishlist.findOne({ userId: req.params.userId });
//     res.status(200).json(Wishlist);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.getAllWishlist = async (req, res) => {
//   try {
//     const Wishlists = await Wishlist.find();
//     res.status(200).json(Wishlists);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
