import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import express from 'express';

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return true;
  }
  return false;
};

// ─── POST /api/transactions ───────────────────────────────────────────────────
// Admin only
const createTransaction = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { amount, type, category, date, description } = req.body;

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date: date || new Date(),
      description,
      createdBy: req.user._id,
    });

    // Populate creator info for the response
    await transaction.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/transactions ────────────────────────────────────────────────────
// Viewer, Analyst, Admin
const getAllTransactions = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    // ── Build filter object ──────────────────────────────────────────────────
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Simple text search on description
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ── Sorting ───────────────────────────────────────────────────────────────
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/transactions/:id ────────────────────────────────────────────────
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      });
    }

    res.status(200).json({ success: true, data: { transaction } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/transactions/:id ────────────────────────────────────────────────
// Admin only
const updateTransaction = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { amount, type, category, date, description } = req.body;

    const allowedUpdates = {};
    if (amount !== undefined) allowedUpdates.amount = amount;
    if (type !== undefined) allowedUpdates.type = type;
    if (category !== undefined) allowedUpdates.category = category;
    if (date !== undefined) allowedUpdates.date = date;
    if (description !== undefined) allowedUpdates.description = description;

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update.',
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/transactions/:id ─────────────────────────────────────────────
// Admin only — Soft delete
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      });
    }

    // Soft delete: mark isDeleted and record deletion time
    transaction.isDeleted = true;
    transaction.deletedAt = new Date();
    await transaction.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
