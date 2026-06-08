const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const isLoggedIn = require("../middleware/auth");
const TaskController = require("../controller/TaskController");

router.get("/", UserController.registeruserpage);
router.get("/login", UserController.loginuserpage);
router.get("/home", isLoggedIn, UserController.homepage);
router.get("/logout", UserController.logout);
router.get("/task/add", isLoggedIn, TaskController.addTaskPage);
router.get("/task/edit/:id", isLoggedIn, TaskController.editTaskPage);

router.post("/userregister", UserController.userregister);
router.post("/userlogin", UserController.userlogin);
router.post("/task/add", isLoggedIn, TaskController.addTask);
router.post("/task/delete/:id", isLoggedIn, TaskController.deleteTask);
router.post("/task/complete/:id", isLoggedIn, TaskController.completeTask);
router.post("/task/edit/:id", isLoggedIn, TaskController.editTask);


module.exports = router;
