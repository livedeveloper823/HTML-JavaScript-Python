$ (init);

function init ()
{
	initNav ();

	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();


	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getSettings', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetSettingsSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-save').click (onUpdateSettings);
}

function onNavigateBack ()
{
	window.location = 'index.html';
}


function onGetSettingsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GST001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GST002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GST003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GST999')
		return;

	var params = data ['p'];

	$ ('#inp-workerFee').val (params ['workerFee'] );
	$ ('#inp-patronFee').val (params ['patronFee'] );
	$ ('#inp-smtpServer').val (params ['smtpServer'] );
	$ ('#inp-smtpLogin').val (params ['smtpLogin'] );
	$ ('#inp-smtpPassword').val (params ['smtpPassword'] );
}


function onUpdateSettings ()
{
	var workerFee = $ ('#inp-workerFee').val ().trim ();
	var patronFee = $ ('#inp-patronFee').val ().trim ();
	var smtpLogin = $ ('#inp-smtpLogin').val ().trim ();
	var smtpServer = $ ('#inp-smtpServer').val ().trim ();
	var smtpPassword = $ ('#inp-smtpPassword').val ().trim ();

	var params = {'workerFee': workerFee, 'patronFee': patronFee, 'smtpLogin': smtpLogin, 'smtpServer': smtpServer, 'smtpPassword': smtpPassword};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'setSettings', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUpdateSettingsSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onUpdateSettingsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'SST001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'SST002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'SST003')
	{
		var html = '<p>La configuración no se ha actualizado por la siguiente razón:</p><ul>';
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

	if (code != 'SST999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-save').hide ();
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
