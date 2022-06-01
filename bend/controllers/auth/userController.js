import User from '../../models/Users.js'
import checkParams from '../../utils/ubend.js'
import bcrypt from 'bcrypt'
const saltRounds = 10;


const auth = async (req, res) => {
    res.json({
        "status": {
            "code": "S200",
            "message": "User Sucessfully Authenticated."
        },
        "data": data
    })
}
const getUsers = async (req, res) => {
    //
}

const registerUser = async (req, res) => {
    let data = req.body
    let rp = [
        'first_name', 'last_name',
        'email', 'password'
    ]

    var [_status, http] = checkParams(rp, data)

    if (!_status) {
        const user = await User.findOne({ where: { email: data['email'] } });
        if (user) {
            [_status, http] = [{
                'code': 'E400',
                'message': `User ${user["email"]} already registed.`
            }, 400]
        }
    }

    // Hash Password
    if (!_status) {
        data["username"] = data["email"]
        try {
            data["password"] = bcrypt.hashSync(data["password"], saltRounds);
        }
        catch (error) {
            _status = error
        }
    }
    if (!_status) {
        try {
            User.create(data);
            [data["status"], http] = [{
                'code': 'S200',
                'message': 'User Sucessfully Registed.'
            }, 200]

        }
        catch (error) {
            [_status, http] = [{
                'code': 'E400',
                'message': error
            }, 400]
        }
    }
    if (!_status) {
        res.status(http).json(data)
    }

    else {
        res.status(400).json(_status)
    }
}

export {
    getUsers,
    auth,
    registerUser
}