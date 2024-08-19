import UserModel from "../models/userModel";

const loginUser = async (request: any, response: any) => {
  const { email, password } = request.body;

  try {
    const user = await UserModel.login(email, password);

    request.session._id = user._id;
    request.session.email = email;

      response.status(200).json({ email });
      
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(400).json({ error: 'An unknown error occurred' });
    }
  }
}

const signupUser = async (request: any, response: any) => {
  const { email, password } = request.body;

  try {
    const user = await UserModel.signup(email, password);

    request.session.userId = user._id;
    request.session.email = email;

    response.status(200).json({ email });
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(400).json({ error: 'An unknown error occurred' });
    }
  }
}

export { loginUser, signupUser };
