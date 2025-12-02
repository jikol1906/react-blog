import { Outlet, Link } from "react-router";
import { Button } from "../components/ui/button";

const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto w-full">
        <Link to="/" className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity">
          CodeBlog
        </Link>

        <nav className="flex gap-4">
          <Link to="/">
            <Button 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-200 font-medium"
            >
              Artikeln
            </Button>
          </Link>
          
          <Link to="/login">
            <Button 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-200 font-medium"
            >
              Log out
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-sm text-gray-500 border-t border-zinc-900 mt-12">
        &copy; 2025 CodeBlog. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default Layout;