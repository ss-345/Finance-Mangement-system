import mongoose from "mongoose";
/**
 * Transaction Model
 * Represents a single financial record (income or expense).
 */
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: [
          "salary",
          "freelance",
          "investment",
          "business",
          "rent",
          "utilities",
          "groceries",
          "transport",
          "healthcare",
          "entertainment",
          "education",
          "insurance",
          "other",
        ],
        message: "Invalid category",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    // Track who created/last-modified the record — useful for audit trails
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Soft delete support: records are never truly removed from DB
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Hidden from regular queries
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes for common query patterns ───────────────────────────────────────
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ isDeleted: 1 });
transactionSchema.index({ date: -1, type: 1 }); // Compound for dashboard queries

// ─── Query Middleware: Automatically exclude soft-deleted docs ────────────────
// Applied to find, findOne, findById, etc.
transactionSchema.pre(/^find/, function () {
  // `this` is the query object
  if (!this._conditions.includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.model("Transaction", transactionSchema);
