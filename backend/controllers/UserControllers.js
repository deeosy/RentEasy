const UserModel = require('../models/UserModel')
const bcrypt = require("bcryptjs")


// create new user
const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body; // user info from frontend

        if(!username || !email || !password ) return res.status(400).json({message: "All fields are required"}) // required input fields
        
        const existingUser = await UserModel.findOne({ email }) // chedk if email is already in the database
        if(existingUser) return res.status(400).json({message: "User already exists"})
        
        const hashedPassword = await bcrypt.hash(password, 10)  // hash password b4 saving in database
        
        const user = new UserModel({ username, email, password: hashedPassword }) // passing the user to the backend
        const savedUser = await user.save() // saving the new user in the backend

        res.status(200).json({message: "User created successfully", data: savedUser })
    } catch (err) {
        console.error({message: err.message})
        res.status(500).json({message: "Internal server error"})
    }
}


// Sign in user 

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body // get credentials from frontend 
        if( !email || !password ) return res.status(400).json('All fields required') // required input fields

        const user = await UserModel.findOne({ email }) // get user from database
        if(!user) return res.status(404).json({ message: "User not found" })

        const isPasswordSame = await bcrypt.compare(password, user.password)  // compare passwords
        if (!isPasswordSame) return res.status(400).json({message: "Invalid credentials"})
        
        res.status(200).json({message: "User signed in successfully", user: {id:user._id, username: user.username, email: user.email}})

    } catch (err) {
        console.error({message: err.message}) 
        res.status(500).json({message: "Internal server error"})      
    }
}




module.exports = {signUp, signIn}