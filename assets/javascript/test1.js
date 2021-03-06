////////////////////////////////////////////////////////
////////////////////  TRAIN        ////////////////////
///////////////////      SCHEDULE ////////////////////
/////////////////////////////////////////////////////

// Global Variables
var trainName = '';
var trainDestination = '';
var trainTime = '';
var trainFrequency = '';
var trainNextArrival = '';
var trainMinutesAway = '';

// jQuery global variables
var inValTrain = $('#train-name');
var inValTrainDestination = $('#train-destination');
// form validation for Time using jQuery Mask plugin
var inValTrainTime = $('#train-time').mask('00:00');
var inFrequency = $('#time-freq').mask('00');

// Initialize Firebase
var config = {
	apiKey: 'AIzaSyDRc8WHqEiPmt5eZgB_HxRygGA31dqHKPg',
	authDomain: 'train-schedule-bd950.firebaseapp.com',
	databaseURL: 'https://train-schedule-bd950.firebaseio.com',
	projectId: 'train-schedule-bd950',
	storageBucket: 'train-schedule-bd950.appspot.com',
	messagingSenderId: '236709814864'
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref('/trains').on('child_added', function(snapshot) {
	//  create local variables to store the data from firebase
	var trainDiff = 0;
	var trainRemainder = 0;
	var minutesTillArrival = '';
	var nextTrainTime = '';
	var frequency = snapshot.val().frequency;

	// compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
	trainDiff = moment().diff(moment.unix(snapshot.val().time), 'minutes');

	// get the remainder of time by using 'moderator' with the frequency & time difference, store in var
	trainRemainder = trainDiff % frequency;

	// subtract the remainder from the frequency, store in var
	minutesTillArrival = frequency - trainRemainder;

	// add minutesTillArrival to now, to find next train & convert to standard time format
	nextTrainTime = moment().add(minutesTillArrival, 'm').format('hh:mm A');

	// append to our table of trains, inside tbody, with a new row of the train data
	$('#table-data').append(
		'<tr><td>' +
			snapshot.val().name +
			'</td>' +
			'<td>' +
			snapshot.val().destination +
			'</td>' +
			'<td>' +
			frequency +
			'</td>' +
			'<td>' +
			minutesTillArrival +
			'</td>' +
			'<td>' +
			nextTrainTime +
			'  ' +
			"<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" +
			'</td></tr>'
	);

	$('span').hide();

	// Hover view of delete button
	$('tr').hover(
		function() {
			$(this).find('span').show();
		},
		function() {
			$(this).find('span').hide();
		}
	);

	// STARTED BONUS TO REMOVE ITEMS ** not finished **
	$('#table-data').on('click', 'tr span', function() {
		console.log(this);
		var trainRef = database.ref('/trains/');
		console.log(trainRef);
	});
});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
	// prevent from from reseting
	event.preventDefault();

	// get & store input values
	trainName = inValTrain.val().trim();
	trainDestination = inValTrainDestination.val().trim();
	trainTime = moment(inValTrainTime.val().trim(), 'HH:mm').subtract(1, 'years').format('X');
	trainFrequency = inFrequency.val().trim();

	// add to firebase databse
	database.ref('/trains').push({
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency,
		trainNextArrival: trainNextArrival,
		trainMinutesAway: trainMinutesAway,
		date_added: firebase.database.ServerValue.TIMESTAMP
	});

	//  alert that train was added
	alert('Train successuflly added!');

	//  empty form once submitted
	inValTrain.val('');
	inValTrainDestination.val('');
	inValTrainTime.val('');
	inFrequency.val('');
};

// Calls storeInputs function if submit button clicked
$('#btn-add').on('click', function(event) {
	// form validation - if empty - alert
	if (
		inValTrain.val().length === 0 ||
		inValTrainDestination.val().length === 0 ||
		inValTrainTime.val().length === 0 ||
		inFrequency === 0
	) {
		alert('Please Fill All Required Fields');
	} else {
		// if form is filled out, run function
		storeInputs(event);
	}
});

// Calls storeInputs function if enter key is clicked
$('form').on('keypress', function(event) {
	if (event.which === 13) {
		// form validation - if empty - alert
		if (
			inValTrain.val().length === 0 ||
			inValTrainDestination.val().length === 0 ||
			inValTrainTime.val().length === 0 ||
			inFrequency === 0
		) {
			alert('Please Fill All Required Fields');
		} else {
			// if form is filled out, run function
			storeInputs(event);
		}
	}
});
