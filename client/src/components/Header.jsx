import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  // console.log(currentUser);
  async function handleSearch(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    const response = await fetch(`/api/listing/get?searchTerm=${searchTerm}`);
  }

  return (
    <header className="bg-slate-300">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex">
            <span className="text-slate-500">Hritik</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearch}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            placeholder="Search..."
            value={searchTerm}
          />
          <button>
            <FaSearch className="text-slate-600 cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="Hidden sm:inline text-slate-700 menu-item">Home</li>
          </Link>
          <Link to="/about">
            <li className="Hidden sm:inline text-slate-700 menu-item">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser?.pfpUrl}
                alt="profile"
                className="rounded-full w-8 h-8"
              />
            ) : (
              <li className="sm:inline text-slate-700 menu-item">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
