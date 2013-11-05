// var CONNECTION_IP = '127.0.0.1',
var CONNECTION_IP = 'challenge.hacktivate.me',
	CONNECTION_PORT = 3000,
	CONNECTION_URL = "http://"+ CONNECTION_IP + ":" + CONNECTION_PORT;

var PATH = [{x:200,y:800},{x:200,y:600},{x:200,y:450},{x:200,y:150},{x:500,y:200},{x:0,y:0,runway:true},{x:550,y:800},{x:750,y:700},{x:750,y:600},{x:750,y:450},{x:600,y:200},{x:0,y:0, runway:true},{x:550,y:800}];

var init = false;

var TOLERANCE = 10;

var RUNWAY_X, RUNWAY_Y;

var request = require('request');
var spawn = require('child_process').spawn;


directPlanes = function(token) {
	request(CONNECTION_URL +"/get?token=" + token, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  
	  	  	var body = JSON.parse(body);
	  	  	var planes = body.objects;

	  	  	if(!init) {
	  	  		var runway = body.runway;

	  	  		RUNWAY_X = runway.x;
	  	  		RUNWAY_Y = runway.y;

	  	  		console.log("RWX: "+ RUNWAY_X);
	  	  		console.log("RWY: "+ RUNWAY_Y);


	  	  		var offset_x = body.boundary.min.x;
	  	  		var offset_y = body.boundary.min.y;
	  	  		PATH.forEach(function(element,index,array) {
	  	  			element.x += offset_x;
	  	  			element.y += offset_y;
	  	  			if(element.runway) {
	  	  				element.x = runway.x,
	  	  				element.y = runway.y 
	  	  			}

	  	  		});
	  	  		init = true;
	  	  	}

	  	  	var directions = [];
	  
	  	  	planes.forEach(function(plane,index,array){
	  	  		thisWaypoint =  wayfind(plane.position, plane.waypoint);
	  	  		if (thisWaypoint) {
		  	  		directions.push({
		  	  			plane_id: "" + plane.id,
		  	  			waypoint: thisWaypoint
		  	  		});
		  	  	}
	  	  	});

	  	  	console.log(JSON.stringify(directions));
	  
	  	  	var thisRequest = {
	  	  		directions: directions,
	  	  		token: token
	  	  	};

	  	  	if(directions.length > 0) {
		  	  	request.post(CONNECTION_URL +"/post", {json: thisRequest});
		  	}

   			setTimeout(directPlanes(token),1);

		  }
	});
};

wayfind = function (position, waypoint) {

	if (!waypoint) {
		return newWaypoint(position);
	}

	return findWaypoint(position, waypoint);

}

newWaypoint = function (position) {
	var thisX = position.x,
		thisY = position.y,
		LOWEST_X = 10000,
		LOWEST_Y = 10000,
		newX,newY;

	PATH.forEach(function(element,index,array) {
		if (Math.abs(element.x - position.x) < LOWEST_X && Math.abs(element.y - position.y) < LOWEST_Y ) {
			newX = array[index].x;
			newY = array[index].y;

			LOWEST_X = Math.abs(element.x - position.x);
			LOWEST_Y = Math.abs(element.y - position.y);
		}
	});

	return {
		x: newX,
		y: newY
	}

}



findWaypoint = function (position, waypoint) {
	var thisX = position.x,
		thisY = position.y,
		newX,newY;

	PATH.forEach(function(element,index,array) {
		if (Math.abs(element.x - position.x) < TOLERANCE && Math.abs(element.y - position.y) < TOLERANCE ) {
			if (index === PATH.length-1) {
				index = -1;
			}

			newX = array[index+1].x;
			newY = array[index+1].y;

			return false;
		}
	});

	if(!newX) {
		return false;
	}


	return {
		x: newX,
		y: newY
	}
}


//normalisation
nX = function (x) {return x + X_OFFSET;}
nY = function (y) {return y + Y_OFFSET;}

// request(CONNECTION_URL +"/new-session", function (error, response, body) {
  // if (!error && response.statusCode == 200) {
	
  	// var token = JSON.parse(body).token;
  	// var token = "07a124720442"
  	var token = process.argv[2];
	spawn('open', [CONNECTION_URL + "/view?token=" +token]);
   	
   	directPlanes(token);
  // }
// });