var express = require("express");
var router = express.Router();
var riders = [{ name: "a", location: [10, 20] }];
var drivers = [
  {
    name: "b",
    location: [10, 15],
    visibility: true,
    locked: false,
    lockedwith: {},
  },
];
var threshold = 7.5;

//post method - registers rider
router.post("/rider", function (req, res, next) {
  var riderObj = req.body;
  riders.push(riderObj);
  res.send(riders);
});

//post method - registers driver
router.post("/driver", function (req, res, next) {
  var driverobj = req.body;
  drivers.push(driverobj);
  res.send(drivers);
});

//get method - gives threshold value
router.get("/", function (req, res, next) {
  res.send("Threshold: " + threshold);
});

//function distance - retrieves distance between two locations
var distance = function (a, b) {
  return (
    Math.round(
      Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)) * 100
    ) / 100
  );
};

//getting cabs based on rider id
router.get("/getcabs/:id", function (req, res, next) {
  var riderid = req.params["id"];
  var riderobj = {};
  for (let i of riders) {
    if (riderid == i.name) {
      riderobj = i;
      break;
    }
  }

  //we can directly give in line 24 also
  var rider_location = riderobj.location;

  //basic simple logic with more time complexity
  var cabs = [];
  var nearest_cab = {},
    nearest_cab_dist = threshold;
  for (let i of drivers) {
    let dist = distance(rider_location, i.location);
    if (dist <= threshold && i.visibility == true && i.locked == false) {
      cabs.push(i);
      if (dist < nearest_cab_dist) {
        nearest_cab = i;
        nearest_cab_dist = dist;
      }
    }
  }
  if (cabs.length > 0) {
    for (let i of drivers) {
      if (i.name == nearest_cab.name) {
        i.locked = true;
        i.lockedwith = riderobj;
        res.send(i);
      }
    }
  } else {
    res.send("No Cabs Found Near You!!!");
  }
});

module.exports = router;
