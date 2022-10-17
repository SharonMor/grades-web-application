import { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const StatisticsPage = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [mySchoolName, setMySchoolName] = useState("0");
  const [mySchoolGpa, setMySchoolGpa] = useState(0);
  const [mySchoolNumOfStudents, setMySchoolNumOfStudents] = useState(0);
  const [myGpa, setMyGpa] = useState(0);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  Chart.register(...registerables);

  const chartLabelsBuild = [];
  const chartDataBuild = [];

  const updateChart = (data) => {
    for (let step = 1; step < 30; step++) {
      if (
        !isNaN(data["semester" + step + "Gpa"]) &&
        data["semester" + step + "Gpa"] !== null &&
        data["semester" + step + "Gpa"] !== 0
      ) {
        chartLabelsBuild.push("Semester " + step);
        chartDataBuild.push(data["semester" + step + "Gpa"]);
      }
    }
    setChartLabels(chartLabelsBuild);
    setChartData(chartDataBuild);
  };

  const state = {
    labels: chartLabels,
    datasets: [
      {
        label: "Semester Gpa",
        backgroundColor: "rgba(75,208,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: chartData,
      },
    ],
  };
  useEffect(() => {
    const getSchoolGpa = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};

      if (user) {
        const schoolGpa = await axios.get("/api/statistics", { headers });
        setMySchoolGpa(schoolGpa.data[0].studentsGpa);
        setMySchoolName(schoolGpa.data[0].school);
        setMySchoolNumOfStudents(schoolGpa.data[0].studentsNum);
        const ownGpa = await axios.get("/api/statistics", {
          headers,
          params: { command: "getUserGpa" },
        });
        let ownGpaNanSituation;
        isNaN(ownGpa.data)
          ? (ownGpaNanSituation = 0)
          : (ownGpaNanSituation = ownGpa.data);
        setMyGpa(ownGpaNanSituation);
        const semesestersDetails = await axios.get("/api/statistics", {
          headers,
          params: { command: "getUserSemesters" },
        });
        updateChart(semesestersDetails.data);
      }
    };
    if (!isLoading) {
      getSchoolGpa();
    }
  }, [isLoading, user]);

  return (
    <>
      {user ? (
        <div className="w-full pt-10 relative ">
          <div className="flex mr-20 ml-15">
            <div className="w-5/12 py-2 mr-auto bg-teal-500 hover:bg-teal-400 shadow-md hover:shadow-xl hover:shadow-black shadow-black rounded px-2 transition ease-in-out hover:-translate-y-1  duration-200">
              <h1 className="text-3xl text-center">{mySchoolNumOfStudents}</h1>
              <h1 className="text-center pb-2 font-bold">
                is the number of users from
              </h1>
              <h1 className="text-center pb-2 font-bold">{mySchoolName}</h1>
              <h1 className="text-center pb-2 font-bold">using this app </h1>
            </div>
            <div className="w-5/12 py-2   bg-teal-500 hover:bg-teal-400 shadow-md hover:shadow-xl hover:shadow-black shadow-black rounded px-2 transition ease-in-out hover:-translate-y-1  duration-200">
              <h1 className="text-3xl text-center">{mySchoolGpa.toFixed(1)}</h1>
              <h1 className="text-center pb-2 font-bold">
                is the average Gpa of all the students from
              </h1>
              <h1 className="text-center pb-2 font-bold">{mySchoolName}</h1>
              <h1 className="text-center pb-2 font-bold">using this app </h1>
            </div>
          </div>
          <div className="flex py-8 mr-20 ml-15">
            <div className="w-5/12 py-2  mt-28  bg-teal-500 hover:bg-teal-400 shadow-md hover:shadow-xl hover:shadow-black shadow-black rounded px-2 transition ease-in-out hover:-translate-y-1  duration-200">
              <h1 className="text-3xl text-center">{myGpa.toFixed(1)}</h1>
              <h1 className="text-center pb-2 font-bold">
                is your Gpa
                {mySchoolGpa.toFixed(1) == myGpa.toFixed(1)
                  ? ", which is the exact average Gpa"
                  : ""}
              </h1>
              <h1 className="text-center pb-2 font-bold ">
                <div>
                  {mySchoolGpa.toFixed(1) == myGpa.toFixed(1) ? (
                    ""
                  ) : myGpa == 0 ? (
                    <Link to="/grades" className="text-indigo-900">
                      enter your courses to see where you at!
                    </Link>
                  ) : mySchoolGpa.toFixed(1) > myGpa.toFixed(1) ? (
                    `which is approximately ${(
                      (mySchoolGpa.toFixed(1) / myGpa.toFixed(1)) * 100 -
                      100
                    ).toFixed(1)}% lower than average Gpa`
                  ) : (
                    `which is approximately ${(
                      (myGpa.toFixed(1) / mySchoolGpa.toFixed(1)) * 100 -
                      100
                    ).toFixed(1)}% higher than average Gpa`
                  )}
                </div>
              </h1>
              <h1 className="text-center pb-2 font-bold">
                {mySchoolGpa.toFixed(1) == myGpa.toFixed(1)
                  ? ""
                  : "of the students using this app from your school."}
              </h1>
            </div>
            <div className="w-1/2 py-4 absolute right-2">
              <Bar
                data={state}
                options={{
                  title: {
                    display: true,
                    text: "Average Rainfall per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export default StatisticsPage;
