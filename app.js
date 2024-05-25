const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();


app.use(
    cors({
        origin: 'http://localhost:' + port,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    })
)

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'style')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'scripts')));
app.use(express.static(path.join(__dirname, 'public', 'static', 'images')));

app.use('/admin', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication
function authenticate(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.redirect('/admin-login');
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'))
});

app.get('/admin/blog-editor', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'blog-editor.html'))
})

app.get('/admin/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'blogs.html'));
})

app.get('/admin/blogs.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'blogs.js'));
})

app.get('/admin', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin.html'))
})

// Handle admin stuff
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin-login.html'))
})

app.post('/admin-login', (req, res) => {
    let body = req.body;
    console.log(body);
    if (body.username == process.env.ADMIN_USERNAME && body.password == process.env.ADMIN_PASSWORD) {
        req.session.authenticated = true;
        res.send({success: true});
        return;
    }
    res.send({success: false});
})

app.post('/admin/create-post', (req, res) => {
    let update = false;
    if (req.body.hasOwnProperty('update')) {
        update = req.body['update'];
        delete req.body['update'];
    }
    
    addBlog(req.body, update=update).then(r => {
        updatePublicDB();
        res.send({'success': true})
    }).catch(r => {
        res.send({'success': false, 'error': r})
    })
})

app.post('/admin/delete-post', (req, res) => {
    console.log(req.body);
    deleteBlog(req.body).then(r => {
        updatePublicDB();
        res.send({'success': true})
    }).catch(r => {
        res.send({'success': false, 'error': r})
    })
})

app.get('/our-story', (req, res) => {
    // let bl = {
    //     "title": "Sailing to Maryland",
    //     "date": '01/10/2024',
    //     "public": true,
    //     'content': "As the sun rose over the horizon, casting a warm glow over the waters of Rhode Island, I couldn't help but feel a sense of excitement mixed with a hint of nervousness. Our family of five was about to embark on a sailing adventure from Rhode Island to Maryland, a journey that promised to be both thrilling and challenging.\nThe boat gently rocked as we boarded, the boys eagerly exploring every nook and cranny while our little girl, with her eyes wide with wonder, clung to her mother's hand. As we set sail, the wind filled the sails, propelling us forward into the vast expanse of the ocean.\nThe first few hours were pure bliss, the sun shining down on us as we sailed along, the salty sea air filling our lungs. The boys were full of energy, their laughter ringing out as they climbed the rigging and pretended to be pirates.\nBut as the day wore on and the sea grew rougher, things took a turn for the worse. The boys, who had been so full of life earlier, suddenly turned pale and clammy, their faces twisted in discomfort. Seasickness had struck, and it wasn't long before they were leaning over the side of the boat, emptying their stomachs into the churning waters below.\nMy wife and I did our best to comfort them, but there was little we could do to ease their suffering. Meanwhile, our little girl, unaffected by the motion of the ocean, chugged along happily by our side, her eyes wide with wonder at the sights and sounds of the sea.\nDespite the challenges, we pressed on, determined to make the most of our adventure. We sailed through the night, taking turns at the helm, the stars shining down on us like diamonds in the sky. And finally, after what seemed like an eternity, we arrived in Maryland, tired but exhilarated by our journey.\nAs we disembarked, the boys weak but smiling, our little girl skipping ahead, I couldn't help but feel a sense of pride. We had faced adversity head-on and emerged stronger for it. And as we made our way home, the boys already planning our next adventure, I knew that this would be a vacation we would never forget.",
    // }

    // addBlog(bl);

    updatePublicDB();

});

app.get('/api/get-blog', (req, res) => {
    sortDB().then(r_ => {
        updatePublicDB().then(r => {
            if (req.query.hasOwnProperty('year')) {
                fs.readJSON('public/static/scripts/blogs.json').then(pb => {
                    if (req.query.hasOwnProperty('month')) {
                        if (req.query.hasOwnProperty('day')) {
                            if (req.query.hasOwnProperty('id')) {
                                if (pb.hasOwnProperty(req.query['year']) && pb[req.query['year']].hasOwnProperty(req.query['month']) && pb[req.query['year']][req.query['month']].hasOwnProperty(req.query['day']) && pb[req.query['year']][req.query['month']][req.query['day']].length > parseInt(req.query['id']) && parseInt(req.query['id']) >= 0) {
                                    res.send([pb[req.query['year']][req.query['month']][req.query['day']][parseInt(req.query['id'])]]);
                                } else {
                                    res.send([]);
                                }
                            } else {
                                if (pb.hasOwnProperty(req.query['year']) && pb[req.query['year']].hasOwnProperty(req.query['month']) && pb[req.query['year']][req.query['month']].hasOwnProperty(req.query['day'])) {
                                    res.send(pb[req.query['year']][req.query['month']][req.query['day']]);
                                } else {
                                    res.send([]);
                                    return;
                                }
                            }
                        } else {
                            if (pb.hasOwnProperty(req.query['year']) && pb[req.query['year']].hasOwnProperty(req.query['month'])) {
                                res.send(pb[req.query['year']][req.query['month']]);
                            } else {
                                res.send([]);
                                return;
                            }
                        }
                    } else {
                        if (pb.hasOwnProperty(req.query['year'])) {
                            res.send(pb[req.query['year']]);
                        } else {
                            res.send([]);
                            return;
                        }
                    }
                });
            } else {
                res.send([]);
                return;
            }
        }).catch(e => {
            console.log(e);
        });
    });
});


app.listen(port, '0.0.0.0', () => {
    console.log("Server is running at http://localhost:" + port);
});

function addBlog(bl, update=false, db_fp='db.json') {
    return new Promise((resolve, reject) => {
        let date_info = bl["date"].split('/');
        if (date_info.length != 3) {
            reject("Invalid Date");
            return;
        }

        if (!bl.hasOwnProperty('featured_image')) {
            reject("Missing featured image");
            return;
        }

        let month = date_info[0];
        let day = date_info[1];
        let year = date_info[2];

        fs.readJSON(db_fp).then(res => {
            if (update) {
                try {
                    let id = bl['id'];
                    delete bl['id'];
                    res[year][month][day][id] = bl;
                } catch (e) {
                    console.log(e)
                    reject('Something went wrong');
                }
            } else {
                if (res.hasOwnProperty(year)) {
                    if (res[year].hasOwnProperty(month)) {
                        if (res[year][month].hasOwnProperty(day)) {
                            for (let i in res[year][month][day]) {
                                if (res[year][month][day][i]["title"] == bl["title"]) {
                                    console.log('Title Exists');
                                    reject("Title Exists");
                                    return;
                                }
                            }
                            if (!update) {
                                res[year][month][day].push(bl);
                            }
                        } else {
                            res[year][month][day] = [];
                            res[year][month][day].push(bl);
                        }
                    } else {
                        res[year][month] = {};
                        res[year][month][day] = [];
                        res[year][month][day].push(bl);
                    }
                } else {
                    res[year] = {};
                    res[year][month] = {};
                    res[year][month][day] = [];
                    res[year][month][day].push(bl);
                }
            }
            
            fs.writeJSON(db_fp, res)
                .then(() => {
                    updatePublicDB().then(r => {
                        resolve();
                    }).catch(() => {
                        reject('Something went wrong');
                    })
                })
                .catch((err) => {
                    reject(err);
                });
        }).catch((err) => {
            reject(err);
        });
    });
}

function deleteBlog(bl, db_fp='db.json') {
    return new Promise((resolve, reject) => {
        if (!bl.hasOwnProperty('title') || !bl.hasOwnProperty('month') || !bl.hasOwnProperty('day') || !bl.hasOwnProperty('year')) {
            reject('Missing Information');
        } else {
            fs.readJSON(db_fp).then(res => {
                if (res.hasOwnProperty(bl['year'])) {
                    if (res[bl['year']].hasOwnProperty(bl['month'])) {
                        if (res[bl['year']][bl['month']].hasOwnProperty(bl['day'])) {
                            let day = res[bl['year']][bl['month']][bl['day']];
                            for (let i = 0; i < day.length; i++) {
                                if (day[i]['title'] === bl['title']) {
                                    // res[bl['year']][bl['month']][bl['day']].splice(i, 1);
                                    res[bl['year']][bl['month']][bl['day']].splice(0, 1);
                                    if (res[bl['year']][bl['month']][bl['day']].length == 0) {
                                        delete res[bl['year']][bl['month']][bl['day']];
                                        if (Object.keys(res[bl['year']][bl['month']]).length == 0) {
                                            delete res[bl['year']][bl['month']];
                                            if (Object.keys(res[bl['year']]).length == 0) {
                                                delete res[bl['year']];
                                            }
                                        }
                                    }
                                    fs.writeJSON(db_fp, res).then(res => {
                                        resolve();
                                        return;
                                    }).catch(e => {
                                        reject('Something went wrong writing');
                                    })
                                }
                            }
                        } else {
                            reject("Blog doesn't exist")
                        }
                    } else {
                        reject("Blog doesn't exist")
                    }
                } else {
                    reject("Blog doesn't exist")
                }
            }).catch(e => {
                reject('Something went wrong');
            })
        }
    });
}

function updatePublicDB(db_fp='db.json') {
    return new Promise((resolve, reject) => {
        fs.readJSON(db_fp).then(db => {
            pb = {}
            for (let year in db) {
                pb[year] = {};
                for (let month in db[year]) {
                    pb[year][month] = {};
                    for (let day in db[year][month]) {
                        pb[year][month][day] = [];
                        for (let i in db[year][month][day]) {
                            if (db[year][month][day][i]["public"]) {
                                pb[year][month][day].push(db[year][month][day][i]);
                            }
                        }
                    }
                }
            }
            fs.writeJSON(path.join(__dirname, 'public', 'static', 'scripts', 'blogs.json'), pb).then(r => {
                resolve();
            })
            .catch(e => {
                console.log('Something went wrong when updating public database:', e)
            });
        })
    });
}

function sortDB(db_fp='db.json') {
    return new Promise((resolve, reject) => {
        fs.readJSON(db_fp).then(dict => {
            let sortedDict = {};

            // Get the keys for the years and sort them numerically
            let years = Object.keys(dict).sort((a, b) => parseInt(b) - parseInt(a));

            years.forEach(year => {
                // Get the months for the current year and sort them numerically
                let months = Object.keys(dict[year]).sort((a, b) => parseInt(b) - parseInt(a));
                
                // Initialize the year in the sorted dictionary
                sortedDict[year] = {};

                months.forEach(month => {
                    // Get the days for the current month and sort them numerically
                    let days = Object.keys(dict[year][month]).sort((a, b) => parseInt(b) - parseInt(a));
                    
                    // Initialize the month in the sorted dictionary
                    sortedDict[year][month] = {};

                    days.forEach(day => {
                        // Copy the sorted days into the sorted dictionary
                        sortedDict[year][month][day] = dict[year][month][day];
                    });
                });
            });

            return sortedDict;
        }).then(dict => {
            fs.writeJSON(db_fp, dict).then(res => {
                resolve();
            }).catch(e => {
                reject(e);
            })
        }).catch(e => {
            reject(e);
        })
    });
}

sortDB().then(updatePublicDB());






