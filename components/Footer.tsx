export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm mt-auto z-10 relative">
      <p>
        © {new Date().getFullYear()} MyBrand. Built with Next.js + WordPress.
      </p>
    </footer>
  );
}
