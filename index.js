import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import cors from 'cors';

const app = express();
app.listen (3800, ()=>{
  console.log('Listening on port 3800..');
});

app.use(cors('http://localhost:3800'));

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname,'/')));

// Root is the login page
app.get('/',(req, res) => {
  res.sendFile(join(__dirname, 'login.html'));
});

// On hitting register, go to registration page
app.get('/register', (req,res, err) => {
  if (err) {
    console.error(err);
  }
  res.sendFile(__dirname + '/register.html');
});


