import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({handleLogout}) {
  return (
    <nav className="bg-gray-100 border-black-700 border-b-1 h-14 flex justify-between">
      <div className="text-gray-600 hover:text-black font-bold uppercase p-4">
        <Link to="/" className="p-4">
          Deployify
        </Link>
      </div>

      <ul className="flex justify-between p-4 ">
        <li className="text-gray-700 font-bold">
          <Link to="/" className="p-4">
            Home
          </Link>
        </li>
        <li className="text-gray-600 font-bold">
          <Link to="/deploy" className="p-4">
            New Project
          </Link>
        </li>
        <li className="text-gray-600 font-bold mr-7">
          <Link onClick={handleLogout} to="/login" className="p-4">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
}
