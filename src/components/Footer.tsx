import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-32 border-t border-gold/30">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs tracking-widest-x text-muted text-center md:text-left">
          © 2026 muhammad fajis. all rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy" className="text-[10px] tracking-widest-x text-gold hover:text-ivory transition-colors">
            privacy policy
          </Link>
          <Link to="/terms" className="text-[10px] tracking-widest-x text-gold hover:text-ivory transition-colors">
            terms of use
          </Link>
        </div>
      </div>
    </footer>
  );
}
