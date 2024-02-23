const db = require('../Database');

exports.newCar = (car) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO Cars(marca, modello, prezzo, descrizione, image, status) VALUES (?,?,?,?,?,?)';
        db.run(query, [car.marca, car.modello, car.prezzo, car.descrizione, car.image, "Stock"], (err, row) => {
            if (err) reject(err);
            resolve(car.id);
        })
    })
}

exports.getAllCars = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Cars WHERE status=?';
        db.all(query, ["Stock"], (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve({ error: "Nessuna auto trovata" });
            else {
                const cars = rows.map(row => ({
                    id: row.id,
                    marca: row.marca,
                    modello: row.modello,
                    prezzo: row.prezzo,
                    descrizione: row.descrizione,
                    image: "../../images/" + row.image,
                    status: row.status,
                    link: '/cars/details/' + row.id,
            }));
                resolve(cars);
            }
        });
    });
};

exports.getFavouriteById = (userid, carid) => {
    console.log("sono entrato in get favourite");
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Preferiti WHERE userid=? and carid=?';
        db.get(query, [userid, carid], (err, row) => {
            if (err) throw err;
            else if (row === undefined) resolve(row);
            else {
                reject("Auto già inserita tra i preferiti!");
            }
        })
    })
}

exports.addFavourite = (userid, carid) => {
    console.log(userid);
    console.log(carid);
    return new Promise(async (resolve, reject) => {
        this.getFavouriteById(userid, carid)
            .then(() => {
                const query = 'INSERT INTO Preferiti(userid,carid) VALUES (?,?)';
                db.run(query, [userid, carid], (err, row) => {
                    if (err) reject(err);
                    resolve(carid);
                })
            })
            .catch((msg) => {
                reject(msg);
            })

    })

}

exports.getAllFavourites=(userid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Cars.* FROM Cars INNER JOIN Preferiti ON Cars.id = Preferiti.carid WHERE Preferiti.userid = ? AND Cars.status="Stock"';
        db.all(query, [userid], (err, rows) => {
            if (err) throw err;
            else if (rows === undefined) reject({error: "Auto inesistente"});
            else {

                const cars = rows.map(row => ({
                        id: row.id,
                        marca: row.marca,
                        modello: row.modello,
                        prezzo: row.prezzo,
                        descrizione: row.descrizione,
                        image: "../../images/" + row.image,
                        status: row.status,
                        link: '/cars/details/' + row.id,
                    }
                ));
                resolve(cars);
            }
        })
    })

}

exports.removeFavourite = (userid, carid) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Preferiti WHERE userid=? and carid=?';
        db.run(query, [userid, carid], (err, row) => {
            if (err) reject("Errore");
            resolve(carid);
        })
    });
}

exports.getCarById = (carid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Cars WHERE id=?';
        db.get(query, [carid], (err, row) => {
            if (err) throw err;
            else if (row === undefined) reject({error: "Auto inesistente"});
            else {
                const car = {
                    id: row.id,
                    marca: row.marca,
                    modello: row.modello,
                    prezzo: row.prezzo,
                    descrizione: row.descrizione,
                    image: "../../images/" + row.image,
                    status: row.status,
                    link: '/cars/details/' + row.id,
                }
                resolve(car);
            }
        })
    })
}

exports.getCarInCartById = (userid, carid) => {
    console.log("sono entrato in get favourite");
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Carrello WHERE userid=? and carid=?';
        db.get(query, [userid, carid], (err, row) => {
            if (err) throw err;
            else if (row === undefined) resolve(row);
            else {
                reject("Auto già presente nel carrello!");
            }
        })
    })
}

exports.addToCart = (userid, carid) => {
    console.log(userid);
    console.log(carid);
    return new Promise(async (resolve, reject) => {
        this.getCarInCartById(userid, carid)
            .then(() => {
                const query = 'INSERT INTO Carrello(userid,carid) VALUES (?,?)';
                db.run(query, [userid, carid], (err, row) => {
                    if (err) reject(err);
                    resolve(carid);
                })
            })
            .catch((msg) => {
                reject(msg);
            })

    })

}

exports.getCart=(userid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Cars.* FROM Cars INNER JOIN Carrello ON Cars.id = Carrello.carid WHERE Carrello.userid = ?';
        db.all(query, [userid], (err, rows) => {
            if (err) throw err;
            else if (rows === undefined) reject({error: "Auto inesistente"});
            else {

                const cars = rows.map(row => ({
                        id: row.id,
                        marca: row.marca,
                        modello: row.modello,
                        prezzo: row.prezzo,
                        descrizione: row.descrizione,
                        image: "../../images/" + row.image,
                        status: row.status,
                        link: '/cars/details/' + row.id,
                    }
                ));
                resolve(cars);
            }
        })
    })

}

exports.removeCarFromCart = (userid, carid) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Carrello WHERE userid=? and carid=?';
        db.run(query, [userid, carid], (err, row) => {
            if (err) reject("Errore");
            resolve(carid);
        })
    });
}

exports.performCheckout = (cars) => {
    return new Promise((resolve, reject) => {
        var error = false;
        cars.forEach(function (car) {
            const query = 'UPDATE Cars SET status="Ordered" WHERE id=?';
            db.run(query, [car.id], (err, row) => {
                if (err) error = true;
            })
        })
        if(!error) {
            resolve(cars);
        } else {
            reject("Errore");
        }
    })
}

exports.addOrder = (userid, cars, cardNumber) => {
    console.log(userid);
    return new Promise(async (resolve, reject) => {
        var error = false;
        cars.forEach(function (car) {
            console.log(car.id);
            console.log(cardNumber);
            const query = 'INSERT INTO Ordini(userid,carid,cardNumber) VALUES (?,?,?)';
            db.run(query, [userid, car.id, cardNumber], (err, row) => {
                if (err) error = true;
            })
        })
        if(!error) {
            resolve(cars);
        } else {
            reject("Errore");
        }
    })

}

exports.removeAllFromCart = (userid) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Carrello WHERE userid=?';
        db.run(query, [userid], (err, row) => {
            if (err) reject("Errore");
            resolve(userid);
        })
    });
}

exports.getOrders=(userid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Cars.*, Ordini.cardNumber FROM Cars INNER JOIN Ordini ON Cars.id = Ordini.carid WHERE Ordini.userid = ? AND Cars.status="Ordered"';
        db.all(query, [userid], (err, rows) => {
            if (err) throw err;
            else if (rows === undefined) reject({error: "Auto inesistente"});
            else {
                const cars = rows.map(row => ({
                        id: row.id,
                        marca: row.marca,
                        modello: row.modello,
                        prezzo: row.prezzo,
                        descrizione: row.descrizione,
                        image: "../../images/" + row.image,
                        status: row.status,
                        cardNumber: row.cardNumber,
                        link: '/cars/details/' + row.id,
                    }
                ));
                resolve(cars);
            }
        })
    })
}

exports.searchCars=(cerca) =>{
    console.log(cerca);
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Cars WHERE marca LIKE ? AND status="Stock" OR modello LIKE ? AND status="Stock"';
        db.all(query, [`%${cerca}%`, `%${cerca}%`], (err, rows) => {
            if (err) throw err;
            else if (rows.length === 0) resolve({error: "Nessuna auto trovata"});
            else {
                const cars = rows.map(row => ({
                        id: row.id,
                        marca: row.marca,
                        modello: row.modello,
                        prezzo: row.prezzo,
                        descrizione: row.descrizione,
                        image: "../../images/" + row.image,
                        status: row.status,
                        link: '/cars/details/' + row.id,
                    }
                ));
                resolve(cars);
            }
        })
    })
}

