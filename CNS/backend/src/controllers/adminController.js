import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const buildAdminToken = (admin) => {
  return jwt.sign(
    {
      adminId: admin._id,
      username: admin.username,
      role: admin.role
    },
    process.env.JWT_SECRET || "development_jwt_secret_change_me"
  );
};

const sanitizeAdminUsername = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[<>"'`;(){}]/g, "")
    .slice(0, 120);
};

// Validates admin credentials against MongoDB-stored admin record.
export const loginAdmin = async (req, res) => {
  const username = sanitizeAdminUsername(req.body?.username);
  const password = String(req.body?.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials."
    });
  }

  const isMatch = password === admin.password;

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials."
    });
  }

  const token = buildAdminToken(admin);

  return res.status(200).json({
    success: true,
    message: "Admin authenticated successfully.",
    token,
    admin: {
      username: admin.username,
      role: admin.role
    }
  });
};

export const verifyAdminSession = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token is valid.",
    admin: {
      id: req.admin.adminId,
      username: req.admin.username,
      role: req.admin.role
    }
  });
};
