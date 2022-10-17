import { useState, useEffect } from "react";
import axios from "axios";
import GradesList from "./GradesList";
import GradeAvg from "./GradesAvg";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const GradesPage = () => {
  const [courseName, setCourseName] = useState("");
  const [coursePoints, setCoursePoints] = useState("");
  const [courseGrade, setCourseGrade] = useState("");
  const [semesterValue, setSemesterValue] = useState(1);
  const [yearValue, setYearValue] = useState(1);

  let nameStatus = false;
  let pointsStatus = false;
  let gradeStatus = false;
  const [courseInfo, setCourseInfo] = useState([
    {
      name: "",
      grade: 0,
      pts: 0,
      semester: 1,
    },
  ]);
  const { user, isLoading } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const loadCoursesInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};

      const response = await axios.get("/api/grades", {
        headers,
        params: { year: yearValue, semester: semesterValue },
      });
      const newCourseInfo = response.data;
      setCourseInfo(newCourseInfo);
    };
    if (!isLoading) {
      loadCoursesInfo();
    }
  }, [isLoading, user, semesterValue, yearValue]);

  const addCourseData = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const positiveGrade = Number(courseGrade) < 0 ? 0 : courseGrade;
    const positivePts = Number(coursePoints) <= 0 ? 0 : coursePoints;

    //checking for valid inputs
    courseName === "" ? (nameStatus = false) : (nameStatus = true);
    isNaN(coursePoints) ? (pointsStatus = false) : (pointsStatus = true);
    isNaN(courseGrade) ? (gradeStatus = false) : (gradeStatus = true);

    if (nameStatus && pointsStatus && gradeStatus) {
      const response = await axios.post(
        "/api/grades",
        {
          name: courseName,
          grade: positiveGrade,
          pts: positivePts,
          semester: semesterValue.toString(),
          year: yearValue,
        },
        { headers }
      );
      setCourseInfo(response.data);
      setCourseName(""); //clean input section
      setCourseGrade("");
      setCoursePoints("");
    }
  };

  return (
    <>
      {user ? (
        <div className="w-8/12  content-center	items-center mx-auto  mt-8">
          <GradeAvg
            gradeList={courseInfo}
            semester={semesterValue}
            year={yearValue}
          />
          <div className="bg-gray-700">
            <div className="w-full  px-3  bg-gray-500 rounded-md ">
              <div className="relative pt-1  text-center ">
                <label className=" rounded  py-1 px-2 bg-gray-700 text-gray-100">
                  Year {yearValue}
                </label>
                <input
                  type="range"
                  className="
                
                          form-range
                          appearance-none
                          w-full
                          h-3
                          py-0
                          bg-white
                          rounded
                          focus:outline-none focus:ring-0 focus:shadow-none 
                        "
                  min="1"
                  max="10"
                  value={yearValue}
                  onChange={(e) => setYearValue(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap w-full text-center">
                <button
                  className={
                    semesterValue == "1"
                      ? "mx-auto w-1/4 bg-red-200 hover:bg-red-100 text-black font-bold mb-1 px-4 rounded border-2 border-black"
                      : "mx-auto w-1/4 bg-gray-700 hover:bg-gray-800 text-white font-bold mb-1 px-4 rounded"
                  }
                  onClick={(e) => setSemesterValue("1")}
                >
                  Semester 1
                </button>
                <button
                  className={
                    semesterValue === "2"
                      ? "mx-auto w-1/4 bg-red-200 hover:bg-red-100 text-black font-bold mb-1 px-4 rounded border-2 border-black"
                      : "mx-auto w-1/4 bg-gray-700 hover:bg-gray-800 text-white font-bold mb-1 px-4 rounded"
                  }
                  onClick={(e) => setSemesterValue("2")}
                >
                  Semester 2
                </button>
                <button
                  className={
                    semesterValue === "3"
                      ? "mx-auto w-1/4 bg-red-200 hover:bg-red-100 text-black font-bold mb-1 px-4 rounded border-2 border-black"
                      : "mx-auto w-1/4 bg-gray-700 hover:bg-gray-800 text-white font-bold mb-1 px-4 rounded"
                  }
                  onClick={(e) => setSemesterValue("3")}
                >
                  Semester 3
                </button>
              </div>
            </div>
          </div>
          <>
            <GradesList
              gradeList={courseInfo}
              semester={semesterValue}
              year={yearValue}
              user={user}
              onDataUpdatedNew={(data) => setCourseInfo(data)}
            />
            <div className="bg-gray-700 rounded-b pt-2">
              <div className="flex  ">
                <div className=" w-1/4 px-3 mb-6 flex flex-wrap">
                  <label className="  flex-wrap block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2">
                    Course
                  </label>
                  <input
                    className={
                      courseName == ""
                        ? "appearance-none block w-full bg-gray-100 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "font-bold appearance-none block w-full bg-emerald-200 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    }
                    type="text"
                    placeholder="Name"
                    value={courseName}
                    onChange={(e) => {
                      setCourseName(e.target.value);
                    }}
                  />
                </div>
                <div className=" w-1/4 px-3 mb-6 flex flex-wrap">
                  <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2">
                    Points
                  </label>
                  <input
                    className={
                      isNaN(coursePoints) || coursePoints == ""
                        ? "appearance-none block w-full bg-gray-100 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "font-bold appearance-none block w-full bg-emerald-200 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    }
                    type="text"
                    placeholder="Points"
                    value={coursePoints}
                    onChange={(e) => {
                      e.target.value < 0
                        ? setCoursePoints(0)
                        : setCoursePoints(e.target.value);
                    }}
                  />
                </div>

                <div className=" w-1/4 px-3 mb-6 flex flex-wrap">
                  <label className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2">
                    Grade
                  </label>
                  <input
                    className={
                      isNaN(courseGrade) || courseGrade == ""
                        ? " appearance-none block w-full bg-gray-100 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        : "font-bold appearance-none block w-full bg-emerald-200 text-gray-700 border-4 border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    }
                    type="text"
                    placeholder="0~100"
                    value={courseGrade}
                    onChange={(e) => {
                      e.target.value > 100
                        ? setCourseGrade("100")
                        : setCourseGrade(e.target.value);
                    }}
                  />
                </div>

                <div className="w-1/4 px-3 mb-6  text-center	flex flex-wrap">
                  <button
                    className="bg-green-500 hover:bg-green-400 text-white font-bold  px-4 border-b-4 border-green-700 hover:border-green-500 rounded mt-6 w-full h-4/6"
                    onClick={addCourseData}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export default GradesPage;
