const express = require("express");
const router = express.Router();

const User = require("../model/User");
const LoginHistory = require("../model/history");
const { Op } = require("sequelize");

router.get("/logs", async (req, res) => {
  const { email, limit } = req.query;

  if (!email) 
    return res.status(422).json({ error: "Email is required to get logs" });
  

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });
    const query = { user_id: user.id };

    let options = {
      where: query,
      order: [["createdAt", "ASC"]],
    };

    if (limit) {
      const parsedLimit = parseInt(limit, 10); 
      if (!isNaN(parsedLimit) && parsedLimit > 0) 
        options.limit = parsedLimit;
      
    }

    const logs = await LoginHistory.findAll(options);

    return res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});


router.delete("/logs/:id", async (req, res) => {
    const logId = req.params.id;
  
    try {
      const log = await LoginHistory.findByPk(logId);
  
      if (!log) 
        return res.status(404).json({ error: "Log not found" });
      
      await log.destroy();
  
      return res.status(200).json({ message: "Log deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
