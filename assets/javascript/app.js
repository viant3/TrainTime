var firebaseConfig = {
  apiKey: "AIzaSyB6BwLC29vltmzlgHeUBhUanbJItYDCU28",
  authDomain: "ucfproject-e5e10.firebaseapp.com",
  databaseURL: "https://ucfproject-e5e10.firebaseio.com",
  projectId: "ucfproject-e5e10",
  storageBucket: "",
  messagingSenderId: "250182964803",
  appId: "1:250182964803:web:4aecaa2d94805105"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
// Initial Values
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";


// Capture Button Click
$("#add-user").on("click", function (event) {
  event.preventDefault();

  // Grabbed values from text-boxes
  trainName = $("#train-text").val().trim();
  destination = $("#dest-text").val().trim();
  firstTrain = $("#firstTrain-text").val().trim();
  frequency = $("#freq-text").val().trim();
 

  // Code for "Setting values in the database"
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(newTrain);

  $(".mainForm")[0].reset();

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function (snapshot) {

  var tr = $("<tr>");

  
        // Chang year so first train comes before now
        var firstTrainNew = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % snapshot.val().frequency;
        // Minutes until next train
        var minAway = snapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm");

  // Change the HTML to reflect
  var tdtrainName = $("<td>").text(snapshot.val().trainName);
  var tddestination = $("<td>").text(snapshot.val().destination);
  var tdfrequency = $("<td>").text(snapshot.val().frequency);
  var tdnextArrival = $("<td>").text(nextTrain);
  var tdminAway = $("<td>").text(minAway);


  tr.append(tdtrainName).append(tddestination).append(tdfrequency).append(tdnextArrival).append(tdminAway);

  $(".trainData").append(tr);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);

});
