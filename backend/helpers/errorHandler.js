exports.errorCode = (res, code, errorHandler) => {
    return res.status(code).json({
        error: errorHandler
    })
}