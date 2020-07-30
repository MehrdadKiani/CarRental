"use strict";

const express = require('express');
const DAO = require('./database/dao');
const userDao = require('./user_dao');
const morgan = require('morgan'); // logging middleware
const { get } = require('./database/connection');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const PORT = 3001;
const dao = new DAO();
const app = new express();
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300; //seconds
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };


app.use(morgan('tiny'));// Set-up logging
app.use(express.json());// Process body content


// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
        .then((user) => {

            if (user === undefined) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }]
                });
            } else {
                if (!userDao.checkPassword(user, password)) {
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                    res.json({ id: user.id, name: user.name });
                }
            }
        }).catch(

            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            (err) => {
                new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
            }
        );
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});


//GET /cars/public
app.get('/api/cars', (req, res) => {
    dao.getAllCars()
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.get('/api/cars/category/:category', (req, res) => {
    const category = req.params.category;
    dao.getCarsByCategory(category)
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.get('/api/brands', (req, res) => {
    dao.getAllBrands()
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.post('/api/filter', (req, res) => {
    const filters = req.body;
    dao.getFilterdCars(filters)
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});



//GET /user
app.get('/api/user', (req, res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({ id: user.id, name: user.name });
        }).catch(
            (err) => {
                res.status(401).json(authErrorObj);
            }
        );
});


app.post('/api/payment', (req, res) => {
    const data = req.body;
    dao.checkPayment(data)
        .then((result) => {
            res.json({ "result": result });
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});


app.put('/api/cars/:carId', (req, res) => {
    const data = req.body;
    dao.updateCar(req.params.carId, data.status)
        .then((result) => res.status(200).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

app.put('/api/rent/:rentId', (req, res) => {
    const data = req.body;
    dao.updateRent(req.params.rentId, data.status)
        .then((result) => res.status(200).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});


app.get('/api/cars/:id', (req, res) => {
    const carId = req.params.id;
    dao.getCarById(carId)
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});


app.get('/api/histories', (req, res) => {
    dao.getAllHistory()
        .then((history) => {
            res.json(history);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.post('/api/histories', function (req, res) {
    const history = req.body;
    if (!history) {
        res.status(400).end();
    } else {
        dao.createHistory(history)
            .then((id) => res.status(201).json({ "id": id }))
            .catch((err) => {
                res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
            });
    }
});

app.put('/api/sync', (req, res) => {
    dao.syncTables()
        .then((result) => res.status(200).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));