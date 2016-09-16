var Profile = require('./profile.js');
var renderer = require('./renderer.js');
var queryString = require('querystring');


function home(request, response) {
    
    if(request.url === '/'){
        if (request.method.toLowerCase() === 'get') {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            renderer.view('header', {}, response);
            renderer.view('search', {}, response);
            renderer.view('footer', {}, response);
            response.end();
        } else {
           request.on('data', function(postBody) {
                var query = queryString.parse(postBody.toString());
                response.writeHead(303, {"Location": "/" + query.username});
                response.end();
           }); 
        }
   
    }
}

function user(request, response) {
    var userName = request.url.replace("/", "");
    if (userName.length > 0) {
        renderer.view('header', {}, response);
        var studentProfile = new Profile(userName);
        studentProfile.on('end', function(profileJSON){
            var values = {
                avatarURL: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                jsPoints: profileJSON.points.JavaScript
            }
            renderer.view('profile', values, response);
            renderer.view('footer', {}, response);
            response.end();

        });
        studentProfile.on('error', function(error) {
            renderer.view('error', {errorMessage: error.message}, response);          
            renderer.view('search', {}, response);
            renderer.view('footer', {}, response);
            response.end();
            
        })
        
       
    }
}

module.exports.home = home;
module.exports.user = user;