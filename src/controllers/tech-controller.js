import express from "express";
import cors from "cors";
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from '../helpers/http-respond-gen'
import repo from '.'
import validateToken from "../middlewares/token";
require("dotenv").config();
 

const route = express.Router();
route.use(cors())

route.get('/pending', validateToken, (req, res) => {
    const httpRequest = adaptRequest(req)

    pendingReports(httpRequest)
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

route.get('/history', validateToken, (req, res) => {
    const httpRequest = adaptRequest(req)

    reportsHistory(httpRequest)
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

route.get('/bugpool', validateToken, (req, res) => {
    const httpRequest = adaptRequest(req)

    bugpool(httpRequest)
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


route.put('/:id', validateToken, (req, res) => {
    const httpRequest = adaptRequest(req)

    acceptReport(httpRequest)
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



async function bugpool(httpRequest) {

    //Cheking if the user is a tech
    const { isTech } = httpRequest.tokenDecoded

    if (!isTech) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    const filter = {tech_id: undefined}

    const sortedBy = {}

    //Adding props to object to sort in order
    Object.keys(httpRequest.queryParams).map((key, index) => {
        sortedBy[`${key}`] = -1
    })

    const reports = await repo.reportRepo.findAll(filter, sortedBy)

    return makeHttpResponse.success({
        statusCode: 200,
        data: reports
    })
}


async function reportsHistory(httpRequest) {

    //Cheking if the user is a tech
    const { isTech } = httpRequest.tokenDecoded

    if (!isTech) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    const filter = {
        tech_id: httpRequest.tokenDecoded._id
    }

    const sortedBy = {}

    //Adding props to object to sort in order
    Object.keys(httpRequest.queryParams).map((key, index) => {
        sortedBy[`${key}`] = -1
    })

    const reports = await repo.reportRepo.findAll(filter, sortedBy)

    return makeHttpResponse.success({
        statusCode: 200,
        data: reports
    })
}


async function acceptReport(httpRequest) {

    //Cheking if the user is a tech
    const { isTech } = httpRequest.tokenDecoded

    if (!isTech) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    try {
        const acceptFilter = {
            isSelect: true, 
            tech_id: httpRequest.tokenDecoded._id 
        }

        const acceptedReport = await repo
            .reportRepo.modify(httpRequest.pathParams.id, acceptFilter)

        return makeHttpResponse.success({
            statusCode: 200,
            data: acceptedReport
        })

    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        })
    }
}




async function pendingReports(httpRequest) {

    //Cheking if the user is a tech
    const { isTech } = httpRequest.tokenDecoded

    if (!isTech) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    const filter = {
        tech_id: httpRequest.tokenDecoded._id, 
        isCancelled: false, 
        isSolvedUser: false 
    }

    const pendingReports = await repo.reportRepo.findAll(filter)

    return makeHttpResponse.success({
        statusCode: 200,
        data: pendingReports
    })
}


export default route;