const { User } = require("../model/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = await User.find();
    const usernameCheck = users.find((user) => user.username === username);
    const emailCheck = users.some((user) => user.email === email);

    if (usernameCheck) {
      res
        .status(400)
        .json({ message: "Username already registered.", status: false });
    } else if (emailCheck) {
      res
        .status(400)
        .json({ message: "Email already registered.", status: false });
    } else {
      var encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_PASS
      ).toString();

      const newUser = { ...req.body, password: encryptedPassword };
      const createUser = new User(newUser);

      createUser
        .save()
        .then((user) => {
          const payload = {
            id: user._id,
            isAdmin: user.isAdmin,
          };
          const secretKey = process.env.PRIVATE_JWT_SECRET;

          const token = jwt.sign(payload, secretKey, {
            algorithm: "RS256",
            expiresIn: "3d",
          });

          const { password, ...others } = user._doc;
          // res.status(201).json({ ...others, token });
          res.status(201).json(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          res.status(500).json(error);
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await User.find();
    const user = users.find((user) => user.username === username);

    if (!user) {
      res.status(401).json({
        message: "Incorrect Username or Password",
        status: false,
      });
    } else {
      var decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_PASS
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedPassword === password) {
        const payload = {
          id: user._id,
          isAdmin: user.isAdmin,
        };
        const secretKey = process.env.PRIVATE_JWT_SECRET;

        const token = jwt.sign(payload, secretKey, {
          algorithm: "RS256",
          expiresIn: "3d",
        });

        const { password, ...others } = user._doc;
        res.status(200).json({
          ...others,
          token,
          status: true,
        });
      } else {
        res.status(401).json({
          message: "Incorrect Username or Password",
          status: false,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    res.status(200).json({
      email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = (req, res) => {
  try {
    const data = req.body;
    res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.logout = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.tokenVerify = async (req, res) => {
  try {
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.tokenVerifyAndLogin = async (req, res) => {
  try {
    // const { username } = req.body;
    const userId = req.user.id;
    const users = await User.find();
    const user = users.find((user) => user._id.toString() === userId);

    if (!user) {
      res.status(401).json({
        message: "Incorrect Username or Password",
        status: false,
      });
    } else {
      const payload = {
        id: user._id,
        isAdmin: user.isAdmin,
      };
      const secretKey = process.env.PRIVATE_JWT_SECRET;

      const token = jwt.sign(payload, secretKey, {
        algorithm: "RS256",
        expiresIn: "3d",
      });

      const { password, ...others } = user._doc;

      res.status(200).json({
        ...others,
        token,
        status: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
