import Car from './Car';
import History from './History'
const baseURL = "/api";



async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}


async function getCars() {
    let url = "/cars";

    const response = await fetch(baseURL + url);
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((t) => new Car(t.id, t.model, t.brand, t.categoryName, t.price, t.status));
    } else {
        let err = { status: response.status, errObj: tasksJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getHistories() {
    let url = "/histories";

    const response = await fetch(baseURL + url);
    const HistoryJson = await response.json();
    if (response.ok) {
        return HistoryJson.map((t) => new History(t.id, t.startDateTime, t.endDateTime, t.total, t.status, t.userId, t.carId, t.carCategory));
    } else {
        let err = { status: response.status, errObj: HistoryJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getCarsByCategory(category) {
    let url = "/cars/category";

    const response = await fetch(baseURL + url + `/${category}`);
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((t) => new Car(t.id, t.model, t.brand, t.categoryName, t.price, t.status));
    } else {
        let err = { status: response.status, errObj: tasksJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getBrands() {
    let url = "/brands";

    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if (response.ok) {
        return brandsJson;
    } else {
        let err = { status: response.status, errObj: brandsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getFilteredCars(filters) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/filter", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: filters,
        }).then((response) => {
            if (response.ok) {
                resolve(response.json());
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function addHistory(history) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/histories", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(history),
        }).then((response) => {
            if (response.ok) {
                resolve(true);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function checkPayment(data) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                resolve(true);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateCar(carId, data) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cars/" + carId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {

            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateRent(rentId, data) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rent/" + rentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {

            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function syncTables() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/sync", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {

            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = { getCars, getBrands, getFilteredCars, isAuthenticated, getCarsByCategory, addHistory, getHistories, checkPayment, updateCar, updateRent, userLogin, userLogout, syncTables };
export default API;
