import express from "express";
import cors from "cors";
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from '../helpers/http-respond-gen'
import companyValidator from '../validators/company-validator'
import repo from '.'
import jwt from "jsonwebtoken";
require("dotenv").config();
 

const route = express.Router();
route.use(cors())

route.all('/', (req, res) => {
    const httpRequest = adaptRequest(req)

    responseFactory(httpRequest)
        .then( ({ headers, statusCode, data }) => {
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        }).catch(e => {
            res
                .status(500)
                .json(e.message)
        })
})


route.all('/:id', (req, res) => {
    const httpRequest = adaptRequest(req)

    responseIdFactory(httpRequest)
        .then( ({ headers, statusCode, data }) => {
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        }).catch(e => {
            res
                .status(500)
                .json(e.message)
        })
})


async function responseFactory(httpRequest) {

    jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

    switch (httpRequest.method) {
        case "GET"
            : return getCompanies()

        case "POST"
            : return postCompanies(httpRequest)

        default
            : return makeHttpResponse.error({
                statusCode: 400,
                errorMessage: `${httpRequest.method} request type not allowed!`
            }) 
    }
}


async function responseIdFactory(httpRequest) {

    jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

    switch (httpRequest.method) {
        case "GET"
            : return getOneCompany(httpRequest)
        
        case "PUT"
            : return putCompany(httpRequest)

        case "DELETE"
            : return delCompany(httpRequest)

        default
            : return makeHttpResponse.error({
                statusCode: 400,
                errorMessage: `${httpRequest.method} request type not allowed!`
            }) 
    }
}


async function getCompanies() {
    
    const results = await repo.companyRepo.findAll()
    const companies = []

    for (const company of results) {
        companies.push({
            isActive        :company.isActive ? "Active" : "Inactive",
            usersRegistered :company.usersRegistered.length,
            _id             :company._id,
            name            :company.name,
            rnc             :company.rnc,
            email           :company.email,
            telephone       :company.telephone,
            usersPaid       :company.usersPaid,
            dateExp         :company.dateExp
        })
    }

    return makeHttpResponse.success({
        statusCode: 200,
        data: companies
    })
}


async function getOneCompany(httpRequest) {

    const id = httpRequest.pathParams.id

    const company = await repo.companyRepo.exist(id)

    return makeHttpResponse.success({
        statusCode: 200,
        data: company
    })
}


async function postCompanies(httpRequest) {
    try {
        const validCompany = companyValidator(httpRequest.body)

        const companies = await repo.companyRepo.add(validCompany)

        return makeHttpResponse.success({
            statusCode: 200,
            data: companies
        })
    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        })
    }
}


async function putCompany(httpRequest) {

    const id = httpRequest.pathParams.id

    try {
        const validCompany = companyValidator(httpRequest.body)

        const editedCompany = await repo.companyRepo.modify(id, validCompany)

        return makeHttpResponse.success({
            statusCode: 200,
            data: editedCompany
        })
    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        })
    }
}


async function delCompany(httpRequest) {

    const id = httpRequest.pathParams.id

    const deletedInfo = await repo.companyRepo.remove(id)
    await repo.userRepo.removeMany(id)

    return makeHttpResponse.success({
        statusCode: 200,
        data: deletedInfo
    })
}


export default route;