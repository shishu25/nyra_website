import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { isAuthenticated, login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!adminId.trim() || !password.trim()) {
      setAuthError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(adminId, password);
      if (success) {
        navigate('/admin', { replace: true });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">NYRA</div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage bookings and dresses</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {authError && (
            <div className="login-error">
              {authError}
            </div>
          )}

          <div className="login-field">
            <FiUser className="field-icon" />
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <FiLock className="field-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
