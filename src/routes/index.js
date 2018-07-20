const
    { Router } = require('express'),
    router = Router(),
    { generate, verify } = require('./handlers')

router.get( '/', ( req, res ) => res.render( 'index' ))

router.post('/generate', generate )

router.post('/verify', verify )

router.post('*', ( req, res ) => res.redirect('/')  )

router.get('*', ( req, res ) => res.redirect('/')  )

module.exports = router