import express from 'express';
import cors from 'cors';
import adaptRequest from '../helpers/adapt-request';
import { makeHttpResponse } from '../helpers/http-respond-gen';
import companyValidator from '../validators/company-validator';
import repo from '.';
import validateToken from '../middlewares/token';
require('dotenv').config();

const route = express.Router();
route.use(cors());


route.all('/', validateToken, (req, res) => {
  const httpRequest = adaptRequest(req);

  responseFactory(httpRequest)
    .then(({ headers, statusCode, data }) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      res.status(500).json(e.message);
    });
});


route.all('/:id', validateToken, (req, res) => {
  const httpRequest = adaptRequest(req);

  responseIdFactory(httpRequest)
    .then(({ headers, statusCode, data }) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      res.status(500).json(e.message);
    });
});


async function responseFactory(httpRequest) {

  //Cheking if the user id is on the superuser model
  const superuser = await repo.superuserRepo.findById(httpRequest.tokenDecoded._id)

  if (!superuser) {
    return makeHttpResponse.error({
      statusCode: 403,
      errorMessage: 'Unauthorized access',
    });
  }

  switch (httpRequest.method) {
    case 'GET':
      return getCompanies(httpRequest);

    case 'POST':
      return postCompanies(httpRequest);

    default:
      return makeHttpResponse.error({
        statusCode: 400,
        errorMessage: `${httpRequest.method} request type not allowed!`,
      });
  }
}

async function responseIdFactory(httpRequest) {

  //Cheking if the user id is on the superuser model
  const superuser = await repo.superuserRepo.findById(httpRequest.tokenDecoded._id)

  if (!superuser) {
    return makeHttpResponse.error({
      statusCode: 403,
      errorMessage: 'Unauthorized access',
    });
  }

  switch (httpRequest.method) {
    case 'GET':
      return getOneCompany(httpRequest);

    case 'PUT':
      return putCompany(httpRequest);

    case 'DELETE':
      return delCompany(httpRequest);

    default:
      return makeHttpResponse.error({
        statusCode: 400,
        errorMessage: `${httpRequest.method} request type not allowed!`,
      });
  }
}

async function getCompanies(httpRequest) {

  const { state, date } = httpRequest.queryParams

  const filter = {}
  const sorted = {}

  if (state) {
    filter.isActive = state == 'Active' ? true : false
  }
  if (date) {
    sorted.dateExp = date
  }

  const results = await repo.companyRepo.findAll(httpRequest.queryParams, filter, sorted);
  const companies = [];

  for (const company of results.companies) {
    companies.push({
      isActive: company.isActive ? 'Active' : 'Inactive',
      _id:      company._id,
      name:     company.name,
    });
  }

  results.companies = companies

  return makeHttpResponse.success({
    statusCode: 200,
    data: results,
  });
}

async function getOneCompany(httpRequest) {
  const id = httpRequest.pathParams.id;

  const result = await repo.companyRepo.exist(id);

  const dateFormated = new Date(result.dateExp).toISOString().slice(0,10)

  const company = {
    isActive:         result.isActive ? 'Active' : 'Inactive',
    usersRegistered:  result.usersRegistered.length,
    _id:              result._id,
    name:             result.name,
    rnc:              result.rnc,
    email:            result.email,
    telephone:        result.telephone,
    usersPaid:        result.usersPaid,
    dateExp:          dateFormated,
    description:      result.description
  }

  if (!company) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: "Company not found!",
    });
  }

  return makeHttpResponse.success({
    statusCode: 200,
    data: company,
  });
}

async function postCompanies(httpRequest) {
  try {
    const validCompany = companyValidator(httpRequest.body);

    const companies = await repo.companyRepo.add(validCompany);

    return makeHttpResponse.success({
      statusCode: 200,
      data: companies,
    });
  } catch (e) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: e.message,
    });
  }
}

async function putCompany(httpRequest) {
  const id = httpRequest.pathParams.id;

  try {
    const validCompany = companyValidator(httpRequest.body);

    const editedCompany = await repo.companyRepo.modify(id, validCompany);

    return makeHttpResponse.success({
      statusCode: 200,
      data: editedCompany,
    });
  } catch (e) {
    return makeHttpResponse.error({
      statusCode: 400,
      errorMessage: e.message,
    });
  }
}

async function delCompany(httpRequest) {
  const id = httpRequest.pathParams.id;

  const deletedInfo = await repo.companyRepo.remove(id);
  await repo.userRepo.removeMany(id);

  return makeHttpResponse.success({
    statusCode: 200,
    data: deletedInfo,
  });
}

export default route;
