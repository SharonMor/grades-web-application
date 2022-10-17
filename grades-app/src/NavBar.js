import { AiOutlineMenu } from "react-icons/ai";
import { FaUniversity } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useReducer, useState } from "react";
import useUser from "./hooks/useUser";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar({ fixed }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-800 border-b-4 border-l-black text-center fixed top-0 w-full">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <FaUniversity className=" text-violet-600 h-8 w-8  mr-2 hover:animate-spin  duration-700" />
              </Link>
            </div>
            {user && (
              <h1 className="text-gray-200 hover:animate-pulse hover:bg-gray-700 hover:text-white px-3 rounded-md text-sm font-medium ">
                Welcome {user.email}
              </h1>
            )}
            <div className="">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className=" text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium "
                >
                  Home
                </Link>
                {user ? (
                  <Link
                    to="/grades"
                    className="text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Grades
                  </Link>
                ) : (
                  ""
                )}
                {user ? (
                  <Link
                    to="/statistics"
                    className="text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Statistics
                  </Link>
                ) : (
                  ""
                )}
                <div className="">
                  {user ? (
                    <button
                      className="text-white absolute right-4 top-3 bg-red-700 hover:bg-red-800 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                      onClick={() => {
                        signOut(getAuth());
                      }}
                    >
                      Log Out
                    </button>
                  ) : (
                    <button
                      className="text-white absolute right-4 top-3 bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  "
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Log in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
