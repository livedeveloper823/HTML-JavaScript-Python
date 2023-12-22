var uid = null;


$ (init);

function init ()
{
	initNav (onSession);
}

function onSession (role)
{
	if (role != 3)
	{
		window.location = 'nopermission.html';
		return;
	}

	uid = window.location.search.substring (1);
	if (uid.length == 0)
	{
		window.location = 'error.html';
		return;
	}

	$ ('#spn-roster').text ('' + uid);
	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-back2').click (onNavigateBack);
	$ ('#btn-accept').click (registerAgreement);
}

function onNavigateBack ()
{
	window.location.replace ('showRoster.html?' + uid);
} 

function registerAgreement ()
{
	$ ('#canvas').hide ();
	var params = {'r': uid, 'a': $ ('#inp-agreement').val ().trim () }

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'registerRosterAgreement', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onRegisterSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onRegisterSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}


	var code = data ['c'];


	if (code == 'RPA001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'RPA002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code == 'RPA003')
	{
		var result = '<p class="error">El convenio no se pudo registrar por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-result').html (result);
		$ ('#canvas-result').show ();
		return;
	}


	if (code != 'RPA999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p>El convenio se registró con éxito.</p>';
	$ ('#div-result').html (result);
	$ ('#canvas-result').show ();
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
