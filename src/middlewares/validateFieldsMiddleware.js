import { body, validationResult } from 'express-validator';
import fs from "fs"

const validationOptions = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one digit')
    .matches(/[@$!%*?&#]/)
    .withMessage('Password must contain at least one special character'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
];

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if(req.file){
     fs.unlinkSync(req.file?.path)
    }
    // console.log(errors)
    process.exit(1)
  }
  next();
};

export { validationOptions, checkValidationResult };