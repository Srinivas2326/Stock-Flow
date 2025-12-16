// controllers/settingsController.js
const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne({
    organization: req.user.organization._id
  });

  if (!settings) {
    settings = await Settings.create({
      organization: req.user.organization._id
    });
  }

  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  const { defaultLowStockThreshold } = req.body;

  const settings = await Settings.findOneAndUpdate(
    { organization: req.user.organization._id },
    { defaultLowStockThreshold },
    { new: true, upsert: true }
  );

  res.json(settings);
};
