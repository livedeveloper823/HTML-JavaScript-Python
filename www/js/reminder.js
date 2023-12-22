$ (init);

function init ()
{
	initNav ();
	$ ('#btn-send').click (onSend);
	$ ('#btn-cancel').click (onCancel);
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getReminder', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetReminderSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onCancel ()
{
	window.location = 'index.html';
}

function onSend ()
{
	window.location = 'sendReminder.html';
}

function onGetReminderSuccess (jqXHR, textStatus, data, requestCode)
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


	var rows = data ['p'] ['r'];
	var total = data ['p'] ['t'];

	var html = '';
	for (var i in rows)
	{
		var row = rows [i];
		var code = row [0];
		var name = row [1];
		var mails = row [2]
		html += '<tr><td>' + escape ('' + row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td>' + escape (row [2] ) + '</td></tr>';
	}
	$('#page-tbody').html (html);
	$ ('#btn-send').text ('Enviar ' + total + ' correos');
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}


function escape (s)
{
	return $('<div>').text (s).html ()
}

