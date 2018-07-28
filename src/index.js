require('dotenv').config()

const
    path = require('path'),
    hpp = require('hpp'),
    cors = require('cors'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    PORT = process.env.PORT || 8080,
    HOST = process.env.HOST || 'localhost';

// Settings
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

// Routes
app.use('/', routes )

app.listen( PORT, HOST )