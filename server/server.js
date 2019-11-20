const express = require('express');
const cors = require('cors');
var mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json()  )

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "todo_app"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', (req, res) => {
        res.json({
            'message' : 'Yo!!!!'
        });
});



app.post('/newTodo', (req, res) => {
    console.log(req.body);
    if(req.body.title.toString().trim() !== ''){
        //DB
        title = req.body.title.toString().trim();
        desc = req.body.desc.toString().trim();
        date = req.body.date.toString().trim();

        console.log("--------------------------");
        console.log(title + "\n" + desc + "\n" + date);
        console.log("--------------------------");
        if(date != "")
            var query = `INSERT INTO todolist(title, description, date) VALUES ('${title}', '${desc}', '${date}')`;
        else
        var query = `INSERT INTO todolist(title, description) VALUES ('${title}', '${desc}')`;
        console.log(query);
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("Query Executed");
          });
        res.json("Done. Task added.");
    }
    else{
        res.status(422);
        res.json("Title feild is mandatory");
    }
});

app.post('/fetchAllTasks', (req, res) => {
    var result1, result2;
    new Promise((resolve) => {
        var query = "SELECT * FROM todolist ORDER BY id DESC";
        con.query(query, function(err, result) {
            if(err) throw err;
            result1 = result//JSON.parse(result);
            // console.log("****RESULT 1****\n");
            // console.log(result1);
            // console.log(typeof(result));
            // console.log("Resolving Promise1");
            return resolve(""); 
        })
    })
    .then(() => {
        new Promise((resolve, reject) => {
            var query = "SELECT * FROM completedlist ORDER BY id DESC";
            con.query(query, function(err, result) {
                if(err) throw err;
                result2 = result//JSON.parse(result);
                // console.log("****RESULT 2****\n");
                // console.log(result2);
                // console.log(typeof(result));
                // console.log("Resolving Promise2");
                return resolve("");
            })  
        })
        .then(() => {
            new Promise((resolve) => {
                console.log("I reached here!");
                result = {"pending":result1, "completed":result2};
                // console.log(result);
                res.json(result);
                console.log("Resolving Promise");
            })
        });
    })   
});

app.post('/completeTask', (req, res) => {
    var id = req.body.id.toString().substring(5);
    console.log("They clicked on task #"+id);

    //SQL -> Insert into completed task , Delete from pending task
    new Promise((resolve) => {
        var query = `insert into completedlist (SELECT * FROM todolist where id = ${id})`;
        con.query(query, function(err, result) {
            if(err) throw err;
            console.log("Added into completedlist");
            return resolve("")
        })})
        .then(() => {
            new Promise((resolve) => {
                var query = `delete from todolist where id = ${id}`;
                con.query(query, function(err, result) {
                if(err) throw err;
                console.log("Deleted from todolist");
                res.json("Done. Task added.");
                return resolve("");
            })      
        })})
});

app.post('/uncompleteTask', (req, res) => {
    var id = req.body.id.toString().substring(5);
    console.log("They clicked on task #"+id);

    //SQL -> Insert into completed task , Delete from pending task
    new Promise((resolve) => {
        var query = `insert into todolist (SELECT * FROM completedlist where id = ${id})`;
        con.query(query, function(err, result) {
            if(err) throw err;
            console.log("Added into completedlist");
            return resolve("")
        })})
        .then(() => {
            new Promise((resolve) => {
                var query = `delete from completedlist where id = ${id}`;
                con.query(query, function(err, result) {
                if(err) throw err;
                console.log("Deleted from todolist");
                res.json("Done. Task added.");
                return resolve("");
            })      
        })})
});

app.listen(5000, ()=>{
    console.log("Listening")
});