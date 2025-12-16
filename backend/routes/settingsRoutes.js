// routes/settingsRoutes.js
const router = require("express").Router();
const protect = require("../middlewares/authMiddleware");
const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

module.exports = router;
