import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { db, connectToDb } from "./db.js";

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
// middleware:
app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      console.log("problem - msg in terminal");
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next(); //make sure middleware is finished and can move to actual request
});

// @@@@@@@@@@    user loads grades page:    @@@@@@@@@@    user loads grades page:    @@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@
app.get("/api/grades", async (req, res) => {
  const { uid } = req.user; //firebases auth user id.
  // const query = { year: year, semester: semester, id: uid };
  const query = { id: uid };

  const grades = await db.collection("courses").find(query).toArray(); //.toArray()

  if (grades) {
    res.json(grades);
  } else {
    res.sendStatus(404);
  }
});

// @@@@@@@@@@    user loads statistics page:    @@@@@@@@@@    user loads statistics page:    @@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@
app.get("/api/statistics", async (req, res) => {
  const { uid } = req.user; //firebases auth user id.
  // const { year, semester } = req.query;
  // const query = { year: year, semester: semester, id: uid };
  const { command } = req.query;
  if (command == "getUserGpa") {
    const { gpa } = await db.collection("students").findOne({ id: uid });
    if (gpa) {
      res.json(gpa);
    } else {
      res.json(0);
    }
  } else if (command == "getUserSemesters") {
    const userDetails = await db.collection("students").findOne({ id: uid });
    if (userDetails) res.json(userDetails);
    else {
      res.send(404);
    }
  } else {
    const { school } = await db.collection("students").findOne({ id: uid });

    const query = { school: school };

    const schoolInfo = await db.collection("schools").find(query).toArray(); //.toArray()

    if (schoolInfo) {
      res.json(schoolInfo);
    } else {
      res.sendStatus(404);
    }
  }
});

// @@@@@@@@@@    user updates/deletes course:    @@@@@@@@@@    user updates/deletes course:    @@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@
app.put("/api/grades", async (req, res) => {
  const { uid } = req.user;
  const {
    name,
    grade,
    pts,
    semester,
    year,
    newName,
    newGrade,
    newPts,
    command,
  } = req.body;
  const filter = {
    name: name,
    grade: grade,
    pts: pts,
    semester: semester,
    year: year,
  };
  const filterForStudentUpdate = {
    id: uid,
  };

  const { totalGrade, totalPts } = await db
    .collection("students")
    .findOne({ id: uid });

  const { school, gpa } = await db.collection("students").findOne({ id: uid });
  const { studentsTotalGpaStack, studentsNum } = await db
    .collection("schools")
    .findOne({ school: school });

  const studentInfoForSemester = await db
    .collection("students")
    .findOne({ id: uid });

  let oldSemesterTotal;
  let oldSemesterPts;
  isNaN(
    studentInfoForSemester[
      "semester" + [Number(semester) + 3 * year - 3] + "totalGrade"
    ]
  )
    ? (oldSemesterTotal = 0)
    : (oldSemesterTotal =
        studentInfoForSemester[
          "semester" + [Number(semester) + 3 * year - 3] + "totalGrade"
        ]);
  isNaN(
    studentInfoForSemester[
      "semester" + [Number(semester) + 3 * year - 3] + "totalPts"
    ]
  )
    ? (oldSemesterPts = 0)
    : (oldSemesterPts =
        studentInfoForSemester[
          "semester" + [Number(semester) + 3 * year - 3] + "totalPts"
        ]);

  if (command === "update") {
    const updateDoc = {
      $set: {
        name: newName,
        grade: newGrade,
        pts: newPts,
      },
    };

    const updateDocForStudentUpdate = {
      $inc: {
        totalGrade: newGrade * newPts - grade * pts,
        totalPts: newPts - pts,
        ["semester" + [Number(semester) + 3 * year - 3] + "totalGrade"]:
          Number(newGrade) * Number(newPts) - grade * pts,
        ["semester" + [Number(semester) + 3 * year - 3] + "totalPts"]:
          Number(newPts) - Number(pts),
      },
      $set: {
        gpa:
          (totalGrade + (newGrade * newPts - grade * pts)) /
          (totalPts + (newPts - pts)),
        ["semester" + [Number(semester) + 3 * year - 3] + "Gpa"]:
          (oldSemesterTotal +
            (Number(newGrade) * Number(newPts) - grade * pts)) /
          (oldSemesterPts + (Number(newPts) - pts)),
      },
    };

    const updateStudent = await db
      .collection("students")
      .updateOne(filterForStudentUpdate, updateDocForStudentUpdate);
    const update = await db.collection("courses").updateOne(filter, updateDoc);
    // updating total gpa inside schools collection

    const filterForSchoolsUpdate = {
      school: school,
    };
    const updateDocForSchoolsUpdate = {
      $inc: {
        // new gpa - old gpa
        studentsTotalGpaStack:
          (totalGrade + (newGrade * newPts - grade * pts)) /
            (totalPts + (newPts - pts)) -
          gpa,
      },
      // set:( old total gpa stack + change of self gpa) / number of students
      $set: {
        studentsGpa:
          (studentsTotalGpaStack +
            ((totalGrade + (newGrade * newPts - grade * pts)) /
              (totalPts + (newPts - pts)) -
              gpa)) /
          studentsNum,
      },
    };
    const updateSchoolDb = await db
      .collection("schools")
      .updateOne(filterForSchoolsUpdate, updateDocForSchoolsUpdate);
  } else if (command === "delete") {
    const filterForStudentDelete = {
      id: uid,
    };
    // make sure when user deleted last course the program wont divide by 0
    if (totalPts == pts) {
      const updateDocForStudentDelete = {
        $inc: {
          totalGrade: -(grade * pts),
          totalPts: -pts,
          ["semester" + [Number(semester) + 3 * year - 3] + "totalGrade"]: -(
            grade * pts
          ),
          ["semester" + [Number(semester) + 3 * year - 3] + "totalPts"]: -pts,
        },
        $set: {
          gpa: 0,
          ["semester" + [Number(semester) + 3 * year - 3] + "Gpa"]: 0,
        },
      };
      const updateDelete = await db
        .collection("students")
        .updateOne(filterForStudentDelete, updateDocForStudentDelete);
    } else {
      const updateDocForStudentDelete = {
        $inc: {
          totalGrade: -(grade * pts),
          totalPts: -pts,
          ["semester" + [Number(semester) + 3 * year - 3] + "totalGrade"]:
            -Number(grade) * Number(pts),
          ["semester" + [Number(semester) + 3 * year - 3] + "totalPts"]:
            -Number(pts),
        },
        $set: {
          gpa: (totalGrade - grade * pts) / (totalPts - pts),
          ["semester" + [Number(semester) + 3 * year - 3] + "Gpa"]:
            (oldSemesterTotal - Number(grade) * Number(pts)) /
            (oldSemesterPts - Number(pts)),
        },
      };
      const updateDelete = await db
        .collection("students")
        .updateOne(filterForStudentDelete, updateDocForStudentDelete);
    }

    const deleteCourse = await db.collection("courses").deleteOne(filter);
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const filterForSchoolsDelete = {
      school: school,
    };

    if (totalPts == pts) {
      const updateDocForSchoolsDelete = {
        $inc: {
          // new gpa - old gpa
          studentsTotalGpaStack: -gpa,
        },
        // set:( old total gpa stack + change of self gpa) / number of students
        $set: {
          studentsGpa: 0,
        },
      };
      const updateSchoolDbOnDelete = await db
        .collection("schools")
        .updateOne(filterForSchoolsDelete, updateDocForSchoolsDelete);
    } else {
      const updateDocForSchoolsDelete = {
        $inc: {
          // new gpa - old gpa
          studentsTotalGpaStack:
            (totalGrade - grade * pts) / (totalPts - pts) - gpa,
        },
        // set:( old total gpa stack + change of self gpa) / number of students
        $set: {
          studentsGpa:
            (studentsTotalGpaStack +
              ((totalGrade - grade * pts) / (totalPts - pts) - gpa)) /
            studentsNum,
        },
      };
      const updateSchoolDbOnDelete = await db
        .collection("schools")
        .updateOne(filterForSchoolsDelete, updateDocForSchoolsDelete);
    }

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  }
  const courses = await db.collection("courses").find({ id: uid }).toArray();
  if (courses) {
    res.json(courses);
  } else {
    res.send("no courses found");
  }
});

//adding logInWithGoogle new accounts to db..
app.post("/api/login", async (req, res) => {
  const { uid } = req.user; //firebases auth user id.
  const { id } = req.body;
  const status = await db.collection("students").insertOne({
    id: id,
    school: "Other",
  });

  if (status) {
    res.json(status);
  } else {
    res.send("no Student found");
  }
});

app.put("/api/grades/welcome", async (req, res) => {
  const { uid } = req.user;
  const { school } = req.body;
  const filter = {
    id: uid,
  };

  const updateDoc = {
    $set: {
      school: school,
    },
  };
  const options = { upsert: true }; //creates document if doesn't exist

  const updateSchoolToGoogleUser = await db
    .collection("students")
    .updateOne(filter, updateDoc, options);

  const filterNew = { school: school };
  const updateDocNew = {
    $inc: { studentsNum: 1, studentsGpa: 0 },
  };

  const schoolIncreaseStudentsNum = await db
    .collection("schools")
    .updateOne(filterNew, updateDocNew, options);

  const studentAfterUpdate = await db
    .collection("students")
    .find({ id: uid })
    .toArray();

  if (studentAfterUpdate) {
    res.json(studentAfterUpdate);
  } else {
    res.send("no Student found");
  }
});

// @@@@@@@@@@    user adds new course:    @@@@@@@@@@    user adds new course:    @@@@@@@@@@    user adds new course:    @@@@@@@@@@
app.post("/api/grades", async (req, res) => {
  const { uid } = req.user; //firebases auth user id.
  const { name, grade, pts, semester, year } = req.body;
  const status = await db.collection("courses").insertOne({
    id: uid,
    name: name,
    grade: grade,
    pts: pts,
    semester: semester,
    year: year,
  });

  //update student gpa/totalGrade/totalPts
  const options = { upsert: true }; //creates document if doesn't exist
  const { totalGrade, totalPts, gpa, school } = await db
    .collection("students")
    .findOne({ id: uid });
  const filter = { id: uid };
  let oldTotalGrade;
  let oldTotalPts;
  let oldGpa;
  {
    isNaN(totalGrade) ? (oldTotalGrade = 0) : (oldTotalGrade = totalGrade);
  }
  {
    isNaN(totalPts) ? (oldTotalPts = 0) : (oldTotalPts = totalPts);
  }
  {
    isNaN(gpa) ? (oldGpa = 0) : (oldGpa = gpa);
  }

  const studentInfoForSemester = await db
    .collection("students")
    .findOne({ id: uid });

  let oldSemesterTotal;
  let oldSemesterPts;

  isNaN(
    studentInfoForSemester[
      "semester" + [Number(semester) + 3 * year - 3] + "totalGrade"
    ]
  )
    ? (oldSemesterTotal = 0)
    : (oldSemesterTotal =
        studentInfoForSemester[
          "semester" + [Number(semester) + 3 * year - 3] + "totalGrade"
        ]);
  isNaN(
    studentInfoForSemester[
      "semester" + [Number(semester) + 3 * year - 3] + "totalPts"
    ]
  )
    ? (oldSemesterPts = 0)
    : (oldSemesterPts =
        studentInfoForSemester[
          "semester" + [Number(semester) + 3 * year - 3] + "totalPts"
        ]);

  const updateDoc = {
    $inc: {
      totalGrade: Number(grade) * Number(pts),
      totalPts: Number(pts),
      ["semester" + [Number(semester) + 3 * year - 3] + "totalGrade"]:
        Number(grade) * Number(pts),
      ["semester" + [Number(semester) + 3 * year - 3] + "totalPts"]:
        Number(pts),
    },
    $set: {
      gpa:
        (oldTotalGrade + Number(grade) * Number(pts)) /
        (oldTotalPts + Number(pts)),
      ["semester" + [Number(semester) + 3 * year - 3] + "Gpa"]:
        (oldSemesterTotal + Number(grade) * Number(pts)) /
        (oldSemesterPts + Number(pts)),
    },
  };
  const studentDataUpdate = await db
    .collection("students")
    .updateOne(filter, updateDoc, options);
  //update school section

  const { studentsTotalGpaStack, studentsNum } = await db
    .collection("schools")
    .findOne({ school: school });

  let oldTotalGpaStack;
  {
    isNaN(studentsTotalGpaStack)
      ? (oldTotalGpaStack = 0)
      : (oldTotalGpaStack = studentsTotalGpaStack);
  }

  const schoolFilter = { school: school };
  // updating avg gpa of all the users.
  //  this called when a user is adding a new course - so in order to update
  // avg gpa we need to update his part inside the calculation:
  //  change the stack of total GPAs:decrease by old gpa, increase by new gpa
  const updateSchoolDoc = {
    // inc formula explained : inc by :(newStudentGpa-oldStudentGpa)
    // increase studentsTotalGpaStack by the change this added-course made to the user's gpa.
    $inc: {
      studentsTotalGpaStack:
        (oldTotalGrade + Number(grade) * Number(pts)) /
          (oldTotalPts + Number(pts)) -
        oldGpa,
    },
    // set studentsGpa =
    // (oldTotalStudentsGpasStacked + change(the diff that user's new cours made))
    //  /divideBy/ number of students
    $set: {
      studentsGpa:
        (oldTotalGpaStack +
          ((oldTotalGrade + Number(grade) * Number(pts)) /
            (oldTotalPts + Number(pts)) -
            oldGpa)) /
        studentsNum,
    },
  };

  const schoolDataUpdate = await db
    .collection("schools")
    .updateOne(schoolFilter, updateSchoolDoc, options);

  const courses = await db.collection("courses").find({ id: uid }).toArray();
  if (courses) {
    res.json(courses);
  } else {
    res.send("no courses found");
  }
});

// @@@@@@@@ user creates account @@@@@@@@ @@@@@@@@ user creates account @@@@@@@@ @@@@@@@@ user creates account @@@@@@@@
app.post("/api/create-account", async (req, res) => {
  const { uid } = req.user; //firebases auth user id.
  const { school, id } = req.body;
  const status = await db.collection("students").insertOne({
    id: id,
    school: school,
  });

  const options = { upsert: true }; //creates document if doesn't exist
  const filter = { school: school };
  const updateDoc = {
    $inc: { studentsNum: 1, studentsGpa: 0 },
  };

  const schoolIncreaseStudentsNum = await db
    .collection("schools")
    .updateOne(filter, updateDoc, options);

  const student = await db.collection("students").find({ id: uid }).toArray();
  if (student) {
    res.json(student);
  } else {
    res.send("no students found");
  }
});

app.get("/api/login", async (req, res) => {
  const { newId } = req.query;
  // const query = { year: year, semester: semester, id: uid };
  const query = { id: newId };
  const studentInfo = await db.collection("students").find(query).toArray(); //.toArray()

  if (studentInfo) {
    res.json(studentInfo);
  } else {
    res.sendStatus(404);
  }
});

// connecting to MongoDB
connectToDb(() => {
  //server will start only after connection to db (callback)
  console.log("Successfully connected to database!");
  app.listen(8000, () => {
    console.log("Server is listening on port 8000");
  });
});
