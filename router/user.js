const express = require("express");
const router = express.Router();

const User = require("../model/User");
const { Op } = require("sequelize");
router.post("/create", async (req, res) => {
  const { name, email, role, archive } = req.body;
  const roles = ["admin", "owner", "manager"];
  if (!name || !email || !role || !roles.includes(role)) 
    return res
      .status(422)
      .json({ error: "please fill all the required fields properly" });
  

  try {
    const newUser = await User.create({
      name,
      email,
      role,
      archive: archive ?? false,
    });

    return res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    return err.name === "SequelizeUniqueConstraintError"
      ? res.status(409).json({ error: err.errors[0].message })
      : res.status(500).json({ error: "server error" });
  }
});

router.patch("/update", async (req, res) => {
  const { name, email, role, archive, newEmail } = req.body;
  const roles = ["admin", "owner", "manager"];
  if (role && !roles.includes(role)) 
    return res
      .status(422)
      .json({ error: "role is not correct" });
  
  if (!email) 
    return res.status(422).json({ error: "email is required to update" });
  

  try {
    const tempUser = await User.findOne({ where: { email } });
    const id = tempUser.id;
    const existingUser = await User.findOne({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    existingUser.name = name ?? existingUser.name;
    existingUser.role = role ?? existingUser.role;
    existingUser.archive = archive ?? existingUser.archive;
    existingUser.email = newEmail ?? existingUser.email;

    await existingUser.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(422)
      .json({ error: "email is required to delete a user" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) return res.status(404).json({ error: "User not found" });

    await existingUser.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/details", async (req, res) => {
  const { role, name, email, archive } = req.query;
  
  var query = {};
  if (name) query["name"] = { [Op.like]: `%${name}%` };
  if (email) query["email"] = { [Op.like]: `%${email}%` };
  if (role) query["role"] = { [Op.eq]: role };
  if (archive) query["archive"] = { [Op.eq]: archive };

  try {
    const existingUsers = await User.findAll({
      where: query,
    });

    if (existingUsers.length === 0)
      return res
        .status(404)
        .json({ error: "No users found with the given name" });

    return res.status(200).json({ users: existingUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
