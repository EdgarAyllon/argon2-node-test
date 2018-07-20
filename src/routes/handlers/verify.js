const
    argon2 = require('argon2'),
    format = require('../../helpers/formats');

module.exports = async (req, res) => {

    let
        { body: { expectedPassword, expectedHash } } = req,
        errorFields,
        verification;

    if (!expectedPassword || !expectedHash)
        
        errorFields = 'Both fields must be filled'

    else if (!format.argon2.test(expectedHash))
        
        errorFields = 'Incorrect Hash, check format and try again'

    else 
        verification = await argon2.verify(expectedHash, expectedPassword)

                                   .then(match => match)

                                   .catch(error => ({ errorOnProcess: error.message }));

    res.render('index', { errorFields, expectedPassword, expectedHash, verification })
}