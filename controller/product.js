const { Product } = require("../model/Product");

exports.createProduct = (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct
      .save()
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllProducts = async (req, res) => {
  const qNew = /^(true|True|1)$/.test(req.query.new);
  const qCategory = req.query.category;
  const qpageNumber = req.query.pageNumber;
  const qpageSize = req.query.pageSize;
  const qfilters = req.query.filters ? JSON.parse(req.query.filters) : {};
  const qsort = req.query.sort || "newest";
  try {
    let products;
    let query = {};
    let sortCriteria;
    if (qsort === "asc") {
      sortCriteria = { price: 1 };
    } else if (qsort === "desc") {
      sortCriteria = { price: -1 };
    } else if (qsort === "newest") {
      sortCriteria = { createdAt: -1 };
    }

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      query = { categories: { $in: [qCategory] } };

      if (Object.keys(qfilters).length > 0) {
        for (const [key, value] of Object.entries(qfilters)) {
          query[key] = { $in: Array.isArray(value) ? value : [value] };
        }
      }

      products = await Product.find(query)
        .sort(sortCriteria)
        .limit(qpageSize)
        .skip(qpageSize * (qpageNumber - 1));
    } else if (qfilters) {
      if (Object.keys(qfilters).length > 0) {
        for (const [key, value] of Object.entries(qfilters)) {
          query[key] = { $in: Array.isArray(value) ? value : [value] };
        }
      }
      products = await Product.find(query)
        .sort(sortCriteria)
        .limit(qpageSize)
        .skip(qpageSize * (qpageNumber - 1));
    } else if (qpageNumber !== 0 && qpageSize !== 0) {
      products = await Product.find()
        .sort(sortCriteria)
        .limit(qpageSize)
        .skip(qpageSize * (qpageNumber - 1));
    } else {
      products = await Product.find().sort(sortCriteria);
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};
