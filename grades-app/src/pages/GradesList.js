import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsFillCheckSquareFill } from "react-icons/bs";
import axios from "axios";

const GradesList = ({ gradeList, semester, year, user, onDataUpdatedNew }) => {
  const [editFlag, SetEditFlag] = useState(-1);
  let backgroundEven = true;
  const [newEditName, setNewEditName] = useState("");
  const [newEditGrade, setNewEditGrade] = useState(0);
  const [newEditPts, setNewEditPts] = useState(0);
  let nameStatus = true;
  let pointsStatus = true;
  let gradeStatus = true;

  const updateCourseData = async ({ gradeItem }) => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const info = {
      name: gradeItem.name,
      grade: gradeItem.grade,
      pts: gradeItem.pts,
      semester: gradeItem.semester,
      year: gradeItem.year,
      newName: newEditName,
      newGrade: newEditGrade,
      newPts: newEditPts,
      command: "update",
    };

    newEditName === "" ? (nameStatus = false) : (nameStatus = true);
    isNaN(newEditPts) || newEditPts == 0
      ? (pointsStatus = false)
      : (pointsStatus = true);
    isNaN(newEditGrade) ? (gradeStatus = false) : (gradeStatus = true);
    if (!nameStatus || !pointsStatus || !gradeStatus) {
      alert(
        "Oops! seems like you've tried to enter invalid input! please try again. name must be atleast 1 letter and grade/points must be numbers! also, please don't try to put 0 as points :D thanks!"
      );
    }

    if (nameStatus && pointsStatus && gradeStatus) {
      const response = await axios.put("/api/grades", info, { headers });

      onDataUpdatedNew(response.data);
    }
  };

  const deleteCourseData = async ({ gradeItem }) => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const info = {
      name: gradeItem.name,
      grade: gradeItem.grade,
      pts: gradeItem.pts,
      semester: gradeItem.semester,
      year: gradeItem.year,
      command: "delete",
    };
    const response = await axios.put("/api/grades", info, { headers });
    onDataUpdatedNew(response.data);
  };

  return (
    <>
      <div className="">
        <div className="bg-gray-700 rounded- pt-1 border-b-4 border-gray-800">
          <div className="flex flex-wrap  ">
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block  tracking-wide text-gray-200 text-xs font-bold mb-2 text-center">
                Course Name
              </label>
            </div>
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block  tracking-wide text-gray-200 text-xs font-bold mb-2 text-center">
                Course Points
              </label>
            </div>

            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block  tracking-wide text-gray-200 text-xs font-bold mb-2 text-center">
                Course Grade
              </label>
            </div>
          </div>
        </div>
        <>
          <div className="border-b-4 border-gray-800 ">
            {gradeList.map((gradeItem, index) => (
              <div
                key={
                  gradeItem.grade +
                  ": " +
                  gradeItem.name +
                  "keystuff" +
                  gradeItem.__id
                }
              >
                {semester == gradeItem.semester && year == gradeItem.year ? (
                  <div
                    className={
                      backgroundEven ? "bg-gray-600  px-3" : "bg-gray-700  px-3"
                    }
                  >
                    {(backgroundEven = !backgroundEven)}
                    {/* change background color */}
                    <div className="flex flex-wrap -mx-3    ">
                      <div
                        id={"name" + index}
                        className={
                          nameStatus
                            ? "w-full md:w-1/4 px-3 py-2 md:mb-0 border-r-4  border-gray-800	"
                            : "w-full md:w-1/4 px-3 py-2 md:mb-0 border-r-4  bg-red-300	"
                        }
                      >
                        {editFlag === index ? (
                          <input
                            onChange={(e) => setNewEditName(e.target.value)}
                            defaultValue={
                              gradeItem.name.charAt(0).toUpperCase() +
                              gradeItem.name.slice(1)
                            }
                            className=" w-full  text-gray-800 text-sm font-bold  text-center  "
                          ></input>
                        ) : (
                          <label className="block uppercase tracking-wide text-gray-200 text-sm font-bold  text-center  ">
                            {gradeItem.name}
                          </label>
                        )}
                      </div>
                      <div
                        id={"pts" + index}
                        className="w-full md:w-1/4 px-3 py-2 md:mb-0 border-r-4  border-gray-800"
                      >
                        {editFlag === index ? (
                          <input
                            onChange={(e) => {
                              setNewEditPts(e.target.value);
                            }}
                            defaultValue={gradeItem.pts}
                            className=" w-full  text-gray-800 text-sm font-bold  text-center  "
                          ></input>
                        ) : (
                          <label className="block uppercase tracking-wide text-gray-200 text-sm font-bold  text-center ">
                            {gradeItem.pts}
                          </label>
                        )}
                      </div>

                      <div
                        id={"grade" + index}
                        className="w-full md:w-1/4 px-3 py-2 md:mb-0 border-r-4  border-gray-800"
                      >
                        {editFlag === index ? (
                          <input
                            onChange={(e) => {
                              e.target.value > 100
                                ? setNewEditGrade("100")
                                : setNewEditGrade(e.target.value);
                            }}
                            defaultValue={gradeItem.grade}
                            className=" w-full  text-gray-800 text-sm font-bold  text-center  "
                          ></input>
                        ) : (
                          <label className="block uppercase tracking-wide text-gray-200 text-sm font-bold  text-center ">
                            {gradeItem.grade}
                          </label>
                        )}
                      </div>

                      <div
                        className=" w-1/4 px-3 pt-1 md:mb-0 text-center	"
                        onClick={() => {
                          SetEditFlag(editFlag === index ? -1 : index);
                        }}
                      >
                        {editFlag === index ? (
                          <div className=" ">
                            <button
                              className="bg-lime-500  rounded mr-1 mt-1"
                              onClick={() => {
                                updateCourseData({ gradeItem });
                                SetEditFlag(-1);
                              }}
                            >
                              <BsFillCheckSquareFill
                                size={25}
                                className="text-lime-500  bg-white  rounded mx-4 "
                              />
                            </button>
                            <button
                              className="bg-red-200 rounded ml-1 mt-1"
                              onClick={() => {
                                deleteCourseData({ gradeItem });
                                SetEditFlag(-1);
                              }}
                            >
                              <FiTrash2
                                size={25}
                                className="text-black  bg-red-200 rounded mx-4 "
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            id={index}
                            className="bg-red-500 hover:bg-red-400 text-white font-bold  px-4 border-x-2 border-b-4 border-red-700 hover:red-green-500 rounded  py-1 w-full h-5/6"
                            onClick={() => {
                              SetEditFlag(editFlag === index ? -1 : index);
                              setNewEditGrade(gradeItem.grade);
                              setNewEditName(gradeItem.name);
                              setNewEditPts(gradeItem.pts);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  );
};

export default GradesList;
