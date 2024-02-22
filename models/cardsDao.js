const db = require("../Database");

exports.addCard = (card, userid) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO Carte(userid, cardNumber, cvv, nome, cognome, scadenza) VALUES (?,?,?,?,?,?)';
        db.run(query, [userid, card.cardNumber, card.cvv, card.nome, card.cognome, card.scadenza], (err, row) => {
            if (err) reject(err);
            resolve(card.id);
        })
    })
}

exports.getAllCards = (userid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Carte WHERE userid=?';
        db.all(query, [userid], (err, rows) => {
            if (err) reject(err);
            else {
                const cards = rows.map(row => ({
                    cardid: row.cardid,
                    cardNumber: row.cardNumber,
                    cvv: row.cvv,
                    nome: row.nome,
                    cognome: row.cognome,
                    scadenza: row.scadenza
                }));
                resolve({hasCards: cards.length > 0, cards});
            }
        });
    });
};

exports.removeCard = (userid, cardid) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Carte WHERE userid=? and cardid=?';
        db.run(query, [userid, cardid], (err, row) => {
            if (err) reject("Errore");
            resolve(cardid);
        })
    });
}

exports.getCard = (userid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Carte WHERE userid=?';
        db.all(query, [userid], (err, rows) => {
            if (err) {
                reject(err);

            } else if (rows.length === 0) {
                reject('Nessuna carta inserita')
            } else {
                resolve(rows);
            }
        });
    });
}