const requireAuth = (request: any, response: any, next: any) => {
  if (!request.session || !request.session._id) {
    return response.status(401).json({ error: 'You must be logged in to access this page' });
  }

  next();
};

export default requireAuth;