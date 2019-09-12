var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var corsOptions = {
    origin: 'http://localhost:4200/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/', cors(corsOptions), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for only example.com.'})
})

// app.get('/', function (req, res) {
   
//     var sql = require("mssql");
//     console.log("In server")
//     // config for your database
//     var config = {
//         user: 'sa',
//         password: 'abc1234-',
//         server: '192.168.3.109', 
//         database: 'VOTE_2562' 
//     };

//     // connect to your database
//     sql.connect(config, function (err) {
        
//         if (err) console.log(err);
//         // create Request object
//         var request = new sql.Request();
        
//         // query to the database and get the records
//         request.query('select * from Region where RgnID = 1', function (err, recordset) {
//             if (err) console.log(err)

//             // send records as a response
//             res.send(recordset);
            
//         });
//     });
// });

var server = app.listen(5000, function () {
    console.log('Server is running..');
});