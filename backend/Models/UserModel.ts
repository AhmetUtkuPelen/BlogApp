import mongoose from "mongoose"


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
      },
      profilePicture: {
        type: String,
        default: "data:image/png;base64,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",
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
},{
    timestamps: true
})

const User = mongoose.model("User", UserSchema)

export default User