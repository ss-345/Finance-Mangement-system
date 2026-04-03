import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "all",
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
];

const Transactions = () => {
  const { hasRole , setPage } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 15,
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== 0),
      );
      const res = await api.get("/transactions", { params });
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    setPage("transactions");
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">
            {pagination.total || 0} total records
          </p>
        </div>
        {hasRole("admin") && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + New Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((p) => ({ ...p, type: e.target.value, page: 1 }))
          }
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((p) => ({ ...p, category: e.target.value, page: 1 }))
          }
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === "all" ? "" : c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((p) => ({ ...p, startDate: e.target.value, page: 1 }))
          }
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((p) => ({ ...p, endDate: e.target.value, page: 1 }))
          }
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[
                "Date",
                "Type",
                "Category",
                "Amount",
                "Description",
                "Created By",
                hasRole("admin") ? "Actions" : "",
              ].map(
                (h) =>
                  h && (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-semibold text-gray-600"
                    >
                      {h}
                    </th>
                  ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 capitalize">
                    {t.category}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {t.type === "income" ? "+" : "-"}$
                    {t.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                    {t.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {t.createdBy?.name || "—"}
                  </td>
                  {hasRole("admin") && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditing(t);
                            setShowForm(true);
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? "Edit Transaction" : "New Transaction"}
            </h2>
            <TransactionForm
              existing={editing}
              onSuccess={() => {
                setShowForm(false);
                setEditing(null);
                fetchTransactions();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
