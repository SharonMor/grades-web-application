import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import LoginPage from "./LoginPage";

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  // grades-app\public\utils\pictures\gradesChart.png
  return (
    <>
      <div>
        {user ? (
          <div>
            <h1 className="text-center font-bold text-2xl py-2 hover:scale-125 duration-500">
              Grades Calculator
            </h1>
            <div className=" flex pt-10 ">
              <div
                id="grades"
                className="pr-20 pl-20   non-italic text-justify font-semibold"
              >
                <h1 className="pb-20 text-lg ">
                  Insert your grades, Know your GPA, Get a better sight about
                  your overall grades and Start Planning your future semesters!
                  are you still here? :D
                </h1>

                <img
                  src="../utils/pictures/gradesTable.png"
                  alt="grades chart example"
                  width="500  "
                  height="600"
                  className="  w-max shadow-md hover:scale-110 hover:shadow-lg hover:shadow-red-700 hover:border-4 hover:border-black "
                  onClick={() => navigate("/grades")}
                ></img>
              </div>
              <div
                id="statistics"
                className="px-20 non-italic text-justify font-semibold"
              >
                <h1 className="pb-14 text-lg">
                  See how many students from your academic institution are using
                  this app, know where you're standing, Get a clear sight about
                  how you improved over the semesters
                </h1>
                <img
                  src="../utils/pictures/gradesChart.png"
                  alt="grades table example"
                  width="500"
                  height="600"
                  className=" w-max shadow-md scale-105 hover:scale-110 hover:shadow-lg hover:shadow-red-700 hover:border-4 hover:border-black"
                  onClick={() => navigate("/statistics")}
                ></img>
              </div>
            </div>
          </div>
        ) : (
          navigate("/login")
        )}
      </div>
    </>
  );
};

export default HomePage;
