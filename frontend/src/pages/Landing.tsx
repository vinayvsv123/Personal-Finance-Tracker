import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart2, 
  ShieldCheck, 
  PieChart,
  ArrowRight,
  UserPlus,
  DollarSign,
  Activity
} from 'lucide-react';
import { Button } from '../components/Button';
import './Landing.css';

export const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-brand">
            <TrendingUp size={28} className="brand-icon" />
            <span>FinanceTracker</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/auth" className="nav-login-link">Log in</Link>
            <Link to="/auth">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">
            <span className="badge-new">New</span>
            <span>Analytics dashboard is now live</span>
          </div>
          <h1 className="hero-title">
            Track your income, expenses & <span className="text-blue">financial growth</span> effortlessly
          </h1>
          <p className="hero-subtitle">
            Take control of your money. FinanceTracker provides simple, secure, and beautiful tools to manage your personal finances like a pro.
          </p>
          <div className="hero-actions">
            <Link to="/auth">
              <Button size="lg" className="hero-btn">
                Start tracking for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Everything you need to manage your money</h2>
            <p>Powerful tools designed for simplicity and clarity.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><DollarSign size={24} /></div>
              <h3>Track income & expenses</h3>
              <p>Easily log your daily transactions, categorize them, and add helpful notes for future reference.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><BarChart2 size={24} /></div>
              <h3>Visual analytics</h3>
              <p>Beautiful, interactive charts that give you a bird's-eye view of your financial health at a glance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><PieChart size={24} /></div>
              <h3>Monthly insights</h3>
              <p>Understand your spending habits with detailed category breakdowns and trend analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={24} /></div>
              <h3>Secure authentication</h3>
              <p>Your financial data is protected with industry-standard JWT authentication and security practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How it works</h2>
            <p>Get started in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-icon"><UserPlus size={32} /></div>
              <h3>Sign up</h3>
              <p>Create your free account in seconds. No credit card required.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-icon"><DollarSign size={32} /></div>
              <h3>Add transactions</h3>
              <p>Log your income and expenses as they happen with our simple modal.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-icon"><Activity size={32} /></div>
              <h3>View insights</h3>
              <p>Watch your dashboard populate with actionable insights and beautiful charts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to take control of your finances?</h2>
          <p>Join thousands of users who are already tracking their financial growth.</p>
          <Link to="/auth">
            <Button size="lg" className="cta-btn">Create your free account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <TrendingUp size={24} className="brand-icon" />
            <span>FinanceTracker</span>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
