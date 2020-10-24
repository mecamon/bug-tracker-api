import jwt from "jsonwebtoken";
require("dotenv").config();
import { makeHttpResponse } from '../helpers/http-respond-gen'


function validateToken (req, res, next) {
  let token = req.get('Authorization')

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return makeHttpResponse.error({
        statusCode: 403,
        errorMessage: err.message
      })
    }
    req.tokenDecoded = decoded
    next()
  })
}

export default validateToken

