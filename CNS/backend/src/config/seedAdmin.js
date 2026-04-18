import Admin from "../models/Admin.js";

// Ensures one demo admin account exists in MongoDB for classroom use.
// It creates the record once and skips creation on later restarts.
export const ensureDefaultAdmin = async () => {
  const username = String(process.env.ADMIN_USERNAME || "admin@vti.edu")
    .trim()
    .toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "VTI@123").trim();

  if (!username || !password) {
    console.warn("Admin seed skipped: ADMIN_USERNAME or ADMIN_PASSWORD is empty.");
    return;
  }

  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    console.log("Admin seed check: existing admin found in MongoDB.");
    return;
  }

  await Admin.create({
    username,
    password,
    role: "admin"
  });

  console.log("Admin seed check: default admin created in MongoDB.");
};
