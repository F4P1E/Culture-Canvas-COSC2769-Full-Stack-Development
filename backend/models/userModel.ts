import mongoose, { Model, Document } from "mongoose";
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

interface IUser extends Document {   
    username: string;
    email: string;
    password: string;
    friends: IUser[];
    requests: string[];
}

interface IUserModel extends Model<IUser> {        
    signup(email: string, password: string): Promise<IUser>;
    login(email: string, password: string): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  requests: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, { timestamps: true });

// Static signup method
userSchema.statics.signup = async function (email: string, password: string) {

    //check for existing email
    const exists = await this.findOne({ email });
    
    if (exists) {
        throw new Error('Email already in use');  //for signup only. Only one email account can register
    }

    //validate
    if (!email || !password) {
        throw Error("All fields must be filled")
    }
    if (email.length < 12) {
        throw Error("Email must be at least 12 characters");
    }
    if (!(email.endsWith("@gmail.com"))) {
        throw new Error("Email must be a Gmail account");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
    if (!(/\d/.test(password))) {
        throw new Error("Password must contain at least one number");
    }
    if (!(/[!@#$%^&*(),.?":{}|<>]/.test(password))) {
        throw new Error("Password must contain at least one symbol");
    }


    //hashing password for the new account
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash });

    return user;
}


//Static login method

userSchema.statics.login = async function (email: string, password: string) {
    if (!email || !password) {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({ email });
    
    if (!user) {
        throw new Error('Incorrect email');  //Finding the correct email registered
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw new Error('Incorrect password');
    }

    return user;
}

const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default UserModel;
