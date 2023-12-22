session = undefined;
var sessionCallback = undefined;

function initNav (callback)
{
	sessionCallback = callback;
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getSession', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onGetSessionError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetSessionSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onGetSessionError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function onGetSessionSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log ('onGetSessionSuccess');
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code != 'SSN999')
	{
		window.location = 'login.html';
		return;
	}

	var role = data ['p'] ['role'];
	var login = data ['p'] ['login'];
	session = role;

	$ ('#login-name').text (login);

	if (role == 1)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'users.html\';">Usuarios</div>';
		menu += '<div class="menu-item" onclick="location.href=\'entities.html\';">Entidades</div>';
		menu += '<div class="menu-item" onclick="location.href=\'block.html\';">Bloqueo</div>';
		menu += '<div class="menu-item" onclick="location.href=\'log.html\';">Bitácora</div>';
		menu += '<div class="menu-item" onclick="location.href=\'showStocks.html\';">Existencias 7E</div>';
		menu += '<div class="menu-item" onclick="location.href=\'persons.html\';">Personas</div>';
		menu += '<div class="menu-item" onclick="location.href=\'settings.html\';">Configuración</div>';
		menu += '<div class="menu-item" onclick="location.href=\'selectReport.html\';">Reportes</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (role == 3)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'users.html\';">Usuarios</div>';
		menu += '<div class="menu-item" onclick="location.href=\'entities.html\';">Entidades</div>';
		menu += '<div class="menu-item" onclick="location.href=\'rosters.html\';">Planillas</div>';
		menu += '<div class="menu-item" onclick="location.href=\'orders.html\';">Órdenes</div>';
		menu += '<div class="menu-item" onclick="location.href=\'receipts.html\';">Recibos</div>';
		menu += '<div class="menu-item" onclick="location.href=\'showStocks.html\';">Existencias 7E</div>';
		menu += '<div class="menu-item" onclick="location.href=\'reminder.html\';">Recordatorio</div>';
		menu += '<div class="menu-item" onclick="location.href=\'selectReport.html\';">Reportes</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (role == 4)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'users.html\';">Usuarios</div>';
		menu += '<div class="menu-item" onclick="location.href=\'entities.html\';">Entidades</div>';
		menu += '<div class="menu-item" onclick="location.href=\'rosters.html\';">Planillas</div>';
		menu += '<div class="menu-item" onclick="location.href=\'orders.html\';">Órdenes</div>';
		menu += '<div class="menu-item" onclick="location.href=\'receipts.html\';">Recibos</div>';
		menu += '<div class="menu-item" onclick="location.href=\'showStocks.html\';">Existencias 7E</div>';
		menu += '<div class="menu-item" onclick="location.href=\'selectReport.html\';">Reportes</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (role == 5)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'rosters.html\';">Planillas</div>';
		menu += '<div class="menu-item" onclick="location.href=\'receipts.html\';">Recibos</div>';
		menu += '<div class="menu-item" onclick="location.href=\'selectReport.html\';">Reportes</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (role == 7)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'selectReport.html\';">Reportes</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (role == 8)
	{
		var menu = '<div class="menu-item" onclick="location.href=\'persons.html\';">Personas</div>';
		$ ('#menu-canvas').html (menu);
	}

	if (sessionCallback != undefined) sessionCallback (session);
}
