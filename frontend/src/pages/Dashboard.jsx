import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { hasRole , setPage} = useAuth();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, recentRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/recent-activity'),
        ]);
        setSummary(summaryRes.data.data);
        setRecent(recentRes.data.data.transactions);

        if (hasRole('analyst', 'admin')) {
          const trendsRes = await api.get('/dashboard/monthly-trends');
          setTrends(trendsRes.data.data.trends);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setPage("dashboard");
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Financial overview</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Income" value={summary.totalIncome} icon="💰" color="emerald" />
          <StatCard title="Total Expenses" value={summary.totalExpenses} icon="💸" color="red" />
          <StatCard title="Net Balance" value={summary.netBalance} icon="📊"
            color={summary.netBalance >= 0 ? 'blue' : 'red'} />
          <StatCard title="Transactions" value={summary.totalTransactions} icon="🔢" color="amber"
            trend={`${summary.incomeCount} income · ${summary.expenseCount} expense`} />
        </div>
      )}

      {/* Monthly Trends (analyst/admin only) */}
      {trends.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Trends (Last 12 Months)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Month</th>
                  <th className="pb-2 font-medium text-emerald-600">Income</th>
                  <th className="pb-2 font-medium text-red-500">Expense</th>
                  <th className="pb-2 font-medium text-blue-600">Net</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t) => (
                  <tr key={`${t.year}-${t.month}`} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 text-gray-700">{t.monthLabel}</td>
                    <td className="py-2 text-emerald-600">${t.income.toLocaleString()}</td>
                    <td className="py-2 text-red-500">${t.expense.toLocaleString()}</td>
                    <td className={`py-2 font-semibold ${t.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {t.net >= 0 ? '+' : ''}${t.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent transactions.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((t) => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{t.category}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;