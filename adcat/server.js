const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const Client = require('node-rest-client').Client;
const moment = require('moment');
var client = new Client();

app.use(bodyParser.json());

app.get('/', (req,res) => {
	res.sendFile(__dirname+"/index.html");
});

app.post('/insertjson',(req,res) => {
    var jsoninp = req.body;
    var age,relation_status,education,work,place;
    //console.log(jsoninp);
   if(jsoninp.hasOwnProperty('birthday')){
        age = moment().year()-moment(jsoninp.birthday,"MM/DD/YYYY").year()
        age=age.toString();
    }
    
    if(jsoninp.hasOwnProperty('relationship_status')){
        relation_status = jsoninp.relationship_status;
        //console.log(relation_status);
    }

    if(jsoninp.hasOwnProperty('education')){
        education = jsoninp.education[jsoninp.education.length-1].type;
        //console.log(education);
    }

    if(jsoninp.hasOwnProperty('work')){
        if(jsoninp.work[0].hasOwnProperty('position'))
            work = jsoninp.work[0].position.name;
        place = jsoninp.work[0].location.name;
        //console.log(work);
    }
    
    var args = {
        data: {
                "type": "select",
                "args": {
                    "table": "Users",
                    "columns": [
                        "user_id"
                    ],
                    "where": {
                        "user_id": {
                            "$eq": jsoninp.id
                        }
                    }
                }
        },
        headers: { "Content-Type": "application/json"} }
        client.post("https://data.appellation60.hasura-app.io/v1/query", args, function (data, response) {
            console.log(data)
            if(data.length==0){
                console.log('insert')
                var args = {
                    data: {
                        "type": "insert",
                        "args": {
                            "table": "Users",
                            "objects": [{
                                "user_id":jsoninp.id,                    
                                "jsoninp":jsoninp,
                                "age":age,
                                "relation_status":relation_status,
                                "education":education,
                                "work":work,
                                place:place
                            }]
                        }
                    },
                    headers: { "Content-Type": "application/json"} }
                client.post("https://data.appellation60.hasura-app.io/v1/query", args, function (data, response) {
            
                    });
            }
            else {
                console.log('update')
                var args = {
                    data: {
                        
                            "type": "update",
                            "args": {
                                "table": "Users",
                                "where": {
                                    "user_id": {
                                        "$eq": jsoninp.id
                                    }
                                },
                                "$set": {"jsoninp":jsoninp,
                                "age":age,
                                "relation_status":relation_status,
                                "education":education,
                                "work":work,
                                place:place}
                            }
                        
                    },
                    headers: { "Content-Type": "application/json"} }
                client.post("https://data.appellation60.hasura-app.io/v1/query", args, function (data, response) {
            
                    });
            }
		});

   /*var args = {
        data: {
            "type": "insert",
            "args": {
                "table": "Users",
                "objects": [{
                    "user_id":jsoninp.id,                    
                    "jsoninp":jsoninp,
                    "age":age,
                    "relation_status":relation_status,
                    "education":education,
                    "work":work,
                    place:place
                }]
            }
        },
        headers: { "Content-Type": "application/json"} }
    client.post("https://data.appellation60.hasura-app.io/v1/query", args, function (data, response) {

		});*/
    res.send('ok');
})

app.get('/css/:fileName', (req, res) => {
	res.sendFile(__dirname+'/css/'+req.params.fileName);
});

app.get('/main.js', (req,res) => {
	res.sendFile(__dirname+"/main.js");
});

var port = process.env.PORT || 8080;

http.listen(port, () => {
	console.log("working on port "+port);
});
