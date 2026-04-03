import mongoose from "mongoose";
import bcrypt from "bcryptjs";
/**
 * User Model
 *
 * Roles:
 *  - viewer   → Read-only access (dashboard + transactions)
 *  - analyst  → Read access + insights/summaries
 *  - admin    → Full CRUD on transactions AND user management
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["viewer", "analyst", "admin"],
        message: "Role must be viewer, analyst, or admin",
      },
      default: "viewer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Pre-save Hook: Hash password before saving ───────────────────────────────
userSchema.pre("save", async function () {
  // Only hash if password was actually modified
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error("Error hashing password");
  }
});

// ─── Instance Method: Compare entered password with stored hash ───────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance Method: Return safe user object (no password) ──────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
