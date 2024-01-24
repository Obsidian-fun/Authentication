import express from 'express';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs'; // Find out right ES6 import import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';  // Find out right ES6 import
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';

let port = process.env.PORT || 3000;

app.use(cors()) // Enable ALL cross origin sharing ( DANGEROUS )
app.use(bodyParser.json())


const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

app.get('/', (req,res)=> {
  res.sendFile(join(__dirname,'login.html'));
});

app.get('/signup', (req,res)=> {
  res.sendFile(join(__dirname,'register.html'));
});

/*app.post('/login', async (req, res)=> {
  const {username, password} = req.body;
  const user =  await user.FindOne({username}); // Change this to db query
  // check for validity,
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).send({
      message:"Username or Password is incorrect!",
    })
  } 
  // generate token,
  const token = jwt.sign({username: user.username},'secret_key');
  // store the token in a database or in an HTTP-only cookie,
  user.token = token;
  await user.save();
  // return the token to client,
  res.json({token});
});
*/


app.post('/register', (req, res)=>{
  let { username, email, password } = req.body;
  console.log({ username, email, password }); 
  
  const user = { name:username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.status(200).send({
    message:"Registered",
    accessToken:accessToken,
  }); 

});

app.get('/secret-route', (req, res)=> {
  res.sendFile(join(__dirname,'/secret.html'));
});


app.listen(port, ()=> {
  console.log(`Server listening on ${port}`);
});


