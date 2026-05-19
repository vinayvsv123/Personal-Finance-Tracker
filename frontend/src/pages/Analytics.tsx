import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ArrowLeft,
  Loader2,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import api from '../api';
import './Analytics.css';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const Analytics: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  // Process data for charts
  
  // 1. Monthly Income vs Expense
  const monthlyData = React.useMemo(() => {
    const data: Record<string, { month: string; income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!data[monthYear]) {
        data[monthYear] = { month: monthYear, income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        data[monthYear].income += t.amount;
      } else {
        data[monthYear].expense += t.amount;
      }
    });

    // Sort chronologically (assuming sorting by raw string might not be perfect, but simple enough for demo)
    return Object.values(data).sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    });
  }, [transactions]);

  // 2. Expense breakdown by category
  const expenseByCategory = React.useMemo(() => {
    const data: Record<string, number> = {};
    
    transactions.filter(t => t.type === 'expense').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });

    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Balance trend over time
  const balanceTrend = React.useMemo(() => {
    let currentBalance = 0;
    
    // Sort transactions by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by date
    const dataByDate: Record<string, number> = {};
    sorted.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString();
      if (!dataByDate[dateStr]) {
        dataByDate[dateStr] = 0;
      }
      dataByDate[dateStr] += t.type === 'income' ? t.amount : -t.amount;
    });

    return Object.entries(dataByDate).map(([date, amount]) => {
      currentBalance += amount;
      return { date, balance: currentBalance };
    });
  }, [transactions]);

  return (
    <div className="analytics-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={20} />
            </Link>
            <div className="header-title">
              <BarChart2 size={24} className="text-blue" />
              <h1>Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="analytics-main">
        {loading ? (
          <div className="loading-container">
            <Loader2 className="spinner-icon" size={40} />
            <p>Crunching the numbers...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={48} className="text-tertiary" />
            <h3>No data to analyze</h3>
            <p>Add some transactions to see your financial insights.</p>
            <Link to="/dashboard" className="mt-4 inline-block text-blue font-medium hover:underline">
              Go back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="charts-grid">
            {/* Monthly Income vs Expense */}
            <Card className="chart-card col-span-full">
              <CardHeader>
                <CardTitle>Monthly Cash Flow</CardTitle>
              </CardHeader>
              <CardContent className="chart-content">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="income" name="Income" fill="var(--success)" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Balance Trend */}
            <Card className="chart-card">
              <CardHeader>
                <CardTitle>Balance Trend</CardTitle>
              </CardHeader>
              <CardContent className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={balanceTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Line type="monotone" dataKey="balance" name="Balance" stroke="var(--accent-blue)" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card className="chart-card">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="chart-content pie-container">
                {expenseByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary">
                    No expense data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
