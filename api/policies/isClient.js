// isClient.js
module.exports = async function (req, res, proceed) {

    if (req.session.role == 'client') {
        return proceed();  //proceed to the next policy,
    }

    //otherwise, this request did not come from a logged-in user,
    return res.forbidden();

}