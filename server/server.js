const express = require("exrpress"),
      mysql = require("mysql"),
      bodyParser = require("body-parser"),
      cors = require("cors");

const app = express();

const corsOptions = {
    origin : 'http://localhost:4200',
    optionsSuccessStatus : 200
}

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '',
    database : 'tour_of_heroes'
})

dbConn.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(cost(corsOptions))

app.listen(3000, () => {
    console.log("server started");
})
