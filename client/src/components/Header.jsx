import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="bg-slate-300">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex">
            <span className="text-slate-500">Hritik</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex">
          <input
            type="text"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="Hidden sm:inline text-slate-700 menu-item">Home</li>
          </Link>
          <Link to="/about">
            <li className="Hidden sm:inline text-slate-700 menu-item">About</li>
          </Link>
          <Link to="/sign-in">
            <li className="sm:inline text-slate-700 menu-item">Sign In</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
