import { Resetpwd, User } from "../models/models.js"
import nodemailer from "nodemailer"
import { totp } from 'otplib'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
let otp 

export const verifyEmail = async (req, res) => {
    const { email } = req.body;
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
        res.status(400).json({ 'message': 'User does not exists' })
    }
    console.log(findEmail)
    const useremail = findEmail.email;
    otp = await generagteOTP(useremail);
    // console.log(useremail,otp)
    const status = await sendEmail(useremail, otp);
    if (!status.rejected) {
        res.status(400).json({ 'message': 'Email rejected.' })
    }
    res.status(200).json({ 'message': 'User exists and mail sent.' })
}

const generagteOTP = async (useremail) => {
    const hash = crypto.createHash('sha256');
    hash.update(useremail)
    const sskey = hash.digest('hex')
    totp.options = {step:120}
    const otp = totp.generate(sskey)
    
    const userotp = new Resetpwd({ 'sskey': sskey, 'otp': otp })
    await userotp.save()
    // await Resetpwd.findOneAndDelete({ 'otp': otp })
    return otp;
}

export const validateOTP = async (req,res) => {
    const {otp} = req.body
    console.log(otp)
    const validate = await Resetpwd.findOne({otp})
    if (!validate) {
        res.status(400).json({ 'message': 'Invalid OTP' })
    }

    const isValid = totp.check(otp, validate.sskey)
    if(!isValid){
        console.log(isValid)
        res.status(400).json({message:'invalid otp'})
    }
    res.status(200).json({ 'message': 'OTP Validated.' })
}

export const resetPassword = async (req, res) => {
    const {email,password} = req.body;
    console.log(email,password)
    const hashedPassword = await bcrypt.hash(password, 10)
    const updatePassword = await User.findOneAndUpdate({ email: email }, {'password':hashedPassword}, { new: true })
    console.log(updatePassword)
    const deleteOTP = await Resetpwd.findOneAndDelete({otp:otp})
    res.status(201).json({ 'message': 'Passowrd reset' })
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "browsers.192@gmail.com",
        pass: "koyk ovbq lnkv qksi"
    },
});

const sendEmail = async (email, otp) => {

    const html = `<html lang="en">
                    <body style="background-color: white;">
                        <h2 style="color: violet">FriendyApp<h2>
                        <span style="color: red;">To unlock your account ${email}</span>
                        <h5 style="color: blueviolet;">Your One time OTP</h5>
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