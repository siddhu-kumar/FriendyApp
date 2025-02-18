import { Resetpwd } from "../models/models.js"
import nodemailer from "nodemailer"
import { totp } from 'otplib'
import crypto from 'crypto'
let otp 

export const email_validate = async (req, res) => {
    const { email } = req.body;

    otp = await generateOTP(email);
    const status = await sendEmail(email, otp);
    if (!status.rejected) {
        res.status(400).json({ 'message': 'Email rejected.' })
    }
    res.status(200).json({ 'message': 'User exists and mail sent.' })
}

const generateOTP = async (email) => {
    const hash = crypto.createHash('sha256');
    hash.update(email)
    const sskey = hash.digest('hex')
    totp.options = {step:120}
    const otp = totp.generate(sskey)
    
    const userotp = new Resetpwd({ 'sskey': sskey, 'otp': otp })
    await userotp.save()
    return otp;
}

export const validateOTP = async (req,res) => {
    try {

    const {otp} = req.body
    console.log(otp)
    const validate = await Resetpwd.findOne({otp})
    console.log('validate',validate)
    if (!validate) {
        res.status(400).json({ 'message': 'Invalid OTP' })
        return;
    }

    const isValid = totp.check(otp, validate.sskey)
    console.log('isVAlid', isValid)
    if(!isValid){
        console.log(isValid)
        res.status(400).json({message:'OTP expired, retry'})
        return;
    }
    res.status(200).json({ 'message': 'OTP Validated.' })
    } catch (err) {
        res.status(401).json({message:'Regenerate OTP'})
    }
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

const sendEmail = async (email, otp) => {

    const html = `<html lang="en">
                    <body style="background-color: white;">
                        <h2 style="color: violet">FriendyApp<h2>
                        <span style="color: red;">To unlock your account ${email}</span>
                        <h5 style="color: blueviolet;">Your One time OTP</h5>
                        <a href="http://192.168.1.5:3000/otp-verify">FriendyApp</a>
                        <h3 style="color: black;">${otp}</h3>
                    </body>
                </html>`

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
}