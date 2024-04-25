import {EmailBuilder} from '../utils/emailClient'
import {SendEmailForgotPassword} from '../utils/sendEmailForgotPassword'
import { NEW_USER_SIGNUP } from '../constants/emailTemplate'
import { User } from '../user/user.entity';
import { userData } from '../app/interface'


const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const fs = require('fs')

const file = '/public/mails/signUp.html'
const stringTemplate = fs.readFileSync('./' + file, 'utf8');

// export const signupEmailVerify = (userData: User) => {
//   const toEmail = []
//   toEmail.push(userData.email)
//   const username = userData.firstname
//   const verifyToken = userData.token
//   const eb = new EmailBuilder(NEW_USER_SIGNUP, toEmail, username, verifyToken);
//   return eb.send();
// };

export const sendForgotPassword = (userData: User) => {
  const toEmail = []
  toEmail.push(userData.email)
  const username = userData.firstname
  const verifyToken = userData.token
  const eb = new SendEmailForgotPassword(NEW_USER_SIGNUP, toEmail, username, verifyToken);
  return eb.send();
};

export const signupEmailVerify = async (userData: userData) => {
  const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
      api_key: String(process.env.SENDGRID_KEYS)
    }
  }))
  const username = `${userData.firstname} ${userData.lastname}`
  return await new Promise((resolve, reject) => {
    transporter.sendMail({
      to: userData.email,
      from: process.env.FROM_EMAIL,
      subject: 'Please verify your email address!',
      html: `<p>Dear ${username},</p><p>We have received a request to authorize this email address for use with DopTestNetwrok. If you requested this verification, please go to the following URL to confirm that you are authorized to use this email address:</p><br /><p style="text-align: center;"><a href=${process.env.SERVER_URL}/verify-email/${userData.token} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; display: block;text-transform: uppercase;text-align: center;margin: auto;">Verify</a></p>`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
};

export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
      api_key: String(process.env.SENDGRID_KEYS)
    }
  }))
  return await new Promise((resolve, reject) => {
    transporter.sendMail({
      to: data.sendEmail,
      from: process.env.FROM_EMAIL,
      subject: data.subject,
      html: data.html
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
};