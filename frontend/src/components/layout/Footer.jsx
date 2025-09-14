const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Product Comparison App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;