module.exports = {
    REQUEST_PARAMS: 'params',
    REQUEST_BODY: 'body',
    REQUEST_QUERY: 'query',
    MONGO_ID_PATTERN: /^[0-9a-fA-F]{24}$/,
    PASSWORD_PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ // Minimum eight characters, at least one letter and one number:
};

// {
//     "status": "success",
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTM4Nzk0OTI3OSIsImlhdCI6MTY5NTM3NzU0NCwiZXhwIjoxNjk1NDYzOTQ0fQ.s9APIebDUQWHjsamp_oBF4uyn-VqTX8Q_FHJAK_wxzg",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTM4Nzk0OTI3OSIsImlhdCI6MTY5NTM3NzU0NCwiZXhwIjoxNzI2OTM1MTQ0fQ.4yGzR2jqh_o-WXnujPW8l9-rzhQaSGoSz6_RQJEM1Yw"
//   }
