import express from 'express'
import { getUsers, auth, registerUser, sendEmail, validateEmailToken } from '../../controllers/auth/userController.js'
import { protect } from '../../controllers/auth/authMiddleware.js'

const router = express.Router()
/*
Manage Authentication
*/
router.post('/auth', auth)

/*
Manage Authentication
*/
router.post('/register', registerUser)

router.post('/sendemail', sendEmail)

router.put('/confirm-email/', validateEmailToken)


/*
Manage Users
*/
router.route('/users').get(protect, getUsers)
router.post('/users')
router.delete('/users')




/*
Manage Specific User
*/
router.get('/user/:userid')
router.post('/user/:userid')
router.delete('/user/:userid')

export default router