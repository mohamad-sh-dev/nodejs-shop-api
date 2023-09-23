const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

function swaggerHandler() {
    let swaggerDocumentObject = {};
    const swaggerConfigsRoot = path.join(__dirname, process.env.DOCUMENTS_CONFIG_PATH);
    const swaggerConfigsDirectory = fs.readdirSync(swaggerConfigsRoot);

    const parenetDcumentRootOFAllApis = path.join(__dirname, process.env.DOCUMENTS_APIS_ROOT_PATH);
    const allApisDocumentDirectory = fs.readdirSync(parenetDcumentRootOFAllApis);

    swaggerConfigsDirectory.forEach((swaggerDocumentConfigRoot) => {
        const configFileRoot = path.join(swaggerConfigsRoot, swaggerDocumentConfigRoot);
        const loadedSwaggerDocumentConfig = YAML.load(configFileRoot);
        swaggerDocumentObject = Object.assign(loadedSwaggerDocumentConfig, swaggerDocumentObject);
    });
    let apisDocumentPathsObject = {};
    allApisDocumentDirectory.forEach((apisPathDocumentRoot) => {
        const apiDocumentDirectoryPath = path.join(parenetDcumentRootOFAllApis, apisPathDocumentRoot);
        const apiDocumentPath = fs.readdirSync(apiDocumentDirectoryPath);

        const apiDocumentFilePath = path.join(parenetDcumentRootOFAllApis, apisPathDocumentRoot, apiDocumentPath[0]);
        const loadedDocument = YAML.load(apiDocumentFilePath);
        apisDocumentPathsObject = Object.assign(loadedDocument, apisDocumentPathsObject);
    });
    swaggerDocumentObject.paths = apisDocumentPathsObject;
    return swaggerDocumentObject;
}
module.exports = {
    swaggerHandler
};
