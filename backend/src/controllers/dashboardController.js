import Transaction from "../models/Transaction.js";

// ─── GET /api/dashboard/summary ───────────────────────────────────────────────
// Returns: totalIncome, totalExpenses, netBalance, totalTransactions
const getSummary = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      // Exclude soft-deleted records
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    result.forEach((entry) => {
      if (entry._id === "income") {
        totalIncome = entry.total;
        incomeCount = entry.count;
      } else if (entry._id === "expense") {
        totalExpenses = entry.total;
        expenseCount = entry.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netBalance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
        totalTransactions: incomeCount + expenseCount,
        incomeCount,
        expenseCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/dashboard/category-totals ───────────────────────────────────────
// Returns per-category breakdown of income and expense
const getCategoryTotals = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          breakdown: {
            $push: {
              type: "$_id.type",
              total: "$total",
              count: "$count",
            },
          },
          // Calculate net total for the category (income - expense)
          categoryTotal: { $sum: {
            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", { $multiply: ["$total", -1] } ]
          } },
        },
      },
      { $sort: { categoryTotal: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { categoryTotals: result },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/dashboard/monthly-trends ────────────────────────────────────────
// Returns monthly income vs expense for the past 12 months
const getMonthlyTrends = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          isDeleted: { $ne: true },
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          data: {
            $push: { type: "$_id.type", total: "$total", count: "$count" },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          data: 1,
        },
      },
    ]);

    // Normalise into a cleaner shape: { month, year, income, expense }
    const trends = result.map((item) => {
      const income = item.data.find((d) => d.type === "income")?.total || 0;
      const expense = item.data.find((d) => d.type === "expense")?.total || 0;
      return {
        year: item.year,
        month: item.month,
        monthLabel: new Date(item.year, item.month - 1).toLocaleString(
          "default",
          {
            month: "short",
            year: "numeric",
          },
        ),
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
        net: parseFloat((income - expense).toFixed(2)),
      };
    });

    res.status(200).json({ success: true, data: { trends } });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/dashboard/recent-activity ───────────────────────────────────────
// Returns the 10 most recent transactions
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(limit)
      .populate("createdBy", "name email");

    res.status(200).json({ success: true, data: { transactions } });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/dashboard/weekly-trends ─────────────────────────────────────────
// Returns last 7 days of income and expense
const getWeeklyTrends = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          isDeleted: { $ne: true },
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Transform into date-keyed map
    const map = {};
    result.forEach(({ _id, total }) => {
      if (!map[_id.date])
        map[_id.date] = { date: _id.date, income: 0, expense: 0 };
      map[_id.date][_id.type] = parseFloat(total.toFixed(2));
    });

    const trends = Object.values(map).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    res.status(200).json({ success: true, data: { trends } });
  } catch (error) {
    next(error);
  }
};

export {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends,
};
