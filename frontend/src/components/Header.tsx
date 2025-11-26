import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-full">
        <Link to="/" className="text-xl md:text-2xl font-bold text-[#0C6CF2]">
          ScanSehat
        </Link>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className="text-gray-600 hover:text-[#0C6CF2] transition-colors text-sm lg:text-base">
            Home
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-[#0C6CF2] transition-colors text-sm lg:text-base">
            Pricing
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-[#0C6CF2] transition-colors text-sm lg:text-base">
            About
          </Link>
          <Link to="/temp-dashboard" className="text-gray-600 hover:text-[#0C6CF2] transition-colors text-sm lg:text-base">
            Temp Dashboard
          </Link>
        </nav>
        <div className="hidden md:block">
          <Link
            to="/login"
            className="rounded-lg bg-[#0C6CF2] px-6 py-2 text-white font-medium hover:bg-[#0A5CD9] transition-colors text-sm lg:text-base"
            aria-label="Launch App"
          >
            Launch App
          </Link>
        </div>
        <button
          className="md:hidden p-2 text-gray-600 hover:text-[#0C6CF2]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#0C6CF2] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-[#0C6CF2] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-[#0C6CF2] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/temp-dashboard"
              className="text-gray-600 hover:text-[#0C6CF2] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Temp Dashboard
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-[#0C6CF2] px-6 py-2 text-white font-medium hover:bg-[#0A5CD9] transition-colors text-center"
              onClick={() => setMenuOpen(false)}
              aria-label="Launch App"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
