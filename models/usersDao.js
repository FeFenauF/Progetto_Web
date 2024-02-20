const db = require('../Database.js');
const bcrypt = require('bcrypt');

exports.newUser = (user) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(user.password, salt);

    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO Users(email, password, nome, cognome, ruolo) VALUES (?,?,?,?,?)';
        console.log(user.nome);
        user.ruolo = "Utente";
        db.run(query, [user.email, user.password, user.nome, user.cognome, user.ruolo], (err, row) => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.getUser= (email,password)=>{
    return new Promise((resolve,reject)=>{
        const query= 'SELECT * FROM Users WHERE email=?';
        db.get(query,[email],(err,row)=>{
            if(err) throw err;
            else if(row===undefined) resolve({error: 'Utente non trovato'});
            else{
                const user=row;
                let check=false;

                if(bcrypt.compareSync(password,user.password))
                    check=true;

                console.log(check);
                resolve({user,check});
            }
        })
    })
}

exports.getUserById=(id)=> {

    return new Promise((resolve, reject)=>{
        const query='SELECT * FROM Users WHERE id=?';
        db.get(query,[id],(err,row)=>{
            if(err)throw err;
            else if(row===undefined) resolve({error:"Utente inesistente"});
            else{
                resolve(row);
            }
        })
    })
}