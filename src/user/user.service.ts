import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { signupEmailVerify, sendForgotPassword } from '../services/EmailService';
import { createToken } from '../utils/common'
import { sendEmail } from '../services/EmailService'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async find(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: {id} });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    company_id?: string,
  ): Promise<User> {
    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.company_id = company_id
    user.password = await this.hashPassword(password);
    return await this.userRepository.save(user);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hashed: string = await bcrypt.hash(plain, saltRounds);
    return hashed;
  }

  async verifyUser(userData: any, token: string, company_id: string) {
    userData.token = token;
    if (company_id) {
      userData.company_id = company_id
    }
    const user = await this.userRepository.findOne({where: {id: userData.id}});

    if (!user.id) {
      console.error('this user does not exist');
    }
    await this.userRepository.update(user.id, userData);
    const response = await signupEmailVerify(userData);
    return response;
  }

  async checkToken(token: string) {
    const user: any = await this.userRepository.findOne({where: { token }})
    if (user) {
      user.verified = true;
      await this.userRepository.update(user.id, user);
      const userData = await this.userRepository.findOne({where: {id: user.id}});
      return {success: true, message: 'Email was successfully verified!', data: userData }
    } else {
      return {success: false, message: 'Email verification was failed!'}
    }
  }

  async sendEmail(email: string) {
    const token = createToken();
    const userData = await this.userRepository.findOne({
      where: {email}
    });
    if (userData) {
      await this.userRepository.update(userData.id, { token });
      const params = {
        sendEmail: userData.email ,
        subject: 'doptestnetwork.com',
        html: `<p>Dear ${userData.firstname} ${userData.lastname}</p>
              <p>We heard that you lost your doptestnetwork.com password. Sorry about that! But don’t worry! You can use the following button to reset your password:</p><br />
              <p style="text-align: center;"><a href=${process.env.SERVER_URL}/change-pass/${token} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; display: block;text-transform: uppercase;text-align: center;margin: auto;">Reset your password</a></p>`,
      }
      const response = await sendEmail(params)
      if (response) {
        return {success: true, message: 'We’ve sent you an email, check your inbox!' }
      } else {
        return {success: false, message: 'Failed!'}
      }
    } else {
      return {success: false, message: 'Email not found!'}
    }
  }

  async changePass(token: string) {
    const user = await this.userRepository.findOne({
      where: { token },
    });
    const tokenSeconds = user?.updatedAt.getTime();
    const nowDate = new Date()
    const nowSeconds = nowDate.getTime()
    if (user) {
      if (tokenSeconds + 1800000 > nowSeconds) {
        return true
      } else {
        await this.userRepository.update(user.id, {  token: '' });
        return false
      }
    } else {
      return false
    }
  }

  async sendPass(data) {
    const user = await this.userRepository.findOne({
      where: { token: data.token },
    });
    if (user) {
      const hashPassword = await this.hashPassword(data.password);
      if (data?.firstname) {
        await this.userRepository.update(user.id, { password: hashPassword, token: '', firstname: data.firstname, lastname: data.lastname });
      } else {
        await this.userRepository.update(user.id, { password: hashPassword, token: '' });
      }
      return true
    } else {
      return false
    }
  }

  async getUserByToken(data) {
    if(data.token) {
      return await this.userRepository.findOne({
        where: { token: data.token },
      });
    } else {
      return null;
    }

  }

  async outUser(id: number) {
    return await this.userRepository.update(id, { company_id: null, role_id: 10 })
  }

  async getAllStuffsNotImported() {
    return await this.userRepository.find({where: {company_id: null}})
  }

  async addUserToCompany(data) {
    return await this.userRepository.update(data.id, {company_id: data.company_id})
  }

  async changeUserRole(data) {
    return await this.userRepository.update(data.id, {role_id: data.role_id})
  }

  async changeUserProfile(data) {
    const id = data.id
    const updateUserData = {
      firstname: data.firstname,
      lastname: data.lastname,
      logo: data.logo,
      signature: data.signature,
      signature_level: data.signature_level,
      signature_logo: data.signature_logo
    }
    // if (data?.password) {
    //   data.password = await this.hashPassword(data.password);
    // }
    await this.userRepository.update(id, updateUserData);
    const user = await this.userRepository.findOne({where: {id: id}});
    const payload = { firstname: user.firstname, lastname: user.lastname, email: user.email, sub: user.id, verified: user.verified, company_id: user.company_id, role_id: user.role_id, logo: user.logo };
    return {
      success: true,
      user: payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserCompanyInfo(id) {
    const sql = `SELECT *, t1.logo AS logo FROM user AS t1
                LEFT JOIN company AS t2 ON (t1.company_id = t2.id)
                LEFT JOIN role AS t3 ON (t1.role_id = t3.id) WHERE t1.id = ${id}`
    return await this.userRepository.query(sql);
  }

  async notificationSiteAdminData() {
    const sql = `SELECT *, t1.created_at AS created_at FROM company AS t1
                LEFT JOIN user AS t2 ON (t1.create_user_id = t2.id) WHERE t1.status = false`
    return await this.userRepository.query(sql);
  }

  async notificationCompanyAdminData(company_id, id) {
    const sql = `SELECT * FROM user WHERE company_id='${company_id}' AND role_id=10 AND id<>${id}`
    const arr1 = await this.userRepository.query(sql)
    const sql2 = `SELECT *, t1.created_at AS created_at, t1.id AS ID FROM notificate_invite AS t1
        LEFT JOIN user AS t2 ON (t1.requester = t2.id)
        WHERE t1.inviter='${id}' AND t1.toRequester=false AND t1.status=false`
    const arr2 = await this.userRepository.query(sql2)
    return arr1.concat(arr2)
  }

  async notificationCompanyUserData(id) {
    const sql = `SELECT *, t1.created_at AS created_at, t1.id AS ID, t2.logo AS logo FROM notificate_invite AS t1
                LEFT JOIN user AS t2 ON (t1.inviter = t2.id)
                LEFT JOIN company as t3 ON (t2.company_id = t3.id)
                WHERE t1.requester='${id}' AND t1.toRequester=true AND t1.status=false`
    return await this.userRepository.query(sql)
  }

  async joinToCompany(id, company_id, notificate_id) {
    // const sql = `UPDATE notificate_invite SET status=true WHERE id=${notificate_id}`
    const sql = `DELETE FROM notificate_invite WHERE requester=${id}`
    await this.userRepository.query(sql)
    return await this.userRepository.update(id, { company_id })
  }

  async joinToCompanyApprove(id, company_id, notificate_id, requester) {
    // const sql = `UPDATE notificate_invite SET status=true WHERE id=${notificate_id}`
    const sql = `DELETE FROM notificate_invite WHERE id=${notificate_id}`
    await this.userRepository.query(sql)
    return await this.userRepository.update(requester, { company_id })
  }

  async getUsersByCompanyId(company_id) {
    return await this.userRepository.find({where: {company_id}})
  }

  async getAdmins(company_id) {
    return await this.userRepository.find({where: {company_id, role_id: 2}})
  }

  async delete(id) {
    return await this.userRepository.delete({ id })
  }

  async getUser(id) {
    return await this.userRepository.findOne({where: {id}})
  }
}
