// IMPORTANT:
// this is a integrated file in one whole 'server.js',
// if there is sufficient time,
// this file will and should decompose to smaller middlewares

//-----library used-----
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const convert = require('xml2json');
const session = require('express-session');
const e = require('express');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose.set('strictQuery', true);  // to supress warning for once 


app.use(session({
    secret: 'csci2720-Gp12',        // A value for signing cookie ID
    cookie: { maxAge: 3600000 },    // Expires in 60 min
    resave: true,
    saveUninitialized: true
}));


//-----START of Schema Define-----
const UserSchema = mongoose.Schema(
    {
        userID: {type: Number, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        passwordHashed: {type: String, required: true},
        favLocations: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Location'}
        ],
        myComments: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
        ],
        adminRight: {type: Boolean, required: true}
    }
);
const LocationSchema = mongoose.Schema(
    {
        locID: {type: Number, required: true, unique: true},
        name: {type: String, required: true},
        latitude: {type: Number, required: true, default: 22.3},
        longtitude: {type: Number, required: true, default: 114.1},

        // if the speeds are not found, give default value of 0 and try to handle in frontend
        maxTrafficSpeed: {type: Number, required: true, default: 0}, 
        minTrafficSpeed: {type: Number, required: true, default: 0},

        segments: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Segment'}
        ],
        lastUpdated: {type: Date, default: Date.now()},
        comments: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
        ],
        keywords: [
            {type: String}
        ]
    }
);
const SegmentSchema = mongoose.Schema(
    {
    // the irn_id should have the same ID as segment_Id in the XML data provided
        route: {type: String, required: true},
        irn_id: {type: Number, required: true, unique: true},
        speed: {type: Number, required: true, default: 0}
    }
);
const CommentSchema = mongoose.Schema(
    {
        commentID: {type: Number, required: true, unique: true},
        content: {type: String},
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        location: {type: mongoose.Schema.Types.ObjectId, ref:'Location'}
    }
);
//-----END of schema define-----



//-----START of models-----
const User = mongoose.model('User', UserSchema);
const Location = mongoose.model('Location', LocationSchema);
const Segment = mongoose.model('Segment', SegmentSchema);
const Comment = mongoose.model('Comment', CommentSchema);
//-----END of models-----



//------- START of function declaration -------
const adminCheck = (req, res, next) => {
    if (req.session.admin)
        return next();
    else
        res.status(401);
        res.set('Content-Type', 'text/plain')
        res.send('401 Unauthorized');
};
const loginCheck = (req, res, next) => {
    if (req.session.isLoggedin)
        return next();
    else
        res.status(401);
        res.set('Content-Type', 'text/plain')
        res.send('401 Unauthorized');
};
//------- END of function declaration -------



//------- DB connection START-------
mongoose.connect('mongodb+srv://stu087:p877630W@cluster0.qsanyuv.mongodb.net/stu087'); // change it to other desired connect string if needed
const db = mongoose.connection;
// connect to MongoDB
db.on('error', console.error.bind(console,'Connection error:'));
db.once('open', () => {
    console.log('DB connected');



//------- LOGIN and LOGOUT START -------
    
  // when login 
  // (asssumed the userID is valid and the password is already hashed in frontend)
  // also the password and username are come from input form
    app.post('/login', (req, res) => {

      // update database (didn't handle when fetch XML fails)
        axios.get('https://resource.data.one.gov.hk/td/traffic-detectors/irnAvgSpeed-all.xml')
        .then(res => JSON.parse(convert.toJson(res.data)).segment_speed_list.segments.segment)
        // result is an array of segment object [{segment_id: ..., speed: ..., valid: ...}, ...]
        .then(
            (newSegments) => {
                for (let newSegment of newSegments) {
                    // update each segment with new segment's speed
                    Segment.updateOne(
                        {irn_id: newSegment.segment_id},
                        {$set: {speed: newSegment.speed}},
                        (err, e) => {
                            if (err) console.log(err);
                        }
                    )
                }
            }
        );

     // update the max & min speed
      // max
        Location.find().sort({locID: 1})
        .exec(
            (err, locations) => {
                // iterate through all locations
                for (let location of locations) {
                    Segment.find({route: location.name}).sort({speed: -1}).limit(1)
                    // note the segment output is still an array with 1 object
                    .exec(
                        (err, segments) => {
                            Location.updateOne(
                                {name: location.name},
                                {$set: {maxTrafficSpeed: segments[0].speed}},
                                (err, e) => {
                                    if (err) console.log(err);
                                }
                            )
                        }
                    )
                }
            }
        );

      // min
        Location.find().sort({locID: 1})
        .exec(
            (err, locations) => {
            // iterate through all locations
                for (let location of locations) {
                    Segment.find({route: location.name}).sort({speed: 1}).limit(1)
                // note the segment output is still an array with 1 object
                    .exec(
                        (err, segments) => {
                            Location.updateOne(
                                {name: location.name},
                                {$set: {minTrafficSpeed: segments[0].speed,
        // also update the lastUpdated time 
                                        lastUpdated: Date.now()}
                                },
                                (err, e) => {
                                    if (err) console.log(err);
                                }
                            )
                        }
                    )
                }
            }
        );

    // check if the userID and password is valid

    // suppose there's a form with input field username & password (expected hashed)
        User.findOne({username: req.body['username'], passwordHashed: req.body['passwordHashed']})
        .exec(
            (err, user) => {
                if (err) 
                    res.status(400).json({
                        isLoggedin: false,
                        reason: err
                    });
                else if (user === null)
                    res.send(401).json({
                    isLoggedin: false,
                    reason: "Wrong username or password"
                });
                else {
                    // use ANY location to obtain one last updated time
                    Location.findOne({locID: 1})
                    .exec(
                        (err, location) => {
                        // set session
                        req.session.admin = user.adminRight; // set user's admin right
                        req.session.loggedIn = true;
                        req.session.userID = user.userID;
                        // send response
                            res.status(200).json({
                                isLoggedin: true,
                                reason: null,
                                userID: user.userID,
                                adminRight: user.adminRight,
                                lastUpdated: location.lastUpdated
                            })
                        }
                    )
                };
            }
        )
    });

  // when logout
    app.get('/logout', (req,res) => {
        req.session.destroy(
            (err, e) => {
                if (err) {
                    res.send(err);
                }
                else res.redirect('/');  // redirect to home page if no error during logout
            }
        );
    });

//------- LOGIN and LOGOUT END -------



//------- GET request START -------

    // load all locations
    app.get('/locations', (req, res) => {
        Location.find().sort({locID: 1})
        .exec(
            (err, locations) => {
                let locationsArray = [];
                for (let location of locations) {
                    locationsArray.push(
                        {
                            name: location.name,
                            latitude: location.latitude,
                            longtitude: location.latitude,
                            maxTrafficSpeed: location.maxTrafficSpeed,
                            minTrafficSpeed: location.minTrafficSpeed,
                            lastUpdated: location.lastUpdated
                        }
                    )
                }
                res.status(200).json(locationsArray);
                // result is an array contain all locations with chosen data sent
            }
        );
    });

    // load one location (for non-admin)
    app.get('/location/:locID', (req, res) => {
        Location.findOne({locID: req.params['locID']})
        .populate('comments')
        .exec(
            (err, location) => {
                if (err || location === null) {
                    res.status(404).json({
                    // send a null object (maybe can send something else here...)
                    });
                }
                else res.status(200).json({
                    name: location.name,
                    latitude: location.latitude,
                    longtitude: location.longtitude,
                    maxTrafficSpeed: location.maxTrafficSpeed,
                    minTrafficSpeed: location.minTrafficSpeed,
                    comments: location.comments,
                    lastUpdated: location.lastUpdated
                })
            }
        );
    });

    // load userinfo (for non-admin)
    app.get('/user/:userID', (req, res) => {
        User.findOne({userID: req.params['userID']})
        .populate('myComments')
        .populate('favLocations')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(404).json({
                        // send a null object (maybe can send something else here...)
                    });
                }
                else res.status(200).json({
                    userID: user.userID,
                    username: user.username,
                    favLocations: user.favLocations,
                    myComments: user.myComments
                });
            }
        );
    });

    // load comments in one location
    app.get('/location/:locID/comments', (req, res) => {
        Location.findOne({locID: req.params['locID']})
        .populate('comments')
        .exec(
            (err, location) => {
                if (err || location === null) {
                    res.status(404).json({
                        // send a null object (maybe can send something else here...)
                    });
                }
                else {
                    res.status(200).json(location.comments);
                }
            }
        );
    });

    // load list of fav locations
    app.get('/user/:userID/favlocations', (req, res) => {
        User.findOne({userID: req.params['userID']})
        .populate('favLocations')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(404).json({
                        // send a null object (maybe can send something else here...)
                    });
                }
                else {
                    res.status(200).json(user.favLocations);
                }
            }
        );
    });

    // load comments in user page
    app.get('/user/:userID/comments', (req, res) => {
        User.findOne({userID: req.params['userID']})
        .populate('myComments')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(404).json({
                        // send a null object (maybe can send something else here...)
                    });
                }
                else {
                    res.status(200).json(user.myComments);
                }
            }
        );
    });

    // search locations 
    // (query string expected) [i.e., http://<server address>/search?keyword=hello+world]
    app.get('/search', (req, res) => {
        const keywordQuery = req.query['keyword'];
        let matchedArray = [];
        if (keywordQuery !== null && keywordQuery !== undefined) {
            Location.find().sort({locID: 1})
            .exec(
                (err, locations) => {
                    if (err || locations === null) {
                        res.status(404).json({
                            // send a null object (maybe can send something else here...)
                        });
                    }
                    else // iterate each location,
                            // then search through keyword array,
                            // and add the matched locations to result array if included
                    {
                        for (let location of locations) {
                            for (let keyword of location.keywords) {
                                if (keyword.toLowerCase().includes(keywordQuery.toLowerCase())) {
                                    matchedArray.push(
                                        {
                                            locID: location.locID,
                                            name: location.name
                                        }
                                    );
                                    break;  // search for next location when matched
                                }
                            }
                        }
                        res.status(200).json({
                            searchSuccess: true,
                            result: matchedArray
                        });
                    }
                }
            );
        } else 
            res.status(404).json({
                searchSuccess: false,
                result: null
            });
    });


// ADMIN required

    // load one location (for admin)
    app.get('/admin/location/:locID', adminCheck, (req, res) => {
        Location.findOne({locID: req.params['locID']})
        .populate('comments')
        .populate('segments')
        .exec(
            (err, location) => {
                if (err || location === null) {
                    res.status(404).json({
                    // send a null object (maybe can send something else here...)
                    });
                }
                else res.status(200).json(location);
            }
        );
    });
    
    // load userinfo (for admin)
    app.get('/admin/user/:userID', adminCheck, (req, res) => {
        User.findOne({userID: req.params['userID']})
        .populate('myComments')
        .populate('favLocations')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(404).json({
                        // send a null object (maybe can send something else here...)
                    });
                }
                else res.status(200).json(user);
            }
        );
    });


//------- GET request END -------



//------- POST request START -------
    
// LOGIN required

    // add comment 
    // [both params (for locID) and input field (for comment body) expected]
    app.post('/location/:locID/comments', loginCheck, (req, res) => {
        Location.findOne({locID: req.params['locID']})
        .exec(
            (err, location) => {
                if (err || location === null) {  // if LOCATION is invalid or error occurred
                    res.status(400).json({
                        // send a error object
                        commentAdded: false,
                        reason: 'invalid location'
                    });
                }
                else 
                    User.findOne({userID: req.session.userID})
                    .exec(
                        (err, user) => {
                            if (err || location === null) { // if USER is invalid or error occured
                                res.status(400).json({
                                    // send a error object
                                    commentAdded: false,
                                    reason: 'invalid user'
                                });
                            }
                            else {
                            // find the last comment and get the ID
                            Comment.find().sort({commentID: -1}).limit(1)
                            .exec(
                                (err, comments) => {
                                    let newCommentID = comments[0].commentID + 1;
                                    Comment.create(
                                        {
                                            commentID: newCommentID,
                                            content: req.body['comment'],       // the req body is 'comment'
                                            author: user,
                                            location: location
                                        },
                                        (newComment) => {
                                            // then push new comment to location and user array
                                            
    console.log('new comment added:', newComment);  // test if the whole thing work lol

                                            Location.updateOne({name: location.name},
                                                {$push: {comments: newComment}},
                                                (err, e) => {
                                                   if (err)
                                                    console.log('Cannot add to location array', err);
                                                   else
                                                    User.updateOne({userID: user.userID},
                                                        {$push: {myComments: newComment}},
                                                        (err, e) => {
                                                            if (err)
                                                             console.log('Cannot add to location array', err);
                                                            else
                                                            res.status(201).json({
                                                                // send a success object
                                                                commentAdded: true,
                                                                reason: null,
                                                                ref: newComment
                                                            });
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                    )
                                }
                            );
                        }
                    }
                );
            }
        );
    });

// ADMIN authorization required

    // add location
    // (input form expected) 
    // required field: ['name', 'latitude', 'longtitude', 'maxTrafficSpeed', 'minTrafficSpeed']
    // **suppose admin always input valid data
    app.post('/admin/add/location', adminCheck, (req, res) => {
        // find the last location
        Location.find().sort({locID: -1}).limit(1)
        .exec(
            (err, location) => {
                if (err || location === null) {
                    res.status(406).json({
                        locationCreated: false,
                        reason: '406 Location Not Created (no locations in database)'
                    });
                }
                else {
                    let newLocationID = location[0].locID + 1;
                    // create new location
                    Location.create(
                        {
                            locID: newLocationID,
                            name: req.body['name'],
                            latitude: req.body['latitude'],
                            longtitude: req.body['longtitude'],
                            maxTrafficSpeed: req.body['maxTrafficSpeed'],
                            minTrafficSpeed: req.body['minTrafficSpeed'],
                            segments: [],
                            comments: [],
                            keyword: req.body['name']
                        },
                        (err, event) => {
                            if (event === null) {
                                res.status(406).json({
                                    locationCreated: false,
                                    reason: '406 Location Not Created (unknown error)'
                                });
                            }
                            else {
                                res.status(201).json({
                                    locationCreated: true,
                                    reason: null
                                });
                            }
                        }
                    );
                }
            }
        );
    });

    // add user 
    // (input form expected) 
    // required field: ['username', 'passwordHashed', 'adminRight']
    app.post('/admin/add/user', adminCheck, (req, res) => {
        User.find().sort({userID: -1}).limit(1)
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(406).json({
                        userCreated: false,
                        reason: '406 User Not Created (no users in database)'
                    });
                }
                else {
                    let newUserID = user[0].userID + 1;
                    User.create(
                        {
                            userID: newUserID,
                            username: req.body['username'],
                            passwordHashed: req.body['passwordHashed'],
                            favLocations: [],
                            comment: [],
                            adminRight: req.body['adminRight']
                        },
                        (err, event) => {
                            if (event === null) {
                                res.status(406).json({
                                    userCreated: false,
                                    reason: '406 User Not Created (unknown error)'
                                });
                            }
                            else {
                                res.status(201).json({
                                    userCreated: true,
                                    reason: null
                                });
                            }
                        }
                    )
                }
            }
        );
    });

//------- POST request END -------



//------- PUT request START -------

// LOGIN required

    // add favourite location 
    // (although it is called add, technically there's no document added so PUT method is used instead)
    app.put('/location/:locID/addfav', loginCheck, (req, res) => {
        User.findOne({userID: req.session.userID})
        .populate('favLocations')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(400).json({
                        favLocAdded: false,
                        reason: '400 Bad Request (no such user)'
                    });
                }
                else {
                    // find if location is already in their favourite
                    let alreadyOnList = false;
                    for (let location of user.favLocations) {
                        if (location.locID == req.params['locID'])
                            alreadyOnList = true;
                    }
                    if (alreadyOnList) {
                        res.status(400).json({
                            favLocAdded: false,
                            reason: '400 Bad Request (location already on list)'
                        });
                    }
                    else {
                        // find the requested location and add it to favourite list
                        Location.findOne({locID: req.params['locID']})
                        .exec(
                            (err, location) => {
                                if (err || location === null) {
                                    res.status(400).json({
                                        favLocAdded: false,
                                        reason: '400 Bad Request (no such location)'
                                    });
                                }
                                else {
                                    User.updateOne(
                                        {userID: req.session.userID},
                                        {$push: {favLocations: location}},
                                        (err, event) => {
                                            res.status(200).json({
                                                favLocAdded: true,
                                                reason: null
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    });

    // remove fav location
    app.put('/location/:locID/removefav', loginCheck, (req, res) => {
        User.findOne({userID: req.session.userID})
        .populate('favLocations')
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(400).json({
                        favLocRemoved: false,
                        reason: '400 Bad Request (no such user)'
                    });
                }
                else {
                    // find if location is in their favourite
                    let alreadyOnList = false;
                    for (let location of user.favLocations) {
                        if (location.locID == req.params['locID'])
                            alreadyOnList = true;
                    }
                    if (!alreadyOnList) {
                        res.status(400).json({
                            favLocRemoved: false,
                            reason: '400 Bad Request (location not on list)'
                        });
                    }
                    else {
                        // find the requested location and remove it from favourite list
                        Location.findOne({locID: req.params['locID']})
                        .exec(
                            (err, location) => {
                                if (err || location === null) {
                                    res.status(400).json({
                                        favLocRemoved: false,
                                        reason: '400 Bad Request (no such location)'
                                    });
                                }
                                else {
                                    User.updateOne(
                                        {userID: req.session.userID},
                                        {$pull: {favLocations: location}},
                                        (err, event) => {
                                            res.status(200).json({
                                                favLocRemoved: true,
                                                reason: null
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    });

// ADMIN required

    // update location info (road name only as from the spec)
    // (expected input text field)
    // required fields: ['name']
    app.put('/admin/update/location/:locID', adminCheck, (req, res) => {
        Location.findOne({locID: req.params['locID']})
        .exec(
            (err, location) => {
                if (err || location === null) {
                    res.status(400).json({
                        roadNameUpdated: false,
                        reason: '400 Bad Request (location not found)'
                    });
                }
                else {
                    Location.updateOne(
                        {locID: req.params['locID']},
                        {$set: 
                            {
                                name: req.body['name'],
                                lastUpdated: Date.now()
                            }
                        },
                        (err, event) => {
                            if (err) res.status(400).json({
                                roadNameUpdated: false,
                                reason: '400 Bad Request (unknown error)'
                            });
                            else res.status(200).json({
                                roadNameUpdated: true,
                                reason: null
                            });
                        }
                    );
                }
            }
        );
    });

    // update user info (username & password only as from the spec)
    // (expected input text field)
    // required fields: ['username', 'passwordHashed']
    // also assumed the password already hashed in frontend
    app.put('/admin/update/user/:userID', adminCheck, (req, res) => {
        User.findOne({userID: req.params['userID']})
        .exec(
            (err, user) => {
                if (err || user === null) {
                    res.status(400).json({
                        userInfoUpdated: false,
                        reason: '400 Bad Request (user not found)'
                    });
                }
                else {
                    User.updateOne(
                        {userID: req.params['userID']},
                        {$set: 
                            {
                                username: req.body['username'],
                                passwordHashed: req.body['passwordHashed']
                            }
                        },
                        (err, event) => {
                            if (err) res.status(400).json({
                                userInfoUpdated: false,
                                reason: '400 Bad Request (unknown error)'
                            });
                            else res.status(200).json({
                                userInfoUpdated: true,
                                reason: null
                            });
                        }
                    );
                }
            }
        );
    });

//------- PUT request END -------



//------- DELETE request START (admin required) -------
// note: I guess delete the whole document will be easier lol

    // delete location 
    app.delete('/admin/delete/location/:locID', adminCheck, (req, res) => {
        Location.deleteOne({locID: req.params['locID']},
            (err, deletedEvent) => {
                if (deletedEvent.deletedCount == 0) {
                    res.status(404).json({
                        locationDeleted: false,
                        reason: '404 Location Not Found (requested location not found)'
                    });
                }
                else {
                    res.status(206).json({
                        locationDeleted: true,
                        reason: null
                    });
                }
            }
        );
    });

    // delete user
    app.delete('/admin/delete/user/:userID', adminCheck, (req, res) => {
        User.deleteOne({userID: req.params['userID']},
            (err, deletedEvent) => {
                if (deletedEvent.deletedCount == 0) {
                    res.status(404).json({
                        userDeleted: false,
                        reason: '404 User Not Found (requested user not found)'
                    });
                }
                else {
                    res.status(206).json({
                        userDeleted: true,
                        reason: null
                    });
                }
            }
        );
    });

//------- DELETE request END -------



//------- other requests -------
//     redirect to homepage
    app.all('/*', (req, res) => {
        res.redirect('/');  
    });
//------- other requests -------



}
);

//------- DB connection END --------




const server = app.listen(80); // change to other port if needed




//----- codes for initialisation BELOW -----

/* 
*initialising locations schema

Segment.distinct('route', (err, segments) => {
    let count = 1;
    let arr = [];
    for(let segment of segments) {
        arr.push(
            {
                locID: count,
                name: segment,
                latitude: 0,
                longtitude: 0,
                maxTrafficSpeed: 0,
                minTrafficSpeed: 0,
                segments: [],
                comments: [],
                keywords: [segment]
            }
        );
        count++;
    }
    Location.insertMany(arr, (err, e) => {
        if (err)
        console.log(err);
    })
}
); */



/* 
* inserting all segments into corresponding location's segments array

Location.find().sort({locID: 1})
.exec(
    (err, locations) => {
        for (let location of locations) {
            Segment.find({route: location.name}).sort({irn_id: 1})
            .exec(
                //* find all segments with same route
                (err, segments) => {
                    let ObjIdArr = [];
                    for (let segment of segments) {
                        console.log(segment._id);
                        ObjIdArr.push(segment._id);
                    }
                    Location.updateOne(
                        {name: location.name},
                        {$push: {segments: {$each: ObjIdArr}}},
                        (err,e) => {
                            if(err) {
                                console.log(err);
                            }
                        }
                    );
                }
            )
        }
    }
); */