import { useState } from "react";

const GradeAvg = ({ gradeList, semester, year }) => {
  //   const [courseAvg, setCourseAvg] = useState(0);
  //   const [totalSum, setTotalSum] = useState(0);
  //   const [totalPoints, setTotalPoints] = useState(0);
  let totalSum = 0;
  let totalPts = 0;
  let totalAvg = 0;
  let yearlySum = 0;
  let yearlyPts = 0;
  let yearlyAvg = 0;
  let semSum = 0;
  let semPts = 0;
  let semAvg = 0;

  gradeList.forEach(function (arrayItem) {
    if (arrayItem.year == year) {
      yearlySum = yearlySum + Number(arrayItem.grade) * Number(arrayItem.pts);
      yearlyPts = yearlyPts + Number(arrayItem.pts);
      if (arrayItem.semester == semester) {
        semSum = semSum + Number(arrayItem.grade) * Number(arrayItem.pts);
        semPts = semPts + Number(arrayItem.pts);
      }
    }
    totalSum = totalSum + Number(arrayItem.grade) * Number(arrayItem.pts);
    totalPts = totalPts + Number(arrayItem.pts);
  });
  yearlyAvg = yearlySum / yearlyPts;
  totalAvg = totalSum / totalPts;
  semAvg = semSum / semPts;

  return (
    <>
      <>
        <div className="flex  bg-gray-700 rounded rounded-b-none py-1 px-3">
          <div className="mr-auto">
            <label className=" block   text-base font-medium text-gray-200">
              GPA: {isNaN(totalAvg) ? 0 : Number(totalAvg.toFixed(1))}{" "}
            </label>
            <label className=" block   text-base font-medium text-gray-200">
              Points: {totalPts}
            </label>
          </div>
          <div className="ml-auto">
            <label className=" block   text-base font-medium text-gray-200">
              Year {year} GPA: {isNaN(yearlyAvg) ? 0 : yearlyAvg.toFixed(1)}
            </label>
            <label className=" block   text-base font-medium text-gray-200">
              Semester {semester} GPA: {isNaN(semAvg) ? 0 : semAvg.toFixed(1)}
            </label>
          </div>
        </div>
      </>
    </>
  );
};

export default GradeAvg;
