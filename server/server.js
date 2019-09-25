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
    dbConn.query("DELETE FROM heroPowers WHERE hero_id = ?" , [id] , function(error , result ) {
        if(error) throw error;
        dbConn.query('DELETE FROM heroes WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ message: 'User has been deleted successfully.' });
        });
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
    dbConn.query('DELETE FROM heroPowers WHERE power_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        dbConn.query('DELETE FROM powers WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'power has been deleted successfully.' });
        });    
    });
    
});

//==================================
//ADD DELETE POWER TO HERO ROUTES
//==================================

app.get("/heropowers/:id", function (req, res) {
    let hero_id = req.params.id;
    dbConn.query('SELECT hp.id , h.name as hname , p.name FROM heroPowers hp, heroes h, powers p WHERE hp.hero_id = h.id AND hp.power_id = p.id AND h.id = ?', [hero_id] , function (err, result) {
        if (err) throw err;
        return res.send(result);
    });
});

app.post('/heropowers/:hid/:pid' , function(req,res){
    var heroPower = {
        hero_id : req.params.hid,
        power_id : req.params.pid
    };
    if (!heroPower) {
        return res.status(400).send({ error: true, message: 'please provide power' });
    }
    dbConn.query(`INSERT INTO heroPowers (hero_id , power_id) values('${heroPower.hero_id}','${heroPower.power_id}')` , function(error , result ) {
        if(error) throw err;
        return res.send({data : result , message : "Added power to hero"});
    });
})

app.delete('/heropowers/:id' , function(req,res){
    var id = req.params.id
    if (!id) {
        return res.status(400).send({ error: true, message: 'please provide power' });
    }
    dbConn.query("DELETE from heroPowers where id = ?" , [id] , function(error , result ) {
        if(error) throw err;
        return res.send({data : result , message : "Added power to hero"});
    });
})

//========================================
//COSTUMES ROUTES
//========================================

app.get('/costumes', (req, res) => {
    dbConn.query("SELECT * from costumes", function (err, results) {
        if (err) {
            console.log("can't fetch powers")
        }
        else {
            res.send(results)
        }
    })
});

app.get("/costumes/:id", function (req, res) {
    let costume_id = req.params.id;
    dbConn.query('SELECT * FROM costumes where id=?', costume_id, function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
    });
});

app.post("/costumes", function (req, res) {
    var costume = {
        name: req.body.name
    };
    if (!costume) {
        return res.status(400).send({ error: true, message: 'please provide costume' });
    }
    dbConn.query(`INSERT INTO costumes (name) values('${costume.name}')`, function (error, results) {
        if (error) { throw err }
        else {
            return res.send({data : results , message: "Added new costume successfully" });
        }
    })
})

app.put('/costumes/:id', function (req, res) {
    var costume = {
        name: req.body.name,
        id : req.params.id
    };
    if (!costume) {
        return res.status(400).send({ error: true , message: 'Please provide costume and costume_id' });
    }
    dbConn.query("UPDATE costumes SET name = ? WHERE id = ?" , [costume.name,costume.id] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'costume has been updated successfully.' });
    });
});

app.delete('/costumes/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide power_id' });
    }
    dbConn.query("UPDATE heroes SET costume_id = NULL WHERE costume_id = ?" , [id] , function(error , result ) {
        if(error) throw error;
        dbConn.query('DELETE FROM costumes WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ message: 'costume has been deleted successfully.' });
        });
    });
});

//ADD DELETE COSTUMES FROM HEROES

//SHOW COSTUME OF HERO
app.get("/herocostumes/:id", function (req, res) {
    let hero_id = req.params.id;
    dbConn.query('SELECT heroes.costume_id , costumes.name FROM heroes, costumes WHERE heroes.costume_id = costumes.id AND heroes.id = ?', [hero_id] , function (err, result) {
        if (err) throw err;
    return res.send(result);
});
});

//ADD/UPDATE COSTUME TO HERO
app.put("/herocostumes/:hid/:cid", function (req, res) {
    let hero_id = req.params.hid;
    let costume_id = req.params.cid;
    dbConn.query("UPDATE heroes SET costume_id = ? WHERE id = ?" , [costume_id,hero_id] , function (err, result) {
        if (err) throw err;
    return res.send(result);
});
});

//REMOVE COSTUME FROM HERO
app.put('/herocostumes/:id' , function(req,res){
    var hero_id = req.params.id
    if (!hero_id) {
        return res.status(400).send({ error: true, message: 'please provide power' });
    }
    dbConn.query("UPDATE heroes SET costume_id = NULL WHERE id = ?" , [hero_id] , function(error , result ) {
        if(error) throw error;
        return res.send({data : result , message : "Added power to hero"});
    });
})


//==============================
//CITY ROUTES
//==============================

app.get('/cities', (req, res) => {
    dbConn.query("SELECT * from cities", function (err, results) {
        if (err) {
            console.log("can't fetch cities")
        }
        else {
            res.send(results)
        }
    })
});

app.get('/cities/filtered' , (req,res) => {
    dbConn.query("SELECT heroes.city_id as id,cities.name FROM heroes,cities WHERE heroes.city_id = cities.id AND heroes.city_id != 'NULL'" , function(err,result) {
        if(err){
            console.log(err)
        }
        else
        res.send(result)
    })
})

app.get("/cities/:id", function (req, res) {
    let city_id = req.params.id;
    dbConn.query('SELECT * FROM cities where id=?', city_id, function (err, result) {
        if (err) throw err;
        return res.send(result[0]);
    });
});

app.post("/cities", function (req, res) {
    var city = {
        name: req.body.name
    };
    if (!city) {
        return res.status(400).send({ error: true, message: 'please provide city' });
    }
    dbConn.query(`INSERT INTO cities (name) values('${city.name}')`, function (error, results) {
        if (error) { throw err }
        else {
            return res.send({data : results , message: "Added new city successfully" });
        }
    })
})

app.put('/cities/:id', function (req, res) {
    var city = {
        name: req.body.name,
        id : req.params.id
    };
    if (!city) {
        return res.status(400).send({ error: true , message: 'Please provide city name and city id' });
    }
    dbConn.query("UPDATE cities SET name = ? WHERE id = ?" , [city.name,city.id] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'city has been updated successfully.' });
    });
});

app.delete('/cities/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide city_id' });
    }
    dbConn.query("UPDATE heroes SET city_id = NULL WHERE city_id = ?" , [id] , function(error , result ) {
        if(error) throw error;
        dbConn.query('DELETE FROM cities WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'city has been deleted successfully.' });
        });
        return res.send({message : "removed city from hero"});
    });
    
});

//ADD DELETE CITIES FROM HEROES

//SHOW CITY OF HERO
app.get("/herocity/:id", function (req, res) {
    let hero_id = req.params.id;
    dbConn.query('SELECT heroes.city_id , cities.name FROM heroes, cities WHERE heroes.city_id = cities.id AND heroes.id = ?', [hero_id] , function (err, result) {
        if (err) throw err;
    return res.send(result[0]);
});
});

//ADD/UPDATE CITY OF HERO
app.put("/herocity/:hid/:cid", function (req, res) {
    let hero_id = req.params.hid;
    let city_id = req.params.cid;
    dbConn.query("UPDATE heroes SET city_id = ? WHERE id = ?" , [city_id,hero_id] , function (err, result) {
        if (err) throw err;
    return res.send(result);
});
});

//REMOVE CITY FROM HERO
app.put('/herocity/:id' , function(req,res){
    var hero_id = req.params.id
    if (!hero_id) {
        return res.status(400).send({ error: true, message: 'please provide power' });
    }
    dbConn.query("UPDATE heroes SET city_id = NULL WHERE id = ?" , [hero_id] , function(error , result ) {
        if(error) throw error;
        return res.send({data : result , message : "removed city from hero"});
    });
})



app.listen(3000, () => {
    console.log("server started");
})