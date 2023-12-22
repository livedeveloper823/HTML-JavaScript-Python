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

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getOrderRejectionReasons', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetReasonsSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-back2').click (onNavigateBack);
}

function onNavigateBack ()
{
	window.location.replace ('showOrder.html?' + uid);
} 


function onGetReasonsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code != 'GPR999')
		return;

	var reasons = data ['p'] ['r']

	reasonMessages = {};
	var options = '';
	for (var idx in reasons)
	{
		var reason = reasons [idx];
		options += '<option value="' + escape (reason [0] ) + '">' + escape (reason [1] ) + '</option>';
		reasonMessages [reason [0] ] = reason [2];
	}
	$ ('#sel-reason').html (options);
	$ ('#sel-reason').change (onReasonChanged);
	onReasonChanged ();
	$ ('#btn-reject').click (rejectOrder);
}

function rejectOrder ()
{
	$ ('#canvas').hide ();
	var params = {'o': uid, 'rs': $ ('#sel-reason').val () }

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'rejectOrder', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onRejectSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onRejectSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}


	var code = data ['c'];


	if (code == 'RPO001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'RPO002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code == 'RPO003')
	{
		var result = '<p class="error">La planilla no se pudo rechazar por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-result').html (result);
		$ ('#canvas-result').show ();
		return;
	}


	if (code != 'RPO999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p>El pago se rechazó con éxito.</p>';
	$ ('#div-result').html (result);
	$ ('#canvas-result').show ();
}

function onReasonChanged ()
{
	var reason = $ ('#sel-reason').val ();
	$ ('#p-message').text (reasonMessages [reason] );
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
