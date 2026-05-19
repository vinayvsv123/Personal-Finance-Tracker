import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ArrowLeft, 
  LogOut,
  Calendar,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import './Profile.css';

interface UserProfile {
  username: string;
  email: string;
  createdAt?: string;
}

export const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    // Fallback to localStorage user data if /profile endpoint isn't ready
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser({
        username: userData.username || 'User',
        email: userData.email || 'user@example.com',
        createdAt: userData.createdAt || new Date().toISOString()
      });
    } catch (e) {
      setUser({ username: 'User', email: 'user@example.com' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={20} />
            </Link>
            <div className="header-title">
              <h1>My Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="profile-main">
        <Card className="profile-card">
          <CardContent className="profile-content">
            <div className="profile-avatar-large">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="profile-name">{user.username}</h2>
            <div className="profile-role">
              <Shield size={14} className="mr-1" />
              Standard User
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-icon"><User size={18} /></div>
                <div className="detail-info">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">{user.username}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon"><Mail size={18} /></div>
                <div className="detail-info">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon"><Calendar size={18} /></div>
                <div className="detail-info">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/dashboard" className="full-width-link">
                <Button variant="outline" fullWidth>
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="danger" fullWidth onClick={handleLogout} className="logout-btn">
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
