const express = require("express");
const bodyParser = require("body-parser");
var mysql = require('mysql');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tour_of_heroes1'
})

dbConn.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors(corsOptions))


app.get('/heroes', (req, res) => {
    dbConn.query("SELECT * from heroes", function (err, results) {
        if (err) {
            console.log("can't fetch heroes")
        }
        else {
            res.send(results)
        }
    })
});

app.get("/heroes/:id", function (req, res) {
    let hero_id = req.params.id;
    if (!hero_id) {
        return res.status(400).send({ error: true, message: 'Please provide Hero Id' });
    }
    dbConn.query('SELECT * FROM heroes where id=?', hero_id, function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
    });
});

app.post("/heroes", function (req, res) {
    var hero = {
        name: req.body.name,
        id : req.body.id
    };
    if (!hero) {
        return res.status(400).send({ error: true, message: 'please provide user' });
    }
    dbConn.query(`INSERT INTO heroes (id,name) values('${hero.id}','${hero.name}')`, function (error, results) {
        if (error) { throw err }
        else {
            return res.send({data : results , message: "Added new user successfully" });
        }
    })
})

app.delete('/hero/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM heroes WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
});


app.listen(3000, () => {
    console.log("server started");
})
