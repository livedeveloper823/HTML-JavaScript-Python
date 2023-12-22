$ (init);

function init ()
{
	initNav ();

	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-create').click (onRegister);
}

function onNavigateBack ()
{
	window.location.replace ('showStocks.html');
}

function onRegister ()
{
	var first = $ ('#inp-first').val ().trim ();
	var last = $ ('#inp-last').val ().trim ();

	var params = {'f': first, 'l': last};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'registerReceipts', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onRegisterReceiptsSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onRegisterReceiptsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'R7E001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'R7E002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'R7E003')
	{
		var html = '<p>Los recibos no se han registrado por la siguiente razón:</p><ul>';
		for (var i in data ['p'] ['e'] )
		{
			html += '<li>' + escape (data ['p'] ['e'] [i] ) + '</li>';
		}
		html += '</ul></p>';
		$ ('#div-error').html (html);
		$ ('#div-error').show ();
		$ ('#div-buttons').show ();
		$ ('#div-loading').hide ();
		return;
	}

	if (code != 'R7E999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-create').hide ();
	$ ('#div-buttons').show ();
	$ ('#div-loading').hide ();
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}

