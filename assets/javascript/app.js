// Initialize Firebase
var config = {
	apiKey: "AIzaSyClfm3mcUdQX-gQ__EznxjOCHYj0udiMls",
	authDomain: "trainscheduler-32bc8.firebaseapp.com",
	databaseURL: "https://trainscheduler-32bc8.firebaseio.com",
	storageBucket: "trainscheduler-32bc8.appspot.com",
	messagingSenderId: "1098626858239"
};

firebase.initializeApp(config);

var database = firebase.database();

$('#addTrainBtn').on('click', function(){

	//Grabs User Input
	var trainName = $("#trainName").val().trim();
	var trainDestination = $("#destination").val().trim();
	var firstTrainTime = $("#firstTrainTime").val().trim();
	var trainFrequency = $("#frequency").val().trim();

	//Local temp objects to hold data
	var newTrain = {
		name: trainName,
    	destination: trainDestination,
    	firstTrain: firstTrainTime,
    	frequency: trainFrequency
	}

	//upload train data to the database
	database.ref().push(newTrain);

	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.firstTrain);
	console.log(newTrain.frequency);

	//Alert
	alert("New Train Successfully Added!")

		


	//Clear the textboxes
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTrainTime").val("");
	$("#frequency").val("");

	//prevent from reloading the page
	return false;
});

database.ref().on("child_added", function(childSnapshot, preveChildKey){

	console.log(childSnapshot.val());

	//Store value
	var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

	// Minute Until Train
    var minAway = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);


    // Next Train
    var nextTrain = moment().add(minAway, "minutes");
    var nextTrain = moment(nextTrain).format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));


    //Add train data to the table
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minAway + "</td></tr>");
});


