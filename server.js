// simple HTTP server using TCP sockets
var net = require('net');
var fs = require('fs');
var server = net.createServer(function(socket) {

    socket.on('data', function(data) {
        
        console.log('Received Data: \n' + data);
        
        r = data.toString();
        if(r.substring(0,3)=="GET") 
        {
            socket.write("HTTP/1.1 200 OK\n");
            socket.write("");

            fs.readFile('data.json', 'utf8', function(err, contents) {
                socket.write("Access-Control-Allow-Origin: *");

                socket.write("\n\n");
                var parsedData = JSON.parse(contents); //Reading JSON File contents and parsing it into JSON
                
                //socket.write(parsedData.readings[(parsedData.readings.length-1)]); //Getting the last reading from the JSON file and writing it to the client

                dataKey = Object.keys(parsedData.readings[(parsedData.readings.length-1)]); //Getting key of the object

                var dataObject = parsedData.readings[(parsedData.readings.length-1)][dataKey]; //Getting the object itself
                var currentPos = dataObject[0].currentPos //object is an array
                var destinationPos = dataObject[0].destinationPos;

                
                console.log(angleFromCoordinate(currentPos,destinationPos));
                socket.write(angleFromCoordinate(currentPos,destinationPos) + " ");
                socket.destroy();
            })
        }

        if(r.substring(0,4) == "POST")
        {
            socket.write("HTTP/1.1 200 OK\n");
            socket.end();
            console.log("\n\n\n");

            dataString = data.toString();
            
            var newData = dataToJSON(decodeURI(dataString.substring(dataString.search("currentPos"))));
            


            fs.readFile('data.json', 'utf8', function(err, contents) {
                var parsedData = JSON.parse(contents);

                var dataObj = {};
                var dataKey = randomHex(); //generates Random Hex and uses that as a key for the JSON object 
                dataObj[dataKey] =[]; 
                dataObj[dataKey].push(newData);

                var parsedData = JSON.parse(contents);
                
                parsedData.readings.push(dataObj);


                fs.writeFile('data.json', JSON.stringify(parsedData,null,2), (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });
            })
        }

    });
    socket.on('close', function() {
        console.log('Connection closed');
    });
    socket.on('end', function() {
        console.log('client disconnected');
     });

    socket.on('error', function() {
        console.log('client disconnected');
     });
});
server.listen(3000, function() {
    console.log('server is listening on port 3000');
});

function randomHex() {
    var howManyDigits = 5
    var howManyResuls = 1

    var str = '';
    for (var i = 0; i < howManyResuls; i++) {
        var res = '';
        for (var j = 0; j < howManyDigits; j++) {
            var randByte = parseInt(Math.random() * 16, 10).toString(16);
            res += randByte;
        }
        str += res;
    }
    return str;
}

function dataToJSON(str)
{
    var lat1,lng1,lat2,lng2;
    lat1 = str.substring(str.search("=")+1,str.search("&"));
    str = str.slice(str.search("&")+1);
    lng1 = str.substring(str.search("=")+1,str.search("&"));
    str = str.slice(str.search("&")+1);
    lat2 = str.substring(str.search("=")+1,str.search("&"));
    str = str.slice(str.search("&")+1);
    lng2 = str.substring(str.search("=")+1);

    var dataJSON = 
    {
        currentPos:{lat:lat1,lng:lng1},
        destinationPos:{lat:lat2,lng:lng2}
    }
    return dataJSON;
}

function angleFromCoordinate(current, destination) {

    // angle in degrees
    var angleDeg = Math.atan2(destination.lng - current.lng, destination.lat - current.lat) * 180 / Math.PI;
    angleDeg = (angleDeg + 360) % 360;

    //document.getElementById('rotation').innerHTML ="Rotation : "+ angleDeg;
    return angleDeg;
}