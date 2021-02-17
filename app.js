const express = require("express");
const moment = require('moment');  
const app = express()
    ,bodyParser = require('body-parser')
app.use(bodyParser.json());
var pointArray = []
// routes

app.get("/addPoints", async (req,res) => {
    var points = req.body.points
    var company = req.body.company
    var date = req.body.date
    for(i=0; i <pointArray.length; i++)
        {
            var point = pointArray[i]
            if(point.company === company)
            {
                
                pointArray[i].points += points;
                pointArray[i].date = date; 
                res.send(pointArray)
                return;
            }
        }
        var temp = new Object();
        temp['company'] =  company,
        temp['points'] =  points,
        temp['date'] = date
        pointArray.push(temp)
        res.send(pointArray)
        return;
    });

    app.get("/deletePoints", (req,res) => {
        var points = req.body.points;
        var returnDoc = []
        var total = 0
        for(i=0; i<pointArray.length; i++){
            total = total + pointArray[i].points
            }
        if (total < points){
            res.send('Not enough points')
            return;
        }
        while(points > 0){
          var minDate = '3000-10-31T00:00:00+00:00';
          for(i=0; i<pointArray.length; i++){
                if(pointArray[i].points > 0 && pointArray[i].date < minDate){
                    minDate = pointArray[i].date
                }
            }
            var object = pointArray.findIndex(obj => obj["date"] === minDate)
            if(pointArray[object].points >= points){
                pointArray[object].points =  pointArray[object].points - points
                var temp = {
                "company": pointArray[object].company,
                "points" : "-"+ points,
                "date" : "now"
                }
                points = 0
                returnDoc.push(temp)
            }
            else if(pointArray[object].points < points){
              var temp = {
                "company": pointArray[object].company,
                "points" : "-"+ pointArray[object].points,
                "date" : "now"
                }
              returnDoc.push(temp)
              points = points - pointArray[object].points
              pointArray[object].points = 0
            
        }
      }
    res.send(returnDoc)
});

app.get("/points", (req,res) => {
    res.send(pointArray)
})


// server started
const port =process.env.PORT || 3000;
app.listen(port,() => {
    console.log("server started at port 3000");
});