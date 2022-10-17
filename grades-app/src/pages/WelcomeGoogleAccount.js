import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import axios from "axios";

const WelcomeGoogleAccount = () => {
  const { user, isLoading } = useUser();
  const [newStudentInfo, setNewStudentInfo] = useState([
    {
      id: "",
      school: "",
    },
  ]);
  const navigate = useNavigate();
  const [school, setSchool] = useState("Other"); //used when first timers using google Acc log in.
  const handleChange = (event) => {
    setSchool(event.target.value);
  };
  const [modalIsOpen, setModalIsOpen] = useState(true);

  // styles for modal imported from modal npm
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "50%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const saveChanges = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const info = {
      school: school,
    };
    const response = await axios.put("/api/grades/welcome", info, { headers });

    if (response) {
      navigate("/grades");
    }
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

  return (
    <>
      <div>
        <Modal isOpen={modalIsOpen} ariaHideApp={false} style={customStyles}>
          <div className="flex">
            <p className="text-bold font-sans text-3xl mx-auto flex">
              Welcome, is this your first time?
            </p>
          </div>
          <div className="flex py-3 px-10">
            <label className=" w-min ml-auto font-bold border-y-4 border-l-4 border-red-100 px-2 py-1 ">
              School:
            </label>
            <select
              value={school}
              onChange={handleChange}
              className=" w-min bg-red-100 py-2 rounded-r-2xl mr-auto"
            >
              {academicList.map((option, index) => (
                <option value={option.value} key={option.value + index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setModalIsOpen(false);
              saveChanges();
            }}
            className="text-white bg-gray-600 hover:bg-gray-200 hover:text-black hover:border-2 hover:border-black p-4 mx-auto font-medium rounded-lg flex  "
          >
            Continue to App
          </button>
        </Modal>
      </div>
    </>
  );
};

export default WelcomeGoogleAccount;
