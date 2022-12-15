const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // mongoose needs to be installed with npm
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
const cors = require('cors');
const Papa = require('papaparse');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Replace the following with your MongoDB deployment's connection string.
const dbUri = "mongodb+srv://<user>:<password>@<cluster-url>/<database>";
mongoose.connect(dbUri);
// mongoose.connection is an instance of the connected DB
const db = mongoose.connection;

const LocationSchema = Schema({
    locId: {
        type: Number, required: true,
        unique: true
    },
    name: {type: String, required: true},
    quota: {type: Number}
});

const SegmentSchema = mongoose.Schema({
    // the irn_id should have the same ID as segment_Id in the XML data provided
    route: {type: String, required: true},
    irn_id: {type: Number, required: true, unique: true},
    speed: {type: Number, required: true, default: 0}
});

const Location = mongoose.model('Location', LocationSchema);
const Segment = mongoose.model('Segment', SegmentSchema);

let testLocation = ["AUSTIN ROAD WEST", "CANTON ROAD", "CHATHAM ROAD NORTH",
    "CLEAR WATER BAY ROAD", "CONNAUGHT ROAD CENTRAL", "FERRY STREET",
    "HING FAT STREET", "HOI ON ROAD", "JOCKEY CLUB ROAD",
    "LUNG CHEUNG ROAD", "QUEEN'S ROAD EAST", "SALISBURY ROAD",
    "SHA TIN RURAL COMMITTEE ROAD", "TAI PO TAI WO ROAD", "WATERLOO ROAD"];

// Upon connection failure
db.on('error', console.error.bind(console, 'connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...");

    app.get('/ev', (req, res) => {
        fetch("https://static.data.gov.hk/td/traffic-data-strategic-major-roads/info/speed_segments_info.csv")
            .then(res => res.text())
            .then(data => {
                Papa.parse(data, {
                    header: true,
                    step: function (row) {
                        let road = row.data.route;
                        if (!Number.isInteger(Number.parseInt(road)) && road.length > 0) {
                            // console.log("Row:", row.data);
                            Location.create({
                                locId: row.data.irn_id,
                                name: road,
                                quota: 4 * 30
                            }, (err, e) => {
                                if (err)
                                    console.log(err);
                            });
                        }
                    },
                    complete: function (results) {
                        // http://ballfish.logdown.com/posts/308238-nodejs-imported-css-use-express
                        res.write('<html>\
									<head>\
									<link rel="stylesheet" href="/stylesheets/bootstrap.scheme.css">\
									</head>\
									<body>' +
                            "Location last update time: " + new Date() +
                            '</body></html>'
                        );
                        res.end();
                    }
                });
            });
    });

    app.get('/event', (req, res) => {
        Segment.find({route: {$in: testLocation}}, (err, results) => {
            // res.send(results);
        });
    });

    app.get('/lo', (req, res) => {
        Location.find({name: {$in: testLocation}}, (err, results) => {
            // res.send(results);
        });
    });
});

module.exports = app;
