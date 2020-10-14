import express from "express";
import cors from "cors";
import adaptRequest from "../helpers/adapt-request";
import { makeHttpResponse } from '../helpers/http-respond-gen'
import reportValidator from '../validators/report-validator'
import repo from '.'
import jwt from "jsonwebtoken";
require("dotenv").config();
 

const route = express.Router();
route.use(cors())

route.get('/pending', (req, res) => {
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

route.get('/history', (req, res) => {
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

route.post('/create-report', (req, res) => {
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


route.put('/:id', (req, res) => {
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
    const {_id} = jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

    const filter = {
        user_id: _id
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
    jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

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
    const { _id } = jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

    try {
        const validReport = reportValidator(httpRequest.body)

        validReport.user_id = _id

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
    const { _id } = jwt.verify(httpRequest.authorization, process.env.TOKEN_KEY)

    const filter = { user_id: _id, isCancelled: false, isSolvedUser: false }

    const pendingReports = await repo.reportRepo.findAll(filter)

    return makeHttpResponse.success({
        statusCode: 200,
        data: pendingReports
    })
}


export default route;