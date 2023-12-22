$ (init);

function init ()
{
	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();

	$ (".input1").on ('keyup', function (e) {
	    if (e.keyCode == 13) {
	  }
	} );

	$ ('#btn-login').click (function ()
	{
		login ();
	} );

	$ (document).on ('keyup', function (e) {
	    if (e.keyCode == 13) {
		login ();
	  }
	} );
}

function login ()
{
	$ ('#div-error').hide ();

	$ ('#btn-login').hide ();
	$ ('#div-loading').show ();

	var pw = $ ('#inp-pw').val ();
	var login = $ ('#inp-login').val ();

	var data = {'login': login,
		'password': pw};

	console.log (data);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'login', 'p': data} ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onAjaxSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function onAjaxSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log ('onAjaxSuccess');
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'LGN001')
	{
		$ ('#div-error').html ('<p>El servidor ha rechazado sus credenciales.</p><p>Asegúrese que ingresó correctamente su usuario y su contraseña.</p>');
		$ ('#div-error').show ();		
	}

	if (code == 'LGN002')
	{
		$ ('#div-error').html ('<p>Su cuenta de usuario ha sido deshabilitada.</p><p>Por favor comuníquese con el Plan de Prestaciones.</p>');
		$ ('#div-error').show ();		
	}

	if (code == 'LGN003')
	{
		$ ('#div-error').html ('<p>El sistema se encuentra bloqueado.</p><p>Por favor, espere un momento.</p>');
		$ ('#div-error').show ();	
	}

	if (code != 'LGN999')
	{
		$ ('#btn-login').show ();
		$ ('#div-loading').hide ();
		return;
	}

	var role = data ['p'] ['r'];
	if (role == 1) window.location = 'index.html';
	if (role == 2) window.location = 'dfm_rosters.html';
	if (role == 3) window.location = 'index.html';
	if (role == 4) window.location = 'index.html';
	if (role == 5) window.location = 'index.html';
	if (role == 6) window.location = 'index.html';
	if (role == 7) window.location = 'index.html';
	if (role == 8) window.location = 'index.html';
}
