import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={isAdminPath ? '/admin' : '/'} className="not-found-btn">
          {isAdminPath ? 'Back to Admin' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}
