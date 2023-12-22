$ (init);

function init ()
{
	$ ('#btn-register').hide ();
	initNav (onSession);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getStocks', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetStocksSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onSession (role)
{
	if (role == 1)
	{
		$ ('#btn-register').show ();
		$ ('#btn-register').click (registerReceipts);
	}
}

function registerReceipts ()
{
	window.location.replace ('registerReceipts.html');
}

function onGetStocksSuccess (jqXHR, textStatus, data, requestCode)
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

	var stocks = data ['p'] ['r']

	if (stocks [3] == 0)
	{
		$ ('#p-used').text ('No se han emitido recibos 7E.');
	}
	else
	{
		$ ('#p-used').text ('Se han emitido los recibos 7E del ' + stocks [4] + ' al ' + stocks [5] + ' (' + stocks [3] + ' en total).');
	}
	if (stocks [0] == 0)
	{
		$ ('#p-stocks').text ('No hay recibos 7E en existencia.');
	}
	else
	{
		$ ('#p-stocks').text ('Quedan en existencia los recibos 7E del ' + stocks [1] + ' al ' + stocks [2] + ' (' + stocks [0] + ' en total).');
	}
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
