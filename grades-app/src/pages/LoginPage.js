import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { CgProfile } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import axios from "axios";

import useUser from "../hooks/useUser";

const LoginPage = () => {
  let idFromFB = "initValue";

  const googleProvider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useUser();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      idFromFB = user.uid; //get firebase new account's id in order to set it inside mongodb.
    }
  });

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/grades"); //navigate to gradess once user logged in
    } catch (e) {
      setError("Invalid Username Or Password");
    }
  };

  const addNewUserToDb = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};

    const response = await axios.post(
      "/api/login",
      {
        id: idFromFB,
      },
      { headers }
    );
  };

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(getAuth(), googleProvider);
      // checking if user is already inside Db, if so, no need to ask for school.
      const newStudentInfo = await axios.get("/api/login", {
        params: {
          newId: result.user.uid,
        },
      });
      // checking if user found inside db.
      if (newStudentInfo.data.length === 0) {
        addNewUserToDb();
        navigate("/grades/welcome");
      } else {
        navigate("/grades");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // length
  const handleSubmit = (event) => {
    // 👇️ prevent page refresh
    event.preventDefault();
  };

  return (
    <>
      <div className="mt-20 scale-110 ">
        {user ? (
          navigate("/grades")
        ) : (
          <div className=" flex items-center justify-center	">
            <form
              className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 "
              onSubmit={handleSubmit}
            >
              <div className="text-center flex mb-3">
                <CgProfile className="text-2xl mr-2 " />
                <h1 className="">Login</h1>
              </div>
              {error && (
                <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative select-none hover:bg-red-200">
                  {error}
                </p>
              )}
              {/* if error exists, display it */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Email Address / Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className={
                    password == ""
                      ? "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      : "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  }
                  type="password"
                  placeholder="******************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password == "" ? (
                  <p className="text-red-500 text-xs italic">
                    Please choose a password.
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-24 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={logIn}
                >
                  Sign In
                </button>
              </div>
              <div className="text-center my-4 font-bold">Or</div>
              <div className="flex items-center justify-between">
                <button
                  onClick={GoogleLogin}
                  // onClick={() => setModalIsOpen(true)}
                  className="text-white bg-gray-600 p-4 w-full font-medium rounded-lg flex align-middle gap-2"
                >
                  <FcGoogle className="text-2xl" /> Sign in with Google
                </button>
              </div>
              <Link
                to="/create-account"
                className="text-center inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Don't have an account? Create one here
              </Link>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
