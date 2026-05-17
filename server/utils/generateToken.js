import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Vé này có hiệu lực trong 30 ngày
  });
};

export default generateToken;
