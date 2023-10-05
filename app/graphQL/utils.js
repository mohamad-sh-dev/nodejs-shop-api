/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
const { Kind } = require('graphql');
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { messageCenter } = require('../utilities/messages');

function parseValueNode(valueNode) {
    switch (valueNode.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return valueNode.value;
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value);
        case Kind.OBJECT:
            return parseObject(valueNode.value);
        case Kind.LIST:
            return valueNode.values.map(parseValueNode);
        default:
            return null;
    }
}
function parseObject(valueNode) {
    const value = Object.create(null);
    valueNode.fields.forEach((field) => {
        value[field.name.value] = parseValueNode(field.value);
    });
    return value;
}
function parseLiteral(valueNode) {
    switch (valueNode.kind) {
        case Kind.STRING:
            return valueNode.value.charAt(0) === '{' ? JSON.parse(valueNode.value) : valueNode.value;
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value);
        case Kind.OBJECT:
    }
}
function toObject(value) {
    if (typeof value === 'object') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        return JSON.parse(value);
    }
    return null;
}
async function checkExistContent(Model, id) {
    const content = await Model.findOne({ _id: id });
    if (!content) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
    return {
        content
    };
}
function createHttpErrorFromError(error) {
    const statusCode = error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
    return createHttpError[statusCode](error.message);
}

module.exports = {
    createHttpErrorFromError,
    toObject,
    parseLiteral,
    parseValueNode,
    parseObject,
    checkExistContent
};
