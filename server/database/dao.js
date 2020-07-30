const connection = require('../database/connection');


const DAO = function () {

    this.getAllCars = function () {
        return new Promise(function (resolve, reject) {
            connection.all("SELECT * FROM car", [], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    };

    this.getCarsByCategory = function (category) {
        return new Promise(function (resolve, reject) {
            connection.all("SELECT * FROM car WHERE categoryName = ?", [category.toUpperCase()], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    };

    this.getCarById = function (carId) {
        return new Promise(function (resolve, reject) {
            connection.all("SELECT * FROM car WHERE id = ?", [carId], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    };

    this.getAllBrands = function () {
        return new Promise(function (resolve, reject) {
            connection.all("SELECT DISTINCT brand FROM car", [], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    };

    this.getFilterdCars = async function (filters) {
        let categoryList = [];
        let brandList = [];
        filters.forEach((item, index, arr) => {
            if (item.startsWith('category_'))
                categoryList.push((item.toUpperCase().substr(9, 1)));
            else
                brandList.push(item);
        })

        if (categoryList.length && brandList.length) {
            const queryString = `SELECT * FROM car WHERE categoryName IN (${categoryList.map(i => '?')}) OR brand IN (${brandList.map(i => '?')})`;
            return new Promise(function (resolve, reject) {
                connection.all(queryString, [...categoryList, ...brandList], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
        }
        else if (!categoryList.length && brandList.length) {
            const queryString = `SELECT * FROM car WHERE brand IN (${brandList.map(i => '?')})`;
            return new Promise(function (resolve, reject) {
                connection.all(queryString, [...brandList], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
        }
        else if (categoryList.length && !brandList.length) {
            const queryString = `SELECT * FROM car WHERE categoryName IN (${categoryList.map(i => '?')})`;
            return new Promise(function (resolve, reject) {
                connection.all(queryString, [...categoryList], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
        }
        else {
            const queryString = `SELECT * FROM car`;
            return new Promise(function (resolve, reject) {
                connection.all(queryString, [], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
        };
    };

    this.getAllHistory = function () {
        return new Promise(function (resolve, reject) {
            connection.all("SELECT * FROM rent", [], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        })
    };

    this.createHistory = function (history) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO rent(startDateTime, endDateTime, total, status, userId, carId,carCategory) VALUES(?,?,?,?,?,?,?)';
            connection.run(sql, [
                history.startDateTime,
                history.endDateTime,
                history.total,
                history.status,
                history.userId,
                history.carId,
                history.carCategory
            ], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log(this.lastID);
                    resolve(this.lastID);
                }
            });
        });
    }

    this.checkPayment = function (data) {
        return new Promise(function (resolve, reject) {
            if (data.cvv != 100)
                resolve(true);
            else
                reject('Card validation failed (CVV should be greater than 100)');
        });
    }

    this.updateCar = function (id, status) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE car SET status = ? WHERE id = ?';
            connection.run(sql, [status, id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else
                    resolve(null);
            })
        });
    }

    this.updateRent = function (id, status) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE rent SET status = ? WHERE id = ?';
            connection.run(sql, [status, id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else
                    resolve(null);
            })
        });
    }

    this.syncTables = function () {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE car SET status = 0 WHERE id IN(SELECT carId FROM rent WHERE endDateTime < DATE('now') AND rent.status <> 2)`;
            const sql2 = `UPDATE rent SET status = 2 WHERE endDateTime < DATE('now') AND rent.status <> 2`
            connection.run(sql, [], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    connection.run(sql2, [], (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            console.log('Synced2')
                            resolve(null);
                        }
                    })

                    console.log('Synced1')
                    resolve(null);
                }
            })
        });
    }
};

module.exports = DAO;