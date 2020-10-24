import express from "express";
import cors from "cors";
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from '../helpers/http-respond-gen'
import reportValidator from '../validators/report-validator'
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

route.post('/create-report', validateToken, (req, res) => {
    const httpRequest = adaptRequest(req)

    createReport(httpRequest)
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

    editReport(httpRequest)
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



async function reportsHistory(httpRequest) {
    //Cheking if the user is a tech or supervisor
    const { isTech, isSupervisor } = httpRequest.tokenDecoded

    if (isTech || isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    const filter = {
        user_id: httpRequest.tokenDecoded._id
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


async function editReport(httpRequest) {
    //Cheking if the user is a tech or supervisor
    const { isTech, isSupervisor } = httpRequest.tokenDecoded

    if (isTech || isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    try {
        const validEdit = reportValidator(httpRequest.body)

        const editedReport = await repo
            .reportRepo.modify(httpRequest.pathParams.id, validEdit)

        return makeHttpResponse.success({
            statusCode: 200,
            data: editedReport
        })

    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        })
    }
}



async function createReport(httpRequest) {
    //Cheking if the user is a tech or supervisor
    const { isTech, isSupervisor } = httpRequest.tokenDecoded

    if (isTech || isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    try {
        const validReport = reportValidator(httpRequest.body)

        validReport.user_id = httpRequest.tokenDecoded._id

        const newReport = await repo.reportRepo.add(validReport)

        return makeHttpResponse.success({
            statusCode: 200,
            data: newReport
        })

    } catch (e) {
        return makeHttpResponse.error({
            statusCode: 400,
            errorMessage: e.message
        })
    }
}


async function pendingReports(httpRequest) {
    //Cheking if the user is a tech or supervisor
    const { isTech, isSupervisor } = httpRequest.tokenDecoded
    const { app, date } = httpRequest.queryParams

    if (isTech || isSupervisor) {
        return makeHttpResponse.error({
          statusCode: 403,
          errorMessage: 'Unauthorized access',
        });
    }

    const filter = { user_id: httpRequest.tokenDecoded._id, 
        isCancelled: false, isSolvedUser: false }

    const sorted = {}

    if (app) filter.app = app
    if (date) sorted.date = date

    const results = await repo.reportRepo.findAll(httpRequest.queryParams, filter, sorted)
    const reports = []

    for (const report of results.reports) {
        reports.push({
          _id:      report._id,
          app:      report.app,
          date:     report.date,
        });
    }

    results.reports = reports

    return makeHttpResponse.success({
        statusCode: 200,
        data: results
    })
}


export default route;