const success = (statusCode, result) => {
    return {
        status: 'ok',
        statusCode,
        result,
    };
};

const customError = (statusCode, message) => {
    return {
        status: 'error',
        statusCode,
        message,
    };
};

module.exports = {
    success,
    customError,
};
