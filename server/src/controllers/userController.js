import bcrypt from "bcrypt";
import { dbCreateUser } from "../db/queries.js";

const createUser = async (req, res) => {
    try {
        console.log(req.body);

        const username = req.body.username;
        const password = req.body.password;
        const telephone = req.body.telephone;

        const saltRounds = 10;

        //hashing the password and saving it in the database
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
            } 
            else {
                console.log("Hashed Password:", hash);
                await dbCreateUser(username, hash, telephone);
                res.sendStatus(201);
            };
        });
        
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
    
}

export { createUser };