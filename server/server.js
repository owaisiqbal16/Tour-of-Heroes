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
    dbConn.query("SELECT * from heroes" , function( err , results ){
        if(err){
            console.log("can't fetch heroes")
        }
        else{
           res.send(results) 
        }
    })
});


app.listen(3000, () => {
    console.log("server started");
})
