import { Request, Response } from 'express';
import UserModel from "../models/userModel";

const jwt = require('jsonwebtoken'); 


const createToken = (_id: any) => {
    return jwt.sign({ _id }, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const user = await UserModel.login(email, password);

        const token = createToken(user._id)

        response.status(200).json({ email, token});
    } catch (error) {
        if (error instanceof Error) {
            response.status(400).json({ error: error.message });
        } else {
            response.status(400).json({ error: 'An unknown error occurred' });
        }
    }
}

const signupUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const user = await UserModel.signup(email, password);

        const token = createToken(user._id)

        response.status(200).json({ email, token});
    } catch (error) {
        if (error instanceof Error) {
            response.status(400).json({ error: error.message });
        } else {
            response.status(400).json({ error: 'An unknown error occurred' });
        }
    }
}

export { loginUser, signupUser };
