const
    path = require('path'),
    argon2 = require( 'argon2' ),
    hpp = require('hpp'),
    cors = require('cors'),
    url= require('url'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(
        [ 
         cors(),
         bodyParser.urlencoded({extended: false}),
         hpp()
        ]
)
app.disable( 'x-powered-by' )

app.set('view engine' , 'pug')
app.set('views' , path.join( __dirname, 'views' ) )

app.get( '/', ( req, res ) => {
    
    const
        { query: { word, hash }} = req;
    console.log( word, hash )
    res.render( 'index', { 
                          word: JSON.parse( word ),
                          hash: JSON.parse( hash )
                         }
    )
})

app.post( '/generate', async ( req, res, next ) => {

    const
        { body: { word, aType }} = req,
        
        hash = await argon2.hash( word, { type: aType || argon2.argon2id } )
                       
                       .then( hash => {
                            const
                                splitted = hash.split(','),
                                version = splitted[0].split('$'),
                                
                                versionName  = version[1],
                                versionNumber= version[2].substr(2),
                                memoryUsage  = version[3].substr(2),
                                
                                iterations   = splitted[1].substr(2),
                                
                                generatedHash= splitted[2].substr(2);
                            
                            return  JSON.stringify({
                                                    versionName,
                                                    versionNumber,
                                                    memoryUsage,
                                                    iterations,
                                                    generatedHash
                                                  })
                        })
                       .catch( error => { error: `Can't hash using ${aType}` } );
    
    res.redirect( 
        url.format({
            pathname: '/',
            query: { 
                    word: JSON.stringify( word ),
                    hash
                } 
          })
    )
    
    next();
})
app.get('*', ( req, res, next ) => res.redirect('/') )
app.listen( 8080, 'localhost', ()=> console.log( 'listen on localhost:8080'))