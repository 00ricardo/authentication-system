import express from 'express'
import {
    getUsers, auth, registerUser, sendEmail,
    validateEmailToken, passRecovery, changePassword,
    deleteUsers
} from '../../controllers/auth/userController.js'
import { protect } from '../../controllers/auth/authMiddleware.js'

const router = express.Router()

// Manage Authentication
router.post('/auth', auth)

router.post('/register', registerUser)

router.post('/sendemail', sendEmail)

router.put('/confirm-email', validateEmailToken)

router.put('/password-recovery', passRecovery)

router.put('/change-password', changePassword)


// Manage Users
router.route('/users').get(protect, getUsers)

router.post('/users')

router.route('/users').delete(/*protect, */deleteUsers)

router.get('/user/:userid')

router.post('/user/:userid')

router.delete('/user/:userid')

export default router