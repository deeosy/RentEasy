const express = require("express")
const { signUp, signIn, signOut, authCheck, requestPasswordReset, confirmPasswordReset } = require("../controllers/UserControllers")

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)

router.post('/reset-password/request', requestPasswordReset)
router.post('/reset-password/confirm', confirmPasswordReset)
router.get('/', authCheck)


module.exports = router

