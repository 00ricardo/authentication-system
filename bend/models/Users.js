import moongose from 'mongoose'
const userSchema = moongose.Schema({
    name: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

const User = moongose.model('User', userSchema)

export default User