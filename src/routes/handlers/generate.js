const
    argon2 = require( 'argon2' );

module.exports = async ( req, res ) => {
    
    let
        { body: { word, versionName, hashLength, timeCost, parallelism }} = req,
        hash,
        wordError,
        memoryCost = 4096;

    if( !word.trim().length ) 
        
        wordError = 'Word/phrase can\'t be empty'

    else 
        hash = await argon2.hash( word, {
                                          timeCost: timeCost || 3,
                                          hashLength: hashLength || 32,
                                          memoryCost,
                                          parallelism: parallelism || 2,
                                          type: argon2[versionName],
                                          }
                            )
                            .then( hash => {
                                    const
                                        versionNumber = hash.split(',')[0].split('$')[2].substr(2);

                                    return  {
                                            versionName,
                                            versionNumber,
                                            hashLength,
                                            memoryCost,
                                            timeCost,
                                            parallelism,
                                            fullHash: hash
                                            }
                            })
                            .catch( error => ( { error: error.message } , res) );

    res.render('index', { wordError, word, hash } )
}