import express from "express";
import cors from "cors";
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from "../helpers/http-respond-gen";
import repo from "../controllers";
import superuserValidator from "../validators/superuser-validator";
import userValidator from "../validators/user-validator";
import { UsersLimitExeceded } from "../helpers/errors";
import validateToken from "../middlewares/token";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
require("dotenv").config();

const route = express.Router();
route.use(cors());

route.post("/login", (req, res) => {
  const httpRequest = adaptRequest(req);

  logUser(httpRequest)
    .then(({ headers, statusCode, data }) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      res.status(500).json(e.message);
    });
});

route.post("*", validateToken, (req, res) => {
  const httpRequest = adaptRequest(req);

  responseFactory(httpRequest)
    .then(({ headers, statusCode, data }) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      res.status(500).json(e.message);
    });
});

async function responseFactory(httpRequest) {
  switch (httpRequest.path) {
    case "/register-superuser":
      return registerSuperuser(httpRequest);

    case "/register-supervisor":
      return registerSupervisor(httpRequest);

    case "/register-user":
      return registerUser(httpRequest);

    default:
      return makeHttpResponse.error({
        statusCode: 400,
        errorMessage: "Route not available!",
      });
  }
}

async function logUser(httpRequest) {
  let user =
    (await repo.userRepo.exist(httpRequest.body.username)) ||
    (await repo.superuserRepo.exist(httpRequest.body.username));

  if (!user)
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: "Username or password is incorrect!",
    });

  if (!bcrypt.compareSync(httpRequest.body.password, user.password)) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: "Username or password is incorrect!",
    });
  }

  const { _id, firstname, lastname, idCompany, isTech, isSupervisor } = user;

  const token = jwt.sign(
    { _id, firstname, lastname, idCompany, isTech, isSupervisor },
    process.env.TOKEN_KEY,
    {
      expiresIn: process.env.TOKEN_TIME,
    }
  );

  return makeHttpResponse.success({
    statusCode: 202,
    data: { _id, firstname, lastname, token, isTech, isSupervisor },
  });
}

async function registerSuperuser(httpRequest) {
  try {
    const validUser = superuserValidator(httpRequest.body);
    const result = await repo.superuserRepo.add(validUser);

    return makeHttpResponse.success({
      statusCode: 201,
      data: result,
    });
  } catch (e) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: e.message,
    });
  }
}

async function registerSupervisor(httpRequest) {
  httpRequest.body["isSupervisor"] = true;

  try {
    const { usersPaid, usersRegistered } = await repo.companyRepo.exist(
      httpRequest.body.idCompany
    );

    if (!usersPaid || !usersRegistered) {
      throw new Error("Wrong company ID");
    } else if (usersRegistered >= usersPaid) {
      throw new UsersLimitExeceded("Not enough space. Buy more!");
    }

    const validUser = userValidator(httpRequest.body);
    const newUser = await repo.userRepo.add(validUser);

    await repo.companyRepo.push(newUser.idCompany, {
      usersRegistered: newUser._id,
    });

    return makeHttpResponse.success({
      statusCode: 201,
      data: newUser,
    });
  } catch (e) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: e.message,
    });
  }
}

async function registerUser(httpRequest) {
  const decoded = httpRequest.tokenDecoded;

  try {
    httpRequest.body["idCompany"] = decoded.idCompany;

    const { usersPaid, usersRegistered } = await repo.companyRepo.exist(
      httpRequest.body.idCompany
    );

    if (!usersPaid || !usersRegistered) {
      throw new Error("Wrong company ID");
    } else if (usersRegistered >= usersPaid) {
      throw new UsersLimitExeceded("Not enough space. Buy more!");
    }

    const validUser = userValidator(httpRequest.body);
    const newUser = await repo.userRepo.add(validUser);

    await repo.companyRepo.push(newUser.idCompany, {
      usersRegistered: newUser._id,
    });

    return makeHttpResponse.success({
      statusCode: 201,
      data: newUser,
    });
  } catch (e) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: e.message,
    });
  }
}

export default route;
