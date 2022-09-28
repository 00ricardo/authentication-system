import express from 'express'
import {
    getUsers, auth, registerUser, sendEmail,
    validateEmailToken, passRecovery, changePassword,
    deleteUsers, logout
} from '../../controllers/auth/userController.js'
import { protect } from '../../controllers/auth/authMiddleware.js'

const router = express.Router()

// Manage Authentication
router.route('/auth').post(auth)

router.route('/logout').post(protect, logout)

router.route('/register').post(registerUser)

router.route('/sendemail').post(sendEmail)

router.route('/confirm-email').put(validateEmailToken)

router.route('/password-recovery').put(passRecovery)

router.route('/change-password').put(changePassword)

// Manage Users
router.route('/users').get(protect, getUsers)

router.post('/users')

router.route('/users').delete(/*protect, */deleteUsers)

router.get('/user/:userid')

router.post('/user/:userid')

router.delete('/user/:userid')

export default router