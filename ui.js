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



// Show more text option 
var showChar = 190;  // How many characters are shown by default
var ellipsestext = "...";
var moretext = "More Options";
var lesstext = "Less Options";

//Cut content based on showChar length
if ($(".toggle-text").length) {
    $(".toggle-text").each(function() {

        var content = $(this).html();
        console.log(content);
 
        if(content.length > showChar) {
 
            var contentExcert = content.substr(0, showChar);
            var contentRest = content.substr(showChar, content.length - showChar);
            var html = contentExcert + '<span class="toggle-text-ellipses">' + ellipsestext + ' </span> <span class="toggle-text-content"><span>' + contentRest + '</span><a href="javascript:;" class="toggle-text-link">' + moretext + '</a></span>';
 
            $(this).html(html);
        }
    });
}

//Toggle content when click on read more link
$(".toggle-text-link").click(function(){
    if($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
    } else {
        $(this).addClass("less");
        $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
});