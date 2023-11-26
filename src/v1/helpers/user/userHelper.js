const Joi = require("joi");
const { checkOpKeys } = require('../common/searchOpKeys');
const logger = require('../../../logger/logger');
const { getName } = require('../../../logger/logFunctionName');

exports.validateUserCreate = (req, next) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let data = req;
        let data_validate = {};

        data_validate['first_name'] = Joi.string().required();
        data_validate['last_name'] = Joi.string().required();
        data_validate['email'] = Joi.string().email().required();
        data_validate['role'] = Joi.string().required();
        data_validate['phone_number'] = Joi.string().length(10).pattern(/^[0-9]+$/).required();
        let schemas = Joi.object().keys(data_validate);
        let validation = schemas.validate(data);

        if (validation.error) {
            logger.error(`*** ${validation.error.details[0].message} in %s of %s ***`, getName().functionName, getName().fileName);
            return ({ "status": 400, "success": false, "message": validation.error.details[0].message });
        } else {
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
            return ({ "status": 200, "success": true, "data": data });
        }
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        return ({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}

exports.formatResponseUserCreateData = (params) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let result = {};
        if (params.success) {
            result = {
                "status": 200,
                "success": true,
                "message": "User created successfully",
                "data": params.data
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        } else if (!params.success) {
            result = {
                "status": params.status,
                "success": false,
                "message": params.message,
                "data": params
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        }
        return (result);
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        next({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}

exports.validateUserListData = async (req, next) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let id = req.params.id || null;
        let filters = req.query.filters || null;
        let filter_op = req.query.filter_op || null;
        let result = {};
        let data_hash = { "id": id };
        if (filters) {
            let filters_obj = JSON.parse(filters);
            let filter_arr = Object.keys(filters_obj);
            let filter = {};
            filter_arr.forEach(e => {
                filter[e] = filters_obj[e]
            });
            if (Object.keys(filter).length > 0) {
                data_hash["filter"] = filter;
            }
        }
        if (filter_op) {
            let filter_op_obj = JSON.parse(filter_op);
            var isPassedOpKeys = await checkOpKeys(Object.values(filter_op_obj));
            if (!isPassedOpKeys.success) {
                result = {
                    "success": false,
                    "message": isPassedOpKeys.message
                };
                resolve(result);
                return;
            }
            if (Object.keys(filter_op_obj).length > 0) {
                data_hash["filter_op"] = filter_op_obj;
            }
        }
        result = {
            "success": true,
            "data": data_hash
        };
        logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        return (result);
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        next({ "status": 500, "success": false, "message": "Something went wrong" });
    }
};

exports.formatResponseUserListData = (params) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let result = {};
        if (params.success) {
            result = {
                "status": 200,
                "success": true,
                "total": params.total,
                "data": params.data
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        } else if (!params.success) {
            result = {
                "status": params.status,
                "total": params.total,
                "success": false,
                "message": params.message,
                "data": params
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        }
        return (result);
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        next({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}

exports.validateUserUpdateData = (req, next) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let data = req.body;
        let id = req.params.id;
        let data_validate = {};
        if (Object.keys(data).length == 0) {
            next({ "status": 400, "success": false, "message": "Required_Parameters_Are_Missing" });
        }
        if (!id) {
            next({ "status": 400, "success": false, "message": "Id Is Required" });
        }
        if (data.hasOwnProperty('first_name')) {
            data_validate['first_name'] = Joi.string().required()
        }
        if (data.hasOwnProperty('last_name')) {
            data_validate['last_name'] = Joi.string().required()
        }
        if (data.hasOwnProperty('email')) {
            data_validate['email'] = Joi.string().email().required()
        }
        if (data.hasOwnProperty('role')) {
            data_validate['role'] = Joi.string().required()
        }
        if (data.hasOwnProperty('phone_number')) {
            data_validate['phone_number'] = Joi.string().length(10).pattern(/^[0-9]+$/).required()
        }
        let schemas = Joi.object().keys(data_validate);
        let validation = schemas.validate(data);
        if (id) {
            if (validation.error) {
                logger.error(`*** ${validation.error.details[0].message} in %s of %s ***`, getName().functionName, getName().fileName);
                return ({ "status": 400, "success": false, "message": validation.error.details[0].message });
            } else {
                logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                return ({ "status": 200, "success": true, "data": data, "id": id });
            }
        } else {
            logger.error(`*** "id is required" in %s of %s ***`, getName().functionName, getName().fileName);
            return ({ "status": 400, "success": false, "message": "id is required!" });
        }


    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        return ({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}

exports.formatResponseUserUpdateData = (params) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let result = {};
        if (params.success) {
            result = {
                "status": 200,
                "success": true,
                "message": "Updated successfully",
                "data": params.data
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        } else if (!params.success) {
            result = {
                "status": params.status,
                "success": false,
                "message": params.message,
                "data": params
            };
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
        }
        return (result);
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        next({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}

exports.validateUserDelete = (req, next) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    try {
        let data = req.body;
        const schemas = Joi.object({
            id: Joi.array().min(1).required(),
        });
        const validation = schemas.validate(data);
        if (validation.error) {
            logger.error(`*** ${validation.error.details[0].message} in %s of %s ***`, getName().functionName, getName().fileName);
            return ({ "status": 400, "success": false, "message": validation.error.details[0].message });
        } else {
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
            return ({ "status": 200, "success": true, "data": data });
        }
    } catch (err) {
        logger.error("*** Error in %s of %s ***", getName().functionName, getName().fileName);
        logger.error(err.message || JSON.stringify(err));
        next({ "status": 500, "success": false, "message": "Something went wrong" });
    }
}
exports.formatResponseUserDeleteData = (params) => {
    logger.info("*** Starting %s of %s ***", getName().functionName, getName().fileName);
    let result = {};
    if (params.success) {
        result = {
            "status": 200,
            "success": true,
            "data": params.data
        };
        logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
    } else {
        result = {
            "status": params.status,
            "success": false,
            "data": params.data
        };
        logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
    }
    return (result);
}