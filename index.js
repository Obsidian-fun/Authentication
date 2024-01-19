import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/router.js';

const app = express();
app.listen (3800, ()=>{
  console.log('Listening on port 3800..');
});

app.use(cors('http://localhost:3800'));
app.use('/', router);

