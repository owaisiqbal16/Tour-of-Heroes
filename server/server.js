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
    password: 'rootpasswordgiven',
    database: 'tour_of_heroes'
})

dbConn.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors(corsOptions))

//==========================================
//HEROES ROUTES
//==========================================
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
        name: req.body.name
    };
    if (!hero) {
        return res.status(400).send({ error: true, message: 'please provide user' });
    }
    dbConn.query(`INSERT INTO heroes (name) values('${hero.name}')`, function (error, results) {
        if (error) { throw error }
        else {
            return res.send({data : results , message: "Added new user successfully" });
        }
    })
})

app.put('/hero/:id', function (req, res) {
    var hero = {
        name: req.body.name,
        id : req.body.id
    };
    if (!hero) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE heroes SET name = ? WHERE id = ?" , [hero.name,hero.id] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});

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

app.get("heroes/?name=:term", function (req, res) {
    let term = req.params.id;
    if (!term) {
        return res.status(400).send({ error: true, message: 'Please provide Hero Id' });
    }
    dbConn.query('SELECT * FROM heroes where name=?', term, function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
    });
});

//=================================
//POWERS ROUTES
//=================================

app.get('/powers', (req, res) => {
    dbConn.query("SELECT * from powers", function (err, results) {
        if (err) {
            console.log("can't fetch powers")
        }
        else {
            res.send(results)
        }
    })
});

app.get("/powers/:id", function (req, res) {
    let power_id = req.params.id;
    if (!power_id) {
        return res.status(400).send({ error: true, message: 'Please provide Power Id' });
    }
    dbConn.query('SELECT * FROM powers where id=?', power_id, function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
    });
});

app.post("/powers", function (req, res) {
    var power = {
        name: req.body.name
    };
    if (!power) {
        return res.status(400).send({ error: true, message: 'please provide user' });
    }
    dbConn.query(`INSERT INTO powers (name) values('${power.name}')`, function (error, results) {
        if (error) { throw err }
        else {
            return res.send({data : results , message: "Added new power successfully" });
        }
    })
})

app.put('/powers/:id', function (req, res) {
    var power = {
        name: req.body.name,
        id : req.params.id
    };
    if (!power) {
        return res.status(400).send({ error: true , message: 'Please provide power and power_id' });
    }
    dbConn.query("UPDATE powers SET name = ? WHERE id = ?" , [power.name,power.id] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'power has been updated successfully.' });
    });
});

app.delete('/powers/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide power_id' });
    }
    dbConn.query('DELETE FROM powers WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'power has been deleted successfully.' });
    });
});

//==================================
app.get("/heropowers/:id", function (req, res) {
    let hero_id = req.params.id;
    dbConn.query('SELECT hp.id , h.name as hname , p.name FROM heroPowers hp, heroes h, powers p WHERE hp.hero_id = h.id AND hp.power_id = p.id AND h.id = ?', [hero_id] , function (err, result) {
        if (err) throw err;
        return res.send(result);
    });
});

app.post('/heropowers/:id' , function(req,res){
    let hero_id = req.params.id;
    let power_id = req.body.power_id;
    console.log("Hero id is " + hero_id)
    console.log("Powe id is " + power_id)
    dbConn.query(`INSERT INTO heroPowers (hero_id , power_id) values('${hero_id}','${power_id}')` , function(err , result ) {
        if(err) throw err;
        return res.send(result);
    });
})


app.listen(3000, () => {
    console.log("server started");
})