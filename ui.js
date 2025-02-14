configureLogging();

// Update all of the corresonding fields when switching protocol or playback mode
$('#protocol').change(function() {
    updateFieldsCorrespondingToStreamingProtocol();
});
$('#playbackMode').change(function() {
    updateFieldsCorrespondingToPlaybackMode();
});

// Read/Write all of the fields to/from localStorage so that fields are not lost on refresh.
[
    'protocol',
    'player',
    'region',
    'accessKeyId',
    'secretAccessKey',
    'sessionToken',
    'endpoint',
    'streamName',
    'playbackMode',
    'discontinuityMode',
    'displayFragmentTimestamp',
    'displayFragmentNumber',
    'startTimestamp',
    'endTimestamp',
    'fragmentSelectorType',
    'maxResults',
    'expires'
].forEach(function(field) {
    var id = "#" + field;

    // Read field from localStorage
    try {
        var localStorageValue = localStorage.getItem(field);
        if (localStorageValue) { 
            $(id).val(localStorageValue);
            $(id).trigger('change');
        }
    } catch (e) { /* Don't use localStorage */ }

    // Write field to localstorage on change event
    $(id).change(function() {
        try {
            localStorage.setItem(field, $(id).val());
        } catch (e) { /* Don't use localStorage */ }
    });
});

// Initially hide the player elements
$('.player').hide();

function configureLogging() {
    console._error = console.error;
    console.error = function(messages) {
        log('ERROR', Array.prototype.slice.call(arguments));
        console._error.apply(this, arguments);
    }

    console._log = console.log;
    console.log = function(messages) {
        log('INFO', Array.prototype.slice.call(arguments));
        console._log.apply(this, arguments);
    }

    function log(level, messages) {
        var text = '';
        for (message of messages) {
            if (typeof message === 'object') { message = JSON.stringify(message, null, 2); }
            text += ' ' + message;
        }
        $('#logs').append($('<div>').text('[' + level + ']' + text + '\n'));
    }
}

function updateFieldsCorrespondingToStreamingProtocol() {
    var isDASH = $('#protocol').val() === 'DASH';
    $('#containerFormat').prop('disabled', isDASH);
    $('#discontinuityMode').prop('disabled', isDASH);  
    $('#displayFragmentNumber').prop('disabled', !isDASH); 

    var players = isDASH ? DASH_PLAYERS : HLS_PLAYERS;
    $('#player').empty();
    players.forEach(function (player) {
        var option = $('<option>').text(player);
        $('#player').append(option);
    });
    $('#player').trigger('change');  
}
updateFieldsCorrespondingToStreamingProtocol();

function updateFieldsCorrespondingToPlaybackMode() {
    var isLive = $('#playbackMode').val() === 'LIVE';
    $('#startTimestamp').prop('disabled', isLive);
    $('#endTimestamp').prop('disabled', isLive);
}
updateFieldsCorrespondingToPlaybackMode();

$('.loader').hide();
$('.main').show();
console.log("Page loaded")

$(document).ready(function() {
    $("#toggle").click(function() {
      var elem = $("#toggle").text();
      if (elem == "More Option") {
        //Stuff to do when btn is in the read more state
        $("#toggle").text("Less Option");
        $("#text").slideDown();
      } else {
        //Stuff to do when btn is in the read less state
        $("#toggle").text("More Option");
        $("#text").slideUp();
      }
    });
  });