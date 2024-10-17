import bcrypt from "bcrypt";
import { dbCreateUser } from "../db/user.queries.js";
import saltRounds from "../config/bcrypt.config.js";

const createUser = async (req, res) => {
    try {        
        const username = req.body.username;
        const password = req.body.password;
        const telephone = req.body.telephone;
                
        //hashing the password and saving it in the database
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
            } 
            else {                
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