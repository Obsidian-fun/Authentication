import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

export function validateRegister(req, res, next) {
  // Username should be greater than 3 characters
  if(!req.body.username || req.body.username < 3) {
    return res.status(400).send({
      message:'Please enter a username with min. 3 characters',
    });
  }
  // Password should be greater than 6 characters
  if(!req.body.password || req.body.password < 6) {
    return res.status(400).send({
      message: 'Please enter a password greater than 6 characters',
    });
  }
  // Passwords must match,
  if(!req.body.password_repeat || req.body.password_repeat != req.body.password) {
    return res.status(400).send({
      message: 'Passwords must match..',
    });
  }
  next();
}

export function isLoggedIn(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(400).send({
      message:'Your session is not valid',
    });
  }
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split('')[1]; 
    const decoded = jwt.verify(token, 'SECRETKEY');
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(400).send({
      message:'Your session is not valid',
    });
  }
}







