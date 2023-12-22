$ (init);

function init ()
{
	initNav ();

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getBlock', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetBlockSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onGetBlockSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GBL001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GBL002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'GBL999')
	{
		window.location = 'error.html';
		return;
	}

	var blocked = (data ['p'] ['b'] == 1);

	if (blocked)
	{
		$ ('#p-status').text ('Actualmente el sistema se encuentra en el estado bloqueado y solamente usuarios con el rol ADM podrán accederlo. Si decide desbloquear el sistema, todos los usuarios podrán accederlo.');
		$ ('#btn-toggle').text ('Desbloquear');
	}
	else
	{
		$ ('#p-status').text ('Actualmente el sistema se encuentra en el estado desbloqueado. Si decide bloquear el sistema, solamente usuarios con el rol ADM podrán accederlo.');
		$ ('#btn-toggle').text ('Bloquear');
	}

	$ ('#btn-toggle').click (onToggle);
}


function onToggle ()
{
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'toggleBlock', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onToggleBlockSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onToggleBlockSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'TBL001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'TBL002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'TBL999')
	{
		window.location = 'error.html';
		return;
	}

	location.reload();
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}
