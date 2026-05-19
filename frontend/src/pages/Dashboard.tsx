import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trash2,
  Menu,
  Search,
  Filter,
  BarChart2
} from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import api from '../api';
import './Dashboard.css';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
}

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [user, setUser] = useState<{ username?: string } | null>(null);
  
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      showToast('Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (e) {}

    fetchTransactions();
  }, [navigate]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...formData,
        amount: Number(formData.amount)
      });
      setIsModalOpen(false);
      fetchTransactions();
      showToast('Transaction added successfully', 'success');
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    } catch (err) {
      showToast('Failed to add transaction', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
        showToast('Transaction deleted', 'success');
      } catch (err) {
        showToast('Failed to delete transaction', 'error');
      }
    }
  };

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
        acc.balance += t.amount;
      } else {
        acc.expense += t.amount;
        acc.balance -= t.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 }
  );

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.note?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <TrendingUp size={24} className="brand-icon" />
            <span>FinanceTracker</span>
          </Link>
          <div className="navbar-actions">
            <Link to="/analytics" className="nav-action-link" title="Analytics">
              <BarChart2 size={20} />
            </Link>
            <Link to="/profile" className="user-profile">
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="username">{user?.username || 'User'}</span>
            </Link>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
            <button className="mobile-menu-btn">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Summary Cards */}
        <div className="summary-grid">
          <Card>
            <CardContent className="summary-card">
              <div className="summary-icon balance-icon">
                <DollarSign size={24} />
              </div>
              <div className="summary-info">
                <p className="summary-label">Total Balance</p>
                <h3 className="summary-value">${summary.balance.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="summary-card">
              <div className="summary-icon income-icon">
                <TrendingUp size={24} />
              </div>
              <div className="summary-info">
                <p className="summary-label">Total Income</p>
                <h3 className="summary-value success-text">+${summary.income.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="summary-card">
              <div className="summary-icon expense-icon">
                <TrendingDown size={24} />
              </div>
              <div className="summary-info">
                <p className="summary-label">Total Expense</p>
                <h3 className="summary-value danger-text">-${summary.expense.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <h2 className="section-title">Recent Transactions</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span className="add-btn-text">Add Transaction</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <Input 
            placeholder="Search transactions..." 
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="filter-dropdown">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="type-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <Card className="transactions-card">
          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Note</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td className="font-medium">{t.category}</td>
                      <td>
                        <span className={`badge badge-${t.type}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="text-secondary truncate-cell">{t.note || '-'}</td>
                      <td className={`text-right font-medium ${t.type === 'income' ? 'success-text' : ''}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(t._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mobile Card View */}
              <div className="mobile-transactions">
                {filteredTransactions.map(t => (
                  <div key={t._id} className="mobile-transaction-card">
                    <div className="mtc-header">
                      <span className={`badge badge-${t.type}`}>{t.type}</span>
                      <span className={`mtc-amount ${t.type === 'income' ? 'success-text' : ''}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mtc-body">
                      <div className="mtc-info">
                        <h4>{t.category}</h4>
                        <p>{t.note || 'No notes'}</p>
                        <small>{new Date(t.date).toLocaleDateString()}</small>
                      </div>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDelete(t._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <DollarSign size={48} />
              </div>
              <h3>No transactions found</h3>
              <p>You haven't added any transactions yet or none match your search.</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)} className="mt-4">
                Add your first transaction
              </Button>
            </div>
          )}
        </Card>
      </main>

      {/* Add Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="add-transaction-form">
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'income' ? 'active-income' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'income' })}
            >
              Income
            </button>
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'expense' })}
            >
              Expense
            </button>
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
          />

          <Input
            label="Category"
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Groceries, Salary"
          />

          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="input-wrapper">
            <label className="input-label">Note (Optional)</label>
            <textarea
              className="input-field textarea-field"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add details about this transaction..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
