var express = require('express');
var app = express();
// jsonwebtoken is required for you to generate and sign the OpenID Connect Token
// You can read more about this module here: https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');
/*	
	You will need to generate your own public and private RSA keys using OpenSSL. These keys can then be placed in the files below.
	Page 19 of this pdf: https://ce-sr.s3.amazonaws.com/Auth%20Chat/Authenticated%20Interactions%20with%20oAuth%202.0v.pdf shows
	how you can generate these keys.
*/
var fs = require('fs');
var cert_pub = fs.readFileSync(__dirname + '/rsa-public-key.pem');
var cert_priv = fs.readFileSync(__dirname + '/rsa-private.pem');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// render the index page
app.get('/', function(request, response) {
  response.render('pages/index');
});

// used to generat the OpenID Connect Token
app.post('/token', function(request, response) {
	// generate our token with the appropiate information and sign it with our private RSA key.
	var token = jwt.sign({ "iss": "https://enigmatic-shelf-93460.herokuapp.com/","sub": "4255551212" }, cert_priv, { algorithm: 'RS256', expiresIn: '1h'});
    console.log(token);
    // verify that the token was generated correctly
    jwt.verify(token, cert_pub, function(err, decoded) {
    	// if the token didn't generate then respond with the error
    	if(err){
    		console.log(err);
    		response.json({
                "error": err,
                "Fail": "404"
            });
    	}
    	// if successful then response with the token
    	else {
    		console.log(decoded);
    		response.json({
                "decoded": decoded,
                "token": token
            });
    	}
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

