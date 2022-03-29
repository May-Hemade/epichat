"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAllHandler = exports.forbiddenHandler = exports.genericErrorHandler = exports.notFoundHandler = exports.unauthorizedHandler = exports.badRequestHandler = void 0;
const badRequestHandler = (err, req, res, next) => {
    if (err.status === 400) {
        console.log("I am the bad request handler", err);
        res.status(400).send({ message: err.message, errorsList: err.errorsList });
    }
    else {
        next(err);
    }
};
exports.badRequestHandler = badRequestHandler;
const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
        console.log("I am the unauthorized handler", err);
        res.status(401).send({ message: err.message, errorsList: err.errorsList });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
const notFoundHandler = (err, req, res, next) => {
    if (err.status === 404) {
        console.log("I am the not found handler", err);
        res.status(404).send({
            message: err.message,
            errorsList: undefined
        });
    }
    else {
        next(err);
    }
};
exports.notFoundHandler = notFoundHandler;
const genericErrorHandler = (err, req, res, next) => {
    console.log("I am the error handler here is the error: ", err);
    res.status(500).send({
        message: "Generic Server Error!",
        errorsList: undefined
    });
};
exports.genericErrorHandler = genericErrorHandler;
const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
        res
            .status(403)
            .send({
            message: err.message || "You are not allowed to do that!",
            errorsList: undefined
        });
    }
    else {
        next(err);
    }
};
exports.forbiddenHandler = forbiddenHandler;
const catchAllHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({
        message: "Generic Server Error",
        errorsList: undefined
    });
};
exports.catchAllHandler = catchAllHandler;
