import UserModel from "../models/userModel";

const loginUser = async (request: any, response: any) => {

  const { email, password } = request.body;



  try {
    const user = await UserModel.login(email, password);

    request.session._id = user.id;
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

    request.session._id = user.id;
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

const sendFriendRequest = async (request: any, response: any) => {
  try {
    if (request.user.id !== request.params.id) {
      const sender: any = await UserModel.findById(request.user.id);
      const receiver: any = await UserModel.findById(request.params.id);
      
      if (!sender || !receiver) {
        response.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (
        !receiver.requests.includes(sender.id) &&
        !receiver.friends.includes(sender.id)) {
        
        await receiver.updateOne({
          $push: { requests: sender.id }
        });
        
        response.json({ message: 'Friend request sent successfully' });
      } else {
        response.status(400).json({ error: 'You have already sent a friend request to this user'})
      }
      
    } else {
     response.status(400).json({ error: "You cannot send a friend request to yourself" });
    }
  }
  catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
}

const cancelFriendRequest = async (request: any, response: any) => {
  try {
    if (request.user.id !== request.params.id) {
      const sender: any = await UserModel.findById(request.user.id);
      const receiver: any = await UserModel.findById(request.params.id);
      
      if (!sender || !receiver) {
        response.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (
        !receiver.requests.includes(sender.id) &&
        !receiver.friends.includes(sender.id)) {
        
        await receiver.updateOne({
          $pull: { requests: sender.id }
        });
        
        response.json({ message: 'Friend request cancel successfully' });
      } else {
        response.status(400).json({ error: 'Request already cancelled'})
      }
      
    } else {
     response.status(400).json({ error: "You cannot cancel a friend request sent to yourself" });
    }
  }
  catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
}

const acceptRequest = async (request: any, response: any) => {
  try {
    if (request.user.id !== request.params.id) {
      const receiver: any = await UserModel.findById(request.user.id);
      const sender: any = await UserModel.findById(request.params.id);
      
      if (!sender || !receiver) {
        response.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (receiver.requests.includes(sender.id)) {
        
        await receiver.update({
          $push: { friends: sender.id }
        });
        await sender.update({
          $push: { friends: receiver.id}
        });
        await receiver.updateOne({
          $pull: { requests: sender.id }
        });
        
        response.json({ message: 'Friend request accepted' });
      } else {
        response.status(400).json({ error: 'Already accepted this request'})
      }
      
    } else {
     response.status(400).json({ error: "You cannot accept a friend request sent to yourself" });
    }
  }
  catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
}

const unFriend = async (request: any, response: any) => {
  try {
    if (request.user.id !== request.params.id) {
      const sender: any = await UserModel.findById(request.user.id);
      const receiver: any = await UserModel.findById(request.params.id);
      
      if (!sender || !receiver) {
        response.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (receiver.friends.includes(sender.id) && sender.friends.includes(receiver._id)) {
        
        await receiver.update({
          $pull: { friends: sender.id }
        });
        await sender.update({
          $pull: { friends: receiver.id}
        });
        await receiver.updateOne({
          $pull: { requests: sender.id }
        });
        
        response.json({ message: 'Unfriended' });
      } else {
        response.status(400).json({ error: 'Already made this request'})
      }
      
    } else {
     response.status(400).json({ error: "Cannot unfriend yourself" });
    }
  }
  catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
}

