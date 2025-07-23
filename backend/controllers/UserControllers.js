// const UserModel = require('../models/UserModel')
// const bcrypt = require("bcryptjs")
// const jwt = require('jsonwebtoken')
// const nodemailer = require('nodemailer')

// require('dotenv').config()


// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     }
// })

// const authCheck = async (req, res) => {
//     const token = req.cookies.token
//     if(!token) return res.status(401).json({message: "Unauthorized: No token provided"})

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
//         const user = await UserModel.findById(decoded.id)
//         if(!user) return res.status(404).json({ message: "User not found"})
//         res.status(200).json({user: {id: user._id, username: user.username, email: user.email}})
//     } catch (err) {
//         res.status(401).json({message: "Unauthorized: Invalid token"})
//     }
// }



// // create new user
// const signUp = async (req, res) => {
    
//     try {
//         const {username, email, password, phone} = req.body; // user info from frontend

//         if(!username || !email || !password || !phone ) {
//             return res.status(400).json({message: "All fields are required"}) // required input fields
//         }
//         const existingUser = await UserModel.findOne({ email }) // chedk if email is already in the database
//         if(existingUser) return res.status(400).json({message: "User already exists"})
        
//         const hashedPassword = await bcrypt.hash(password, 10)  // hash password b4 saving in database
        
//         const user = new UserModel({ username, email, password: hashedPassword, phone }) // passing the user to the backend
//         const savedUser = await user.save() // saving the new user in the backend
        
//         // create token after saving user
//         const token = jwt.sign({id:savedUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})

//         // add cookies to res
//         res.cookie("token", token, {httpOnly:true, secure: false, maxAge: 24*60*60*1000, sameSite: "strict"})
//         .status(200).json({message: "User created successfully", token, data: savedUser })
//     } catch (err) {
//         console.error({message: err.message})
//         res.status(500).json({message: "Internal server error"})
//     }
// }


// // Sign in user 

// const signIn = async (req, res) => {
//     try {
//         const { email, password } = req.body // get credentials from frontend 
//         if( !email || !password ) return res.status(400).json({message:'All fields required'}) // required input fields

//         const user = await UserModel.findOne({ email }) // get user from database
//         if(!user) return res.status(404).json({ message: "User not found" })

//         const isPasswordSame = await bcrypt.compare(password, user.password)  // compare passwords
//         if (!isPasswordSame) return res.status(400).json({message: "Invalid credentials"})
        
//         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"} ) // create a token when user has been able to log in and stay loged in for a day

//         // apply cookie to our res
//         res.cookie("token", token, {httpOnly:true, secure: false, maxAge: 24*60*60*1000, sameSite: "strict" })  // will have to change this for production
//         .status(200).json({message: "User signed in successfully", user: {id:user._id, username: user.username, email: user.email}})

//     } catch (err) {
//         console.error({message: err.message}) 
//         res.status(500).json({message: "Internal server error"})      
//     }
// }


// // Sign Out user 
// const signOut = async (req, res) => {
//     try {
//         res.clearCookie("token").status(200).json({message: "User successfully signed out"})  // clear cookie upon sign out
//     } catch (err) {
//         res.status(500).json({message: "Internal server error"})
//     }
// }

// // Request password reset
// const requestPasswordReset = async (req, res) => {
//     try {
//         const {email} = req.body;
//         if(!email) return res.status(400).json({message: "Email is required"})

//         const user = await UserModel.findOne({email})
//         if(!user) return res.status(400).json({message: "User not found"})

//         //generate reset token
//         const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"})
//         const resetLink = `http://localhost:5173/reset-password/${resetToken}`

//         // store token and expiration in the database
//         user.resetPasswordToken = resetToken
//         user.resetPasswordExpires = Date.now() + 15*60*1000 // 15mins
//         await user.save()

//         // // In production, send email with resetLink. For now, log it
//         // console.log("Password reset link: ", resetLink)

//         // send email with reset link
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Password Reset Request",
//             text: `Click the following link to reset your password: ${resetLink}\nThis link expires in 15 minutes.`,
//             html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`,
//         }

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({message: "Password reset link sent to your email"})
//     } catch (err) {
//         console.error({message: err.message});
//         res.status(500).json({message: "Internal server error"})        
//     }
// }

// //confirm password reset
// const confirmPasswordReset = async (req, res) => {
//     try {
//         const { token, newPassword } = req.body;
//         if(!token || !newPassword) return res.status(400).json({message: "Token and password are required"})

//         //Find user with valid token and non-expired
//         const user = await UserModel.findOne({
//             resetPasswordToken: token,
//             resetPasswordExpires: {$gt: Date.now()},
//         })
//         if(!user) return res.status(400).json({message: "Invalid or expired token"})
        
//         //verify token
//         try {
//             jwt.verify(token, process.env.JWT_SECRET_KEY)
//         } catch (err) {
//             return res.status(400).json({message: "Invalid token"})
//         }

//         // update password
//         user.password = await bcrypt.hash(newPassword, 10)
//         user.resetPasswordToken = null
//         user.resetPasswordExpires = null
//         await user.save()

//         res.status(200).json({message: "Password reset successfully"})
//     } catch (err) {
//         console.error({message: err.message})
//         res.status(500).json({message: "Internal server error"})        
//     }
// }


// module.exports = {signUp, signIn, signOut, authCheck, requestPasswordReset, confirmPasswordReset}




const UserModel = require('../models/UserModel')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const admin = require('../utils/firebaseConfig')

require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const authCheck = async (req, res) => {
    console.log('COokies in authCheck: ', req.cookies);  // remove later    
    const token = req.cookies.token
    if(!token) return res.status(401).json({message: "Unauthorized: No token provided"})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decoded.id)
        if(!user) return res.status(404).json({ message: "User not found"})

        const firebaseToken = await admin.auth().createCustomToken(user._id.toString())  // Generate Firebase custom token upon login based on userID
        res.status(200).json({
            user: {id: user._id, username: user.username, email: user.email, phone: user.phone, firstName: user.firstName, lastName: user.lastName, profileImage: user.profileImage}, 
            firebaseToken, // include firebase token in response to send to the frontend
            token,
        })
    } catch (err) {
        res.status(401).json({message: "Unauthorized: Invalid token"})
    }
}

// create new user
const signUp = async (req, res) => {
    try {
        const {username, email, password, phone, firstName, lastName} = req.body;
        if(!username || !email || !password || !phone ) {
            return res.status(400).json({message: "All fields are required"})
        }
        const existingUser = await UserModel.findOne({ email })
        if(existingUser) return res.status(400).json({message: "User already exists"})
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = new UserModel({ username, email, password: hashedPassword, phone, firstName, lastName })
        const savedUser = await user.save()
        
        const token = jwt.sign({id:savedUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
        const firebaseToken = await admin.auth().createCustomToken(savedUser._id.toString());

        res.cookie("token", token, {httpOnly:true, secure: process.env.NODE_ENV === 'production', maxAge: 24*60*60*1000, sameSite: "none"})
            .status(200).json({message: "User created successfully", token, firebaseToken,
                user: {id: savedUser._id, username: savedUser.username, email: savedUser.email, phone: savedUser.phone, firstName: savedUser.firstName, lastName: savedUser.lastName }
            }
        )
    } catch (err) {
        console.error('Sign up error:', err)
        res.status(500).json({message: "Internal server error"})
    }
}

// Sign in user 
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if( !email || !password ) return res.status(400).json({message:'All fields required'})

        const user = await UserModel.findOne({ email })
        if(!user) return res.status(404).json({ message: "User not found" })

        const isPasswordSame = await bcrypt.compare(password, user.password)
        if (!isPasswordSame) return res.status(400).json({message: "Invalid credentials"})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"} )
        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());

        res.cookie("token", token, {httpOnly:true, secure: process.env.NODE_ENV === 'production', maxAge: 24*60*60*1000, sameSite: "none"})
        .status(200).json({message: "User signed in successfully", firebaseToken, user: {id:user._id, username: user.username, email: user.email, phone: user.phone, firstName: user.firstName, lastName: user.lastName, profileImage: user.profileImage }})
    } catch (err) {
        console.error('Sign in error:', err)
        res.status(500).json({message: "Internal server error"})      
    }
}

// Sign Out user 
const signOut = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({message: "User successfully signed out"})
    } catch (err) {
        console.error('Sign out error:', err)
        res.status(500).json({message: "Internal server error"})
    }
}

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email) return res.status(400).json({message: "Email is required"})

        const user = await UserModel.findOne({email})
        if(!user) return res.status(400).json({message: "User not found"})

        const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"})
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`

        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 15*60*1000
        await user.save()

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the following link to reset your password: ${resetLink}\nThis link expires in 15 minutes.`,
            html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`,
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({message: "Password reset link sent to your email"})
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({message: "Internal server error"})        
    }
}

// Confirm password reset
const confirmPasswordReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if(!token || !newPassword) return res.status(400).json({message: "Token and password are required"})

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()},
        })
        if(!user) return res.status(400).json({message: "Invalid or expired token"})
        
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch (err) {
            return res.status(400).json({message: "Invalid token"})
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetPasswordToken = null
        user.resetPasswordExpires = null
        await user.save()

        res.status(200).json({message: "Password reset successfully"})
    } catch (err) {
        console.error('Confirm password reset error:', err)
        res.status(500).json({message: "Internal server error"})        
    }
    
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization){
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            } 
        } 
        
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { firstName, lastName, username, email, phone, password, profileImage } = req.body;

        // Update fields if provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (profileImage !== undefined) user.profileImage = profileImage; // Update profile image URL

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
            },
        });

        console.log('Received update request for:', req.url, 'Token:', token, 'Body:', req.body);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {signUp, signIn, signOut, authCheck, requestPasswordReset, confirmPasswordReset, updateProfile}