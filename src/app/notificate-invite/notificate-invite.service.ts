
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificateInvite } from './notificate-invite.entity';
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
import { createToken } from '../../utils/common'

@Injectable()
export class NotificateInviteService {
  constructor(
    @Inject('NOTIFICATE_INVITE_REPOSITORY')
    private readonly notificateRepository: Repository<NotificateInvite>,
    ) {}

  async sendEmailToRequester(data) {
    // await this.machineRepository.find({ where: { id } });
    const sql = `SELECT * FROM user WHERE email='${data.requester_email}'`
    const res = await this.notificateRepository.query(sql)
    if (res && res.length) {
      if (res[0].company_id) {
        return { message: 'stuff' }
      } else {
        const reData = data
        delete reData.inviter_email
        delete reData.message
        reData.requester = res[0].id
        await this.notificateRepository.save(reData)
        return { message: 'success' }
      }
    }

    const token = createToken();
    const sql2 = `INSERT INTO user (firstname, lastname, email, company_id, role_id, verified, token)
                  VALUES('', '', '${data.requester_email}', '${data.company_id}', '${data.role_id}', true, '${token}')`
    await this.notificateRepository.query(sql2)

    const transporter = nodemailer.createTransport(sendGridTransport({
      auth:{
        api_key: String(process.env.SENDGRID_KEYS)
      }
    }))
    const sql1 = `SELECT * FROM user LEFT JOIN company ON (user.company_id=company.id) WHERE user.email='${data.inviter_email}'`
    const inviterRow = await this.notificateRepository.query(sql1)
    return await new Promise((resolve, reject) => {
      transporter.sendMail({
        to: data.requester_email,
        from: process.env.FROM_EMAIL,
        subject: `${inviterRow[0].firstname} ${inviterRow[0].lastname} has invited you to join ${inviterRow[0].company_name} on DOPTestNetwork!`,
        html: `<p>Dear ${data.requester_email}</p>
        <p>${data.message}</p>
        <p>Click, Join My Team below to create your own account and join them!</p>
        <p style="text-align: center;"><a href=${process.env.SERVER_URL}/register/${token} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; display: block;text-transform: uppercase;text-align: center;margin: auto;">Join My Team</a></p>`
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  async sendEmailToInviter(data) {
    const sql = `SELECT *, t2.id AS ID FROM company AS t1 LEFT JOIN user AS t2 ON (t1.create_user_id = t2.id) WHERE t2.email='${data.inviter_email}'`
    const user = await this.notificateRepository.query(sql)
    if (user[0]) {
      const reData = data
      reData.inviter = user[0].ID
      reData.company_id = user[0].company_id
      reData.toRequester = false
      await this.notificateRepository.save(reData)

      // send request email to admin from requester
      const transporter = nodemailer.createTransport(sendGridTransport({
        auth:{
          api_key: String(process.env.SENDGRID_KEYS)
        }
      }))

      return await new Promise((resolve, reject) => {
        transporter.sendMail({
          to: data.inviter_email,
          from: process.env.FROM_EMAIL,
          subject: 'Request Message',
          html: `<p>Dear ${data.inviter_email}</p>
                <p>${data.message}</p>`
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
      //
    } else {
      return { message: 'not found'}
    }
  }
}
