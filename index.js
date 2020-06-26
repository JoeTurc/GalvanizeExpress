const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || "3000";
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var id = 2;

var students = {
    "000": {
        "un": "Joe",
        "name": "Joseph",
        "email": "joe@test.com",
        "grades": [
            {"name": "Calc1", "grade": "B"}
        ]
    },
    "001": {
        "un": "Dani",
        "name": "Danielle",
        "email": "dani@test.com",
        "grades": [
            {"name": "Art", "grade": "A"}
        ]
    }
};

app.get("/", (req, res) => {
    res.send("Main page");
});

app.get("/students", (req, res) => {
    let output = "";
    for (const student in students) {
        let stud = students[student];
        if (req.query.search) {
            if (stud.un.includes(req.query.search) ||
                stud.name.includes(req.query.search))
                output += `Username: ${stud.un}<br/>Name: ${stud.name}<br/><br/>`
        } else {
            output += `Username: ${stud.un}<br/>Name: ${stud.name}<br/><br/>`
        }
    }
    if (!output)
        output = "No students in database";
    res.send(output);
})

app.get("/students/:studentId", (req, res) => {
    let output = "";
    let stud = students[req.params.studentId];
    if (stud) {
        output += `Username: ${stud.un}<br/>Name: ${stud.name}<br/><br/>`;
    } else {
        output += "No student by that id exists";
    }
    res.send(output);
})

app.get("/grades/:studentId", (req, res) => {
    let output = "";
    let stud = students[req.params.studentId];
    if (stud) {
        output += `Username: ${stud.un}<br/>Name: ${stud.name}<br/>Grades:<br/>${stud.grades.map((item) => `${item.name}: ${item.grade}<br/>`).join('')}<br/>`;
    } else {
        output += "No student by that id exists";
    }
    res.send(output);
})

app.post("/register", (req, res) => {
    if (req.body.user && req.body.name && req.body.email) {
        students[pad(id++, 3)] = {"un": req.body.user, "name": req.body.name, "email": req.body.email, "grades": []}
        res.json({status: 200});
    } else {
        res.json({status: 401})
    }
})

app.post("/grades", (req, res) => {
    if (req.body.grade && req.body.name && req.body.studentId) {
        students[req.body.studentId].grades.push({"name": req.body.name, "grade": req.body.grade})
        res.json({status: 200});
    } else {
        res.json({status: 401})
    }
})

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });