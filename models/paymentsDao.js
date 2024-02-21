const db = require("../Database");

exports.addCard = (card, userid) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO Carte(userid, cardNumber, cvv, nome, cognome) VALUES (?,?,?,?,?)';
        db.run(query, [userid, card.cardNumber, card.cvv, card.nome, card.cognome], (err, row) => {
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
            else if (rows.length === 0) reject({ error: "Nessuna carta trovata" });
            else {
                const cards = rows.map(row => ({
                    cardid: row.cardid,
                    cardNumber: row.cardNumber,
                    cvv: row.cvv,
                    nome: row.nome,
                    cognome: row.cognome,
                }));
                resolve(cards);
            }
        });
    });
};