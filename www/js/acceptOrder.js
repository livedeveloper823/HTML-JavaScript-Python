var uid = null;


$ (init);

function init ()
{
	$ ('#canvas-result').hide ();
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

	$ ('#spn-order').text ('' + uid);
	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-back2').click (onNavigateBack);
	$ ('#btn-accept').click (acceptOrder);
}

function onNavigateBack ()
{
	window.location.replace ('showOrder.html?' + uid);
} 

function acceptOrder ()
{
	$ ('#canvas').hide ();
	var params = {'o': uid}

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'acceptOrderForPayment', 'p': params } ),
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


	if (code == 'ERP001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'ERP002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code == 'ERP003')
	{
		var result = '<p class="error">La orden de pago no se pudo aceptar por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-result').html (result);
		$ ('#canvas-result').show ();
		return;
	}


	if (code != 'ERP999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p>El pago se aceptó con éxito.</p>';
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
