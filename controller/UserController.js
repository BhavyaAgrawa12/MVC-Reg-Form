const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const TaskModel = require("../model/TaskModel");

exports.registeruserpage = (req, res) => {
  res.render("registration");
};

exports.loginuserpage = (req, res) => {
  res.render("login");
};

exports.homepage = async (req, res) => {
  try {
    const userData = req.session.user;
    if (!userData) {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.render("home", {
      errors: [
        {
          message: "Internal server error",
        },
      ],
    });
  }
  const search = req.query.search || "";
  const allTasks = await TaskModel.find({
    userId: req.session.user._id
});

const tasks = await TaskModel.find({
  userId: req.session.user._id,
  title: {
    $regex: search,
    $options: "i"
  }
});

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed",
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  res.render("home", {
    userData: req.session.user,
    tasks,
    totalTasks,
    completedTasks,
    pendingTasks,
    search
  });
};

exports.userregister = async (req, res) => {
  let { username, password, phoneNumber, email } = req.body;

  try {
    const errors = [];

    if (!username || !password || !phoneNumber || !email) {
      errors.push({
        message: "All fields are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({
        message: "Please enter a valid email",
      });
    }

    if (!/^(\+91|91)?[6-9]\d{9}$/.test(phoneNumber)) {
      errors.push({
        message: "Please enter a valid phone number",
      });
    }

    if (errors.length > 0) {
      return res.render("registration", {
        errors,
        username,
        email,
        phoneNumber,
      });
    }

    const duplicateEmail = await UserModel.findOne({ email });
    const duplicatePhoneNumber = await UserModel.findOne({ phoneNumber });

    if (duplicateEmail && duplicatePhoneNumber) {
      errors.push({
        message: "Email and phone number already exist",
      });
    } else if (duplicateEmail) {
      errors.push({
        message: "Email already exists",
      });
    } else if (duplicatePhoneNumber) {
      errors.push({
        message: "Phone number already exists",
      });
    }

    if (errors.length > 0) {
      return res.render("registration", {
        errors,
        username,
        email,
        phoneNumber,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username,
      password: hashedPassword,
      phoneNumber,
      email,
    });

    await user.save();

    return res.render("login");
  } catch (error) {
    const errors = [];

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors.push({
          message: error.errors[key].message,
        });
      });
    } else if (error.code === 11000) {
      if (error.keyPattern?.email) {
        errors.push({
          message: "Email already exists",
        });
      }

      if (error.keyPattern?.phoneNumber) {
        errors.push({
          message: "Phone number already exists",
        });
      }
    } else {
      errors.push({
        message: error.message,
      });
    }

    return res.render("registration", {
      errors,
      username,
      email,
      phoneNumber,
    });
  }
};

exports.userlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const errors = [];

    if (!email || !password) {
      errors.push({
        message: "Please fill in all fields",
      });

      return res.render("login", { errors });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      errors.push({
        message: "Invalid email or password",
      });

      return res.render("login", { errors, email });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      errors.push({
        message: "Invalid email or password",
      });

      return res.render("login", { errors, email });
    }

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.redirect("/home");
  } catch (error) {
    console.error(error);

    return res.render("login", {
      errors: [
        {
          message: "Internal Server Error",
        },
      ],
      email,
    });
  }
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Logout Failed");
    }

    res.redirect("/login");
  });
};
