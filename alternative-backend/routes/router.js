import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs'; // Find out right ES6 import import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';  // Find out right ES6 import
import { connection } from '../lib/db.js';
import { validateRegister } from '../middleware/users.js'; 
const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
//router.use(express.static(path.join(__dirname + '/var/www/html/authentication'));

// Root is the login page
 router.get('/',(req, res) => {
  res.sendFile(join(__dirname,'../login.html'));
});

// On hitting register, go to registration page
router.get('/signup', (req,res, err) => {
  if (err) {
    console.error(err);
  }
  res.sendFile(join(__dirname,'../register.html'));
});

// Register route,
 router.post('/signup', validateRegister, (req, res, next) => {
 if (err) {
  console.error(err);
  }
  connection.query(`SELECT * FROM users WHERE LOWER(username)=LOWER(?);`, 
    [req.body.username],
    (err, result) => {
      if(result && result.length) {
        return res.status(409).send({
          message:"The username is already in use :(",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash)=> {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          } else {
        connection.query(`INSERT INTO users (id, username, password, registered) VALUES (?, ?, ?, now());`, [uuid, req.body.username, hash],
          (err, result) => {
            if (err) {
              return res.status(400).send({
                message:err,
              });
            }
            return res.status(201).send({
              message: "Registered!",
            });
          }
        );
       }
      });
    }
    }
  );
 });
      
 router.post('/login',validateRegister, (req, res , next) => {
  connection.query(
    `SELECT * FROM users WHERE username=?;`,
    [req.body.username],
    (err, result) => {
      if(err) {
        return res.status(400).send({
          message:err,
        });
      }
      if(!result.length) {
        return res.status(400).send({
          message:'Username or password incorrect!',
        });
      }

      bcrypt.compare(
        req.body.password, result[0]['password'],
        (bErr, bResult)=>{
          if(bErr){ //passwords do not match
            return res.status(400).send({
              message:'Username or password incorrect!',
            });
          }
        if(bResult){ // when passwords do match,
          const token=jwt.sign(
          {
            username:result[0].username,
            userId:result[0].id,
          },
          'SECRET KEY',
            { expiresIn: '7d'}          
          );
          db.query(`UPDATE users SET last_login = now() WHERE id=?;`,
          [result[0].id,]);
          return res.status(200).send({
            message:"Logged in!",
            token,
            user:result[0],
          });
        }
          return res.status(400).send({
            message:"Username or password incorrect!",
          });
        }
        );
      }
      );
      });

  
// Only allow authenticated users to access the chat application,
 router.get('/secret-route',isLoggedIn, (req,res,err) => {
 if (err) {
   console.error(err);
 }
 res.sendFile(join(__dirname,'../secret.html'));
 });

export default router;
