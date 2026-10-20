import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — Suraj Kumar';
  }, []);

  return (
    <section className="section-padding">
      <div className="container-content text-center max-w-lg mx-auto">
        <p className="eyebrow mb-3">404</p>
        <h1 className="page-title mb-4">Page not found</h1>
        <p className="body-text mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </section>
  );
}
