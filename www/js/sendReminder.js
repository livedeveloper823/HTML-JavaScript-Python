$ (init);

function init ()
{
	initNav ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'sendReminder', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onSendReminderSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onSendReminderSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GRM001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GRM002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'GRM999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#theCanvas').text ('Los correos de recordatorio han sido enviados.');
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}


function escape (s)
{
	return $('<div>').text (s).html ()
}

