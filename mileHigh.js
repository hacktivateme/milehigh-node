/*

77777777777777777777777777777777
77777777777777777777777777777777
777777     7777777777     777777
777777     7777777777     777777
777777     7777777777     777777
777777     7777777777     777777
777777     7777777777     777777
77777777777777777777777777777777
777                          777
777                          777
777                          777
777                          777
777                          777
777                          777
777      77777777   7777777  777
777      77777777   7777777  777
777      77777777   7777777  777
777      77777777   7777777  777
777                          777
777                          777
777        777777777777777777777
777         77777777777777777777
777                          777
777                          777
77777777777777777777777777777777
77777777777777777777777777777777

Hacktivate MILE HIGH
mileHigh.js
by @samhogg - http://www.samhogg.com

RELEASED UNDER MIT LICENSE.

Have fun ;)

*/

var CONNECTION_URL = "http://challenge.hacktivate.me:3000",
    request = require('request'),
    async = require('async'),
    spawn = require('child_process').spawn;

var mileHigh = function(token) {
    async.forever(
        function (callback) {
            request(CONNECTION_URL +"/get?token=" + token, function (error, response, body) {
              if (!error && response.statusCode == 200) {

                // Parse the response body
                var getData = JSON.parse(body);

                // You might want to put something in here to send to the server ;)
                var postData = {};

                // For now, we'll just log the response
                console.log(body);

                // Sending our data to the server
                request.post(CONNECTION_URL +"/post", {json: postData});

              } else {
                // Ooopsie
                console.log("ERROR: " + error);
              }
            });

            // By all means, tweak this timeout. No guarantees on how fast your requests will be though :)
            setTimeout(callback, 50);
        },

        // An error happened somewhere in async.forever
        function (err) {
            console.log("There was an error. Oops. Here it is: " + err);
        }
    );
}

var initialiseMileHigh = function() {

    // If we give mileHigh a token, it will connect to that. 
    // If you give it a malformed token, it will probably die. 
    // And when I say probably, it will die. Watch out for that one.
    if(process.argv[2]) {
        
        //Mac OS Specific. Feel free to remove if not helpful for you :)
        spawn('open', [CONNECTION_URL + "/view3d?token=" + process.argv[2]]);
        mileHigh(process.argv[2]);
    
    // Otherwise, create a new 'practice' session
    } else {
        request(CONNECTION_URL +"/new-session", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            
            var token = JSON.parse(body).token;

            //Mac OS Specific. Feel free to remove if not helpful for you :)
            spawn('open', [CONNECTION_URL + "/view?token=" +token]);
            mileHigh(token);
          } else {
            console.log("ERROR: " + error);
          }
        });
    }
};

var mileHighInstance = new initialiseMileHigh();
