var uid = null;


$ (init);

function init ()
{
	$ ('#canvas').hide ();
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

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'initAcceptRoster', 'p': {'r': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onInitAcceptSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-back2').click (onNavigateBack);
}

function onNavigateBack ()
{
	window.location.replace ('showRoster.html?' + uid);
} 


function onInitAcceptSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'IARS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'IAR002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code == 'IAR003')
	{
		var result = '<p class="error">La planilla no se pudo aceptar por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-result').html (result);
		$ ('#canvas-result').show ();
		return;
	}
	if (code != 'IAR999')
		return;

	var info = data ['p'] ['i'];
	$ ('#spn-roster').text ('' + info [0] );
	$ ('#spn-entity').text ('' + info [1] );
	$ ('#spn-entityName').text ('' + info [2] );
	$ ('#spn-month').text ('' + info [4] );
	$ ('#spn-year').text ('' + info [5] );

	$ ('#canvas-result').hide ();
	$ ('#canvas').show ();
	$ ('#btn-accept').click (acceptRoster);
}

function acceptRoster ()
{
	$ ('#canvas').hide ();
	var params = {'r': uid, 'a': $ ('#inp-agreement').val ().trim () }

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'acceptRoster', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onAcceptSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onAcceptSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}


	var code = data ['c'];


	if (code == 'ARS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'ARS002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code == 'ARS003')
	{
		var result = '<p class="error">La planilla no se pudo aceptar por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-result').html (result);
		$ ('#canvas-result').show ();
		return;
	}


	if (code != 'ARS999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p>La planilla se aceptó con éxito.</p>';
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
