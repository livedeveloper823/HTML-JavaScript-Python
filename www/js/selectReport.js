$ (init);

function init ()
{
	initNav ();

	listReports ();

	$ ('#btn-select').click (onSelectReport);
}

function onSelectReport ()
{
	var url = $ ('#sel-report').val ();
	console.log (url);
	location.href = url;
}

function listReports ()
{
	console.log ('listReports');
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'listReports', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onListReportsSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onListReportsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'LRP001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'LRP002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code != 'LRP999')
	{
		window.location = 'error.html';
		return;
	}

	var html = '';
	var data = data ['p'] ['d'];
	for (var idx in data)
	{
		var url = data [idx] [2];
		var name = data [idx] [1];
		html += '<option value="' + escape (url) + '">' + escape (name) + '</option>';
	}	
	$ ('#sel-report').html (html);
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}

