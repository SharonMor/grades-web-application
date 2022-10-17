import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import useUser from "../hooks/useUser";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [school, setSchool] = useState("Other");
  // const [idFromFB, setIdFromFB] = useState("initValue");
  let idFromFB = "initValue";

  const navigate = useNavigate();
  const { user } = useUser();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      idFromFB = user.uid; //get firebase new account's id in order to set it inside mongodb.
    }
  });

  const addNewUserToDb = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};

    const response = await axios.post(
      "/api/create-account",
      {
        school: school,
        id: idFromFB,
      },
      { headers }
    );
  };

  const academicList = [
    { label: "Other", value: "Other" },
    {
      label: "Braude College of Engineering",
      value: "Braude College of Engineering",
    },
    {
      label: "Technion – Israel Institute of Technology",
      value: "Technion – Israel Institute of Technology",
    },
    {
      label: "Ben-Gurion University of the Negev",
      value: "Ben-Gurion University of the Negev",
    },
    { label: "Tel-Aviv University", value: "Tel-Aviv University" },
    {
      label: "The Open University of Israel",
      value: "The Open University of Israel",
    },
    {
      label: "The Hebrew University of Jerusalem",
      value: "The Hebrew University of Jerusalem",
    },
    {
      label: "Afeka Tel Aviv Academic College of Engineering",
      value: "Afeka Tel Aviv Academic College of Engineering",
    },

    {
      label: "Al-Qasemi Academic College of Education",
      value: "Al-Qasemi Academic College of Education",
    },
    { label: "Ariel University", value: "Ariel University" },
    { label: "Ashkelon Academic College", value: "Ashkelon Academic College" },
    {
      label: "Azrieli - College of Engineering Jerusalem",
      value: "Azrieli - College of Engineering Jerusalem",
    },
    { label: "Bar-Ilan University", value: "Bar-Ilan University" },
    { label: "Beit Berl College", value: "Beit Berl College" },

    {
      label: "Bezalel – Academy of Arts and Design",
      value: "Bezalel – Academy of Arts and Design",
    },

    {
      label: "David Yellin College of Education",
      value: "David Yellin College of Education",
    },
    {
      label: "Emuna Ephrata – Academic College",
      value: "Emuna Ephrata – Academic College",
    },
    {
      label: "Givat Washington Academic College of Education",
      value: "Givat Washington Academic College of Education",
    },
    {
      label: "Gordon College of Education",
      value: "Gordon College of Education",
    },
    {
      label: "Hemdat HaDarom – College",
      value: "Hemdat HaDarom – College",
    },
    {
      label: "Holon Institute of Technology",
      value: "Holon Institute of Technology",
    },
    { label: "Jerusalem College", value: "Jerusalem College" },
    {
      label: "Kaye Academic College of Education",
      value: "Kaye Academic College of Education",
    },
    {
      label: "Kibbutzim College",
      value: "Kibbutzim College",
    },
    {
      label: "Kinneret Academic College on The Sea of Galilee",
      value: "Kinneret Academic College on The Sea of Galilee",
    },
    { label: "Lev Academic Center", value: "Lev Academic Center" },
    {
      label: "Levinsky-Wingate Academic Center",
      value: "Levinsky-Wingate Academic Center",
    },
    {
      label: "Lifshitz College of Education",
      value: "Lifshitz College of Education",
    },
    {
      label: "Max Stern Academic College of Emek Yezreel",
      value: "Max Stern Academic College of Emek Yezreel",
    },
    { label: "Netanya Academic College", value: "Netanya Academic College" },
    {
      label: "Ohalo Academic College - Katzrin",
      value: "Ohalo Academic College - Katzrin",
    },
    { label: "Ono Academic College", value: "Ono Academic College" },
    {
      label: "Oranim Academic College of Education",
      value: "Oranim Academic College of Education",
    },
    { label: "Peres Academic Center", value: "Peres Academic Center" },
    { label: "Reichman University", value: "Reichman University" },
    { label: "Ruppin Academic Center", value: "Ruppin Academic Center" },
    {
      label: "Schechter Institute of Jewish Studies",
      value: "Schechter Institute of Jewish Studies",
    },
    { label: "Shalem College", value: "Shalem College" },
    {
      label: "Shenkar – Engineering. Design. Art",
      value: "Shenkar – Engineering. Design. Art",
    },

    { label: "Tel-Aviv University", value: "Tel-Aviv University" },
    { label: "Tel-Hai Academic College", value: "Tel-Hai Academic College" },
    {
      label: "The Academic Center of Law and Business",
      value: "The Academic Center of Law and Business",
    },
    {
      label: "The Academic College of Tel-Aviv – Yaffo",
      value: "The Academic College of Tel-Aviv – Yaffo",
    },
    {
      label: "The Achva Academic College ",
      value: "The Achva Academic College ",
    },
    {
      label: "The Arab Academic College of Education",
      value: "The Arab Academic College of Education",
    },
    {
      label: "The Carmel Academic Center",
      value: "The Carmel Academic Center",
    },
    {
      label: "The College of Law and Business",
      value: "The College of Law and Business",
    },
    {
      label: "The College of Management – Academic Studies",
      value: "The College of Management – Academic Studies",
    },
    {
      label: "The College of Sakhnin for Teacher Education",
      value: "The College of Sakhnin for Teacher Education",
    },
    {
      label: "The Hadassah Academic College",
      value: "The Hadassah Academic College",
    },

    {
      label: "The Israel Academic College in Ramat Gan",
      value: "The Israel Academic College in Ramat Gan",
    },
    {
      label: "The Jerusalem Academy of Music and Dance",
      value: "The Jerusalem Academy of Music and Dance",
    },
    {
      label: "The Open University of Israel",
      value: "The Open University of Israel",
    },
    {
      label: "The Sami Shamoon College of Engineering",
      value: "The Sami Shamoon College of Engineering",
    },
    {
      label: "The Sapir Academic College",
      value: "The Sapir Academic College",
    },
    { label: "The University of Haifa", value: "The University of Haifa" },
    {
      label: "The Weizmann Institute of Science",
      value: "The Weizmann Institute of Science",
    },
  ];

  const handleChange = (event) => {
    setSchool(event.target.value);
  };

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Password and confirm password do not match.");
        return;
      }

      await createUserWithEmailAndPassword(getAuth(), email, password);
      addNewUserToDb();
      navigate("/grades");
    } catch (e) {
      setError(e.message);
    }
  };
  const handleSubmit = (event) => {
    // 👇️ prevent page refresh
    event.preventDefault();
  };

  return (
    <>
      {user ? (
        navigate("/")
      ) : (
        <div className=" flex items-center justify-center	mt-8">
          <form
            className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 "
            onSubmit={handleSubmit}
          >
            <h1 className="text-center font-bold mb-4">Create Account </h1>
            {error && (
              <p className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </p>
            )}
            {/* if error exists, display it */}

            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                className={
                  password == ""
                    ? "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    : "shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                }
                type="password"
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className={
                  password != confirmPassword || confirmPassword == ""
                    ? "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    : "shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                }
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="pb-10">
              <label className="text-bold ">
                Where are you studying?
                <select
                  value={school}
                  onChange={handleChange}
                  className="mx-4  w-min"
                >
                  {academicList.map((option, index) => (
                    <option value={option.value} key={option.value + index}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center justify-between m-auto">
              <button
                onClick={createAccount}
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-auto mb-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Account
              </button>
            </div>
            <div className="text-center">
              <Link to="/login">Already have an account? log in here</Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateAccountPage;
