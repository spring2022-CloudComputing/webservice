import {
    Router
} from "express";
import mysqlConnection from "./connection.js";
import auth from 'basic-auth';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const router = new Router();

router.get('/', (req, res) => {
    res.status(200).send('');
});

router.get("/healthz", (req, res) => {
    res.status(200).send('');
});

router.get("/checkConnection", (req, res) => {
    mysqlConnection.ping((err) => {
        if (err) return res.status(500).send("MySQL Server is Down");

        res.send("MySQL Server is Active");
    })
});

router.get("/getData", (req, res) => {
    mysqlConnection.query("SELECT * FROM User", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

//Get User Information
router.get("/v1/user/self", (req, res) => {

    var user = auth(req);
    console.log(user);

    mysqlConnection.query(`SELECT * FROM User where User.username = '` + user.name + `' `, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

//Update a User
router.put("/v1/user/self", (request, res) => {
    var user = auth(request);
    const values = [request.body.first_name, request.body.last_name, request.body.password, request.body.username];


    var finalRes = res;
    mysqlConnection.query(`SELECT password FROM User where User.username = '` + user.name + `' `, (err, rows, fields) => {


        if (!err) {
            if (!rows.length) {
                console.log('No user');
                res.status(400).send('');
            } else {
                var rowRes = Object.values(JSON.parse(JSON.stringify(rows)));
                console.log('update user ', rows);
                var passowrd = rowRes[0].password;
                bcrypt.compare(user.name + ':' + user.pass, passowrd, function (err, result) {
                    if (err) {
                        console.log('result of hash compare false')
                        finalRes.status(400).send('');
                    }
                    if (result) {
                        console.log('result of hash compare true')
                        bcrypt.genSalt(saltRounds, function (err, salt) {
                            bcrypt.hash(user.name + ':' + user.pass, salt, function (err, hash) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).send('');
                                }
                                mysqlConnection.query(`UPDATE User SET first_name = '` + values[0] + `', last_name = '` + values[1] + `', password = '` +
                                    hash + `' , username = '` + values[3] + `', account_updated = NOW() 
                                        WHERE username = '` + values[3] + `' `, (err, rows, fields) => {
                                        if (!err) {
                                            res.status(204).send('');
                                        } else {
                                            console.log(err);
                                            res.status(400).send('');
                                        }
                                    })

                            });
                        });
                    } else {
                        console.log('result of hash compare false')
                        finalRes.status(400).send('');
                    }
                });
            }

        } else {
            console.log(err);
            res.status(400).send('');
        }
    })

});

//Create a User
router.post("/v1/user/", (request, res) => {
    console.log('create user called')
    const values = [request.body.first_name, request.body.last_name, request.body.password, request.body.username];

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(values[3] + ':' + values[2], salt, function (err, hash) {

            values[2] = hash;
            mysqlConnection.query(`INSERT INTO User( id, first_name, last_name, password, username, account_created, account_updated)
    
                VALUES ( UUID() ,'` + values[0] + `' , '` + values[1] + `' , '` + values[2] + `' , '` + values[3] + `' , NOW(), NOW())`, (err, rows, fields) => {
                if (!err) {
                    console.log(values[3]);
                    mysqlConnection.query(`SELECT id, first_name, last_name, username, account_created, account_updated FROM User where User.username = '` + values[3] + `' `, (err, rows, fields) => {
                        if (!err) {


                            var rowRes = Object.values(JSON.parse(JSON.stringify(rows)));
                            console.log('rows from', rowRes[0])

                            res.status(201).send(rowRes[0]);

                        } else {
                            console.log(err);
                            res.status(400).send(rows);
                        }
                    })



                } else {
                    console.log(err);
                    res.status(400).send(rows);
                }
            });

        });
    });

});



export default router;