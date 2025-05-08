

import {
    Resetpwd,
    User
} from "../../models/models.js"
import nodemailer from "nodemailer"
import {
    totp
} from 'otplib'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import fs from "node:fs/promises"
import path from "path"
import {
    fileURLToPath
} from "node:url"

let otp

export const verifyEmail = async (req, res) => {
    const {
        email
    } = req.body;
    console.log(email)
    const findEmail = await User.findOne({
        email: email
    });
    if (!findEmail) {
        res.status(401).json({
            message: 'User does not exists!'
        })
        return;
    }
    const userEmail = findEmail.email;
    otp = await generateOTP(userEmail);
    // console.log(userEmail,otp)
    const status = await sendEmail(userEmail, otp);
    if (!status.rejected) {
        res.status(401).json({
            message: 'Email rejected.'
        })
    }
    res.status(200).json({
        message: 'User exists and mail sent.'
    })
}

const generateOTP = async (useremail) => {
    const hash = crypto.createHash('sha256');
    hash.update(useremail)
    const sskey = hash.digest('hex')
    totp.options = {
        step: 300
    }
    const otp = totp.generate(sskey)

    const userotp = new Resetpwd({
        'sskey': sskey,
        'otp': otp
    })
    await userotp.save()
    // await Resetpwd.findOneAndDelete({ 'otp': otp })
    return otp;
}

export const userOTPVerify = async (req, res) => {
    try {

        const {
            otp
        } = req.body
        console.log(otp)
        const validate = await Resetpwd.findOne({
            otp
        })
        console.log('validate', validate)
        if (!validate) {
            res.status(401).json({
                message: 'Invalid OTP'
            })
            return;
        }

        const isValid = totp.check(otp, validate.sskey)
        console.log('isVAlid', isValid)
        if (!isValid) {
            console.log(isValid)
            res.status(401).json({
                message: 'OTP expired, Retry'
            })
            return;
        }
        res.status(200).json({
            message: 'OTP Validated.'
        })
    } catch (err) {
        res.status(401).json({
            message: 'Regenerate OTP'
        })
    }
}

export const userPasswordReset = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    console.log(email, password)
    const hashedPassword = await bcrypt.hash(password, 10)
    const updatePassword = await User.findOneAndUpdate({
        email: email
    }, {
        'password': hashedPassword
    }, {
        new: true
    })
    console.log(updatePassword)
    const deleteOTP = await Resetpwd.findOneAndDelete({
        otp: otp
    })
    res.status(201).json({
        message: 'Password reset'
    })
}

const pass_key = process.env.NODEMAIL_PASS_KEY
const nodemail_user_id = process.env.NODEMAIL_USER_ID

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: nodemail_user_id,
        pass: pass_key
    },
});

const FRONTENDRUNNINGPORT = process.env.FRONTEND || "http://localhost:3000"

const sendEmail = async (email, otp) => {
    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const filepath = path.join(__dirname, './Email.html')
        const htmlContent = await fs.readFile(filepath, "utf-8")

        const html = htmlContent
            .replace(/{{email}}/g, email)
            .replace(/{{otp}}/g, otp)
            .replace(/{{frontendUrl}}/g, FRONTENDRUNNINGPORT);

        const message = {
            from: "browsers.192@gmail.com",
            to: email,
            sender: "browsers@gmail.com",
            subject: "Hello",
            replyTo: "abc@gmail.com",
            text: `Hello ${email}`,
            html: html,
        }
        const mailsent = await transporter.sendMail(message);
        console.log(mailsent)
        return mailsent;
    } catch (error) {
        console.error(error)
    }
}