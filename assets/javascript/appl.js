// Global Variables
var trainName = '';
var trainDestination = '';
var trainTime = 0;
var trainFrequency = 0;
var nextArrival = 0;
var minutesAway = 0;

// jQuery global variables
var inTrain = $('#train-name');
var inTrainDestination = $('#train-destination');
// form validation for Time using jQuery Mask plugin
var inTrainTime = $('#train-time').mask('00:00');
var inTimeFreq = $('#time-freq').mask('00');

// Initialize Firebase
var config = {
	apiKey: 'AIzaSyAAJbTKziqgyPDRpFa4-hsa2zHvuOrUz54',
	authDomain: 'ftrain-1200b.firebaseapp.com',
	databaseURL: 'https://ftrain-1200b.firebaseio.com',
	projectId: 'ftrain-1200b',
	storageBucket: 'ftrain-1200b.appspot.com',
	messagingSenderId: '1070787120169'
};

firebase.initializeApp(config);

// Assign the reference
var database = firebase.database();

database.ref('/trains').on('child_added', function(snapshot) {
	//  create local variables to store the data from firebase
	var trainDiff = 0;
	var trainRemainder = 0;
	var minutesTillArrival = 0;
	var nextTrainTime = 0;
	var frequency = snapshot.val().frequency;

	// compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
	trainDiff = moment().diff(moment.unix(snapshot.val().time), 'minutes');

	// get the remainder of time by using 'moderator' with the frequency & time difference, store in var
	trainRemainder = trainDiff % parseInt(frequency);

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
});

// Delete ** not working **
$('#table-data').on('click', 'tr span', function(snapshot) {
	console.log(this);
	var trainRef = database.ref('/trains/');
	console.log(trainRef);
	trainRef.child(key).remove();
});

// function to call the button event, and store the values in the input form
var storeData = function(event) {
	// prevent from from reseting
	event.preventDefault();

	// get & store input values
	trainName = inTrain.val().trim();
	trainDestination = inTrainDestination.val().trim();
	trainTime = moment(inTrainTime.val().trim(), 'HH:mm').subtract(1, 'years').format('X');
	trainFrequency = inTimeFreq.val().trim();

	// add to firebase databse
	database.ref('/trains').push({
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
		date_added: firebase.database.ServerValue.TIMESTAMP
	});

	//  alert that train was added
	alert('Train schedule entry added!');

	//  empty form once submitted
	inTrain.val('');
	inTrainDestination.val('');
	inTrainTime.val('');
	inTimeFreq.val('');
};

// Calls storeData function if submit button clicked
$('#btn-add').on('click', function(event) {
	// form validation - if empty - alert
	if (
		inTrain.val().length === 0 ||
		inTrainDestination.val().length === 0 ||
		inTrainTime.val().length === 0 ||
		inTimeFreq === 0
	) {
		alert('Please Fill All Required Fields');
	} else {
		// if form is filled out, run function
		storeData(event);
	}
});

// Calls storeData function if enter key is clicked
$('form').on('keypress', function(event) {
	if (event.which === 13) {
		// form validation - if empty - alert
		if (
			inTrain.val().length === 0 ||
			inTrainDestination.val().length === 0 ||
			inTrainTime.val().length === 0 ||
			inTimeFreq === 0
		) {
			alert('Please enter data in all Fields');
		} else {
			// if form is filled out, run function
			storeData(event);
		}
	}
});
