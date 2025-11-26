const Footer = () => {
  return (
    <footer className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-[#6B7280] text-sm">
          <span>© 2025 Scan Sehat</span>
          <span className="hidden sm:inline">·</span>
          <a href="#" className="hover:text-[#0C6CF2] transition-colors" aria-label="Privacy Policy">
            Privacy Policy
          </a>
          <span className="hidden sm:inline">·</span>
          <a href="#" className="hover:text-[#0C6CF2] transition-colors" aria-label="Terms">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
