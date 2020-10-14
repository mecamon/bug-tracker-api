import jwt from "jsonwebtoken";
require("dotenv").config();
import { makeHttpResponse } from '../helpers/http-respond-gen'


function generate(payload) {
  const token = jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: process.env.TOKEN_TIME,
  })
  return token;
}

function verifyToken(authorization) {
  jwt.verify(authorization, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return makeHttpResponse.error({
        statusCode: 403,
        errorMessage: err.message
      })
    }
  })
    
}

function decodeToken(authorization) {
  return jwt.decode(authorization, )
}

export default ({
  generate,
  verifyToken,
  decodeToken
});
