import express from "express";
import cors from "cors";
import requiredParam from '../helpers/required-param'
import fieldValidator from '../validators/field-validators'
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from '../helpers/http-respond-gen'
import repo from '.'
import validateToken from '../middlewares/token';
require("dotenv").config();
 

const route = express.Router();
route.use(cors())

route.get('/', validateToken,  (req, res) => {
    const httpRequest = adaptRequest(req)

    getUsers(httpRequest)
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


route.all('/:id', validateToken,  (req, res) => {
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

async function getUsers(httpRequest) {

    //Cheking if the user is a supervisor
    const { isSupervisor } = httpRequest.tokenDecoded

    if (!isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }
    
    const filter = {
        idCompany: httpRequest.tokenDecoded.idCompany, 
        isSupervisor: false, 
    } || {}

    for (const key in httpRequest.queryParams) {
        filter[`${key}`] = httpRequest.queryParams[key]
    }

    const users = await repo.userRepo.findAll(filter)

    return makeHttpResponse.success({
        statusCode: 200,
        data: users
    })
}


async function responseIdFactory(httpRequest) {

    //Cheking if the user is a supervisor
    const { isSupervisor } = httpRequest.tokenDecoded

    if (!isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    switch (httpRequest.method) {
        case "GET"
            : return getResumeOfUser(httpRequest)
        
        case "PUT"
            : return modifyUser(httpRequest)

        case "DELETE"
            : return deleteUser(httpRequest)

        default
            : return makeHttpResponse.error({
                statusCode: 400,
                errorMessage: `${httpRequest.method} request type not allowed!`
            }) 
    }
}

async function deleteUser(httpRequest){
    const { idCompany } = await repo.userRepo.findById(httpRequest.pathParams.id)

    await repo.userRepo.remove(httpRequest.pathParams.id)

    const deletedFromCompanyInfo = await repo.companyRepo.pull(
        idCompany, 
        { usersRegistered: httpRequest.pathParams.id }
    )

    return makeHttpResponse.success({
        statusCode: 200,
        data: deletedFromCompanyInfo
    })
}


async function modifyUser(httpRequest) {
    try {
        const validEntry = validate(httpRequest.body)

        const modifiedUser = await repo.userRepo.modify(
            httpRequest.pathParams.id, 
            validEntry
        )
    
        return makeHttpResponse.success({
            statusCode: 200,
            data: modifiedUser
        })

        function validate({
            firstname = requiredParam('firstname'),
            lastname = requiredParam('lastname'),
            username = requiredParam('username'),
            email = requiredParam('email'),
            gender = requiredParam('gender'),
            isTech = requiredParam('isTech'),
          }) {
            fieldValidator.name(2, "firstname", firstname)
            fieldValidator.name(2, "lastname", lastname)
            fieldValidator.nameWithNumbers(2, "username", username)
            fieldValidator.email(email)
      
            return Object.freeze({firstname, lastname, username, email, gender, isTech})
        }

    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        }) 
    }
}


async function getResumeOfUser(httpRequest) {
    
    const filter = {}

    const user = await repo.userRepo.findById(httpRequest.pathParams.id) 

    if (user.isTech) {
        filter.tech_id = httpRequest.pathParams.id
    } else {
        filter.user_id = httpRequest.pathParams.id
    }

    const reports = await repo.reportRepo.findAll(filter)
    
    const userResume = {
        firstname:  user.firstname,
        lastname:   user.lastname,
        email:       user.email,
        gender:     user.gender,
        birth:      user.birth,
        reports:    reports.length,
    }

    let reportsCancelled = 0
    let reportsSolved = 0
    let reportsUnsolved = 0
      
    reports.forEach(report => {
    if (report.isCancelled) reportsCancelled++
    if (report.isSolvedUser) reportsSolved++
    if (!report.isSolvedUser) reportsUnsolved++
    })

    const percentageCancelled = parseInt((reportsCancelled * 100) / reports.length) 
    const percentageSolved = parseInt((reportsSolved * 100) / reports.length) 
    const percentageUnsolved = parseInt((reportsUnsolved * 100) / reports.length) 

    userResume.reportsCancelled = `${percentageCancelled}%`
    userResume.reportsSolved = `${percentageSolved}%`
    userResume.reportsUnsolved = `${percentageUnsolved}%`

    return makeHttpResponse.success({
        statusCode: 200,
        data: userResume
    })
}


export default route;