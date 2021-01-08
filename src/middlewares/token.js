import jwt from "jsonwebtoken";
require("dotenv").config();
import { makeHttpResponse } from '../helpers/http-respond-gen'


function validateToken (req, res, next) {
  let token = req.get('authorization')

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)

    req.tokenDecoded = decoded

    next()

  }catch (e) {
    const { headers, statusCode, data } = makeHttpResponse.error({
      statusCode: 403,
      errorMessage: e.message
    })
    res.set(headers).status(statusCode).send(data);
  }
}

export default validateToken

