const {
    validateUserDetailsCreate,
    formatResponseUserDetailsCreateData,
    validateUserDetailsListData,
    formatResponseUserDetailsListData,
    validateUserDetailsUpdateData,
    formatResponseUserDetailsUpdateData,
    validateUserDetailsDelete,
    formatResponseUserDetailsDeleteData
} = require("../../helpers/userDetails/userDetailsHelper")
const {
    userDetailsData,
    userDetailsListData,
    userDetailsUpdateData,
    userDetailsDeleteData
} = require("../../models/queryModels/userDetails/userDetails");
const logger = require('../../../logger/logger');
const { getName } = require('../../../logger/logFunctionName');




exports.userDetailsCreateController = async (req, res, next) => {
    logger.info("* Starting %s of %s *", getName().functionName, getName().fileName);
    try {
        //const currentCognitoUserDetailsDetails = req.currentUserDetails;
        //let userDetailsParams = JSON.parse(currentCognitoUserDetailsDetails['custom:userDetails_details']);
        //let currentUserDetailsId = userDetailsParams.userDetails_id;
        let data = req.body;
        //let org_id = userDetailsParams.org_id;
        let isArray = Array.isArray(data);
        if (isArray) {
            if (data.length > 0) {
                let responseArr = [];
                data.forEach(async reqData => {

                    const validData = validateUserDetailsCreate(reqData, next);
                    logger.info("%s validparams got success response true: %s", getName().functionName, JSON.stringify(validData));
                    if (validData.success) {
                        let UserDetails = await userDetailsData(validData, next);
                        if (UserDetails) {
                            let responseData = formatResponseUserDetailsCreateData(UserDetails);
                            if (responseData.success == true) {
                                var responseTrue = {
                                    "success": responseData.success,
                                    "message": responseData.message,
                                    "data": responseData.data
                                }
                                responseArr.push(responseTrue);
                                if (responseArr.length == data.length) {
                                    logger.info("*** Ending %s of %s ***", getName().functionName, getName().fileName);
                                    res.send(responseArr);
                                }
                            } else if (responseData.success == false) {
                                var responseFalse = {
                                    "success": responseData.success,
                                    "message": responseData.message,
                                    "status": responseData.status,
                                }
                                responseArr.push(responseFalse);
                                if (responseArr.length == data.length) {
                                    logger.error("*** error %s of %s ***", getName().functionName, getName().fileName);
                                    res.status(responseData.status).send(responseArr);
                                }
                            }
                        }
                    } else {
                        var responseFalse = {
                            "success": validData.success,
                            "status": validData.status,
                            "message": validData.message
                        }
                        responseArr.push(responseFalse);
                        if (responseArr.length == data.length) {
                            logger.error("*** error %s of %s ***", getName().functionName, getName().fileName);
                            res.status(validData.status).send(responseArr);
                        }
                    }
                })
            } else {
                logger.error("No data avaliable in %s of %s ", getName().functionName, getName().fileName);
                next({ "status": 404, "success": false, "message": "No data avaliable" })
            }
        } else {
            logger.error("Provided data format is not proper in %s of %s ", getName().functionName, getName().fileName);
            next({ "status": 400, "success": false, "message": "provided data is not proper" })
        }
    } catch (err) {
        logger.error(`${err.message || JSON.stringify(err)} in %s of %s`, getName().functionName, getName().fileName);
        next({ message: "Something went wrong" });
        return;
    }
}

exports.userDetailsListController = async (req, res, next) => {
    logger.info("* Starting %s of %s *", getName().functionName, getName().fileName);
    try {
        // const currentCognitoUserDetailsDetails = req.currentUserDetails;
        //let userDetailsParams = JSON.parse(currentCognitoUserDetailsDetails['custom:userDetails_details']);
        //let currentUserDetailsId = userDetailsParams.userDetails_id;
        //let org_id = userDetailsParams.org_id;
        const validDatas = await validateUserDetailsListData(req, next);
        logger.info("%s validparams got success response true: %s", getName().functionName, JSON.stringify(validDatas));
        if (validDatas.success) {
            let UserDetailsData = await userDetailsListData(validDatas, next);
            if (UserDetailsData) {
                let responseData = await formatResponseUserDetailsListData(UserDetailsData);
                if (responseData.success) {
                    var response = {
                        "success": responseData.success,
                        "total": responseData.total,
                        "data": responseData.data
                    }
                    logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                    res.json(response);
                }
            }
        }
    } catch (error) {
        logger.error(`${error.message || JSON.stringify(error)} in %s of %s`, getName().functionName, getName().fileName);
        next({ message: "Something went wrong" });
        return;
    }
}

exports.userDetailsUpdateController = async (req, res, next) => {
    logger.info("* Starting %s of %s *", getName().functionName, getName().fileName);
    try {
        // let currentCognitoUserDetailsDetails = req.currentUserDetails;
        // let userDetailsParams = JSON.parse(currentCognitoUserDetailsDetails['custom:userDetails_details']);
        // let userDetails_id = userDetailsParams.userDetails_id;
        // let org_id = userDetailsParams.org_id;
        const validDatas = validateUserDetailsUpdateData(req, next);
        logger.info("%s validparams got success response true: %s", getName().functionName, JSON.stringify(validDatas));
        if (validDatas.success) {
            let UserDetailsData = await userDetailsUpdateData(validDatas, next);
            if (UserDetailsData) {
                let responseData = formatResponseUserDetailsUpdateData(UserDetailsData);
                if (responseData.success) {
                    var response = {
                        "success": responseData.success,
                        "total": responseData.total,
                        "data": responseData.data,
                        "message": responseData.message
                    }
                    logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                    res.json(response);
                } else {
                    var response = {
                        "success": responseData.success,
                        "message": responseData.message,
                        "status": responseData.status
                    }
                    logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                    res.status(responseData.status).json(response);
                }
            }
        } else {
            logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
            let responce = {
                "success": validDatas.success,
                "message": validDatas.message
            }
            res.status(validDatas.status).json(responce);
        }
    } catch (error) {
        logger.error(`${error.message || JSON.stringify(error)} in %s of %s`, getName().functionName, getName().fileName);
        next({ message: "Something went wrong" });
        return;
    }

}

exports.userDetailsDeleteController = async (req, res, next) => {
    try {
        logger.info("* Starting %s of %s *", getName().functionName, getName().fileName);
        // check if params are present
        const validDatas = validateUserDetailsDelete(req, next);
        logger.info("%s validparams got success response true: %s", getName().functionName, JSON.stringify(validDatas));
        if (validDatas) {
            let Data = await userDetailsDeleteData(validDatas, next);

            if (Data) {
                let responseData = formatResponseUserDetailsDeleteData(Data);

                if (responseData.success) {
                    var response = {
                        "success": responseData.success,
                        "message": responseData.message,
                        "data": responseData.data
                    }
                    logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                    res.send(response);
                } else {

                    var response = {
                        "success": responseData.success,
                        "message": responseData.message,
                        "data": responseData.data
                    }
                    logger.info("* Ending %s of %s *", getName().functionName, getName().fileName);
                    res.status(responseData.data[0].status).send(response);
                }
            }
        }
    } catch (err) {
        logger.error(`${err.message || JSON.stringify(err)} in %s of %s`, getName().functionName, getName().fileName);
        next({ message: "Something went wrong" });
        return;
    }
}