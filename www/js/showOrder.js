var departments = null;
var municipalities = null;
var entities = null;
var uid = null;
var rosterId = null;


$ (init);

function init ()
{
	$ ('#btn-reject').hide ();
	$ ('#btn-accept').hide ();
	initNav ();

	uid = window.location.search.substring (1);
	if (uid.length == 0)
	{
		window.location = 'error.html';
		return;
	}

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getOrder', 'p': {'i': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetOrderSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
}

function onNavigateBack ()
{
	window.location = 'orders.html';
}


function onGetOrderSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GPO001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GPO002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GPO003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GPO999')
		return;

	var order = data ['p'] ['r'];
	var fee = 'desconocido';
	var amount = 'desconocido';
	if (order [4] == 'L')
	{
		fee = 'laboral';
		amount = 'Q. ' + order [8];
	}
	if (order [4] == 'P')
	{
		fee = 'patronal';
		amount = 'Q. ' + order [7];
	}

	$ ('#td-number').html ('' + escape (order [0] ) + '&nbsp;<span class="button" onclick="showPDF()">Ver PDF</span>');
	var newDate = new Date (order [1] * 1000);
	var dateString = newDate.toLocaleString ('es-ES');
	$ ('#td-issued').text (dateString);
	$ ('#td-expires').text (order [2] );
	$ ('#td-entity').text (order [3] );
	$ ('#td-fee').text (fee);
	$ ('#td-monthyear').text ('' + order [5] + '/' + order [6] );
	$ ('#td-amount').text (amount);
	rosterId = order [9];
	$ ('#td-roster').html ('' + escape (order [9] ) + '&nbsp;<span class="button" onclick="showRoster()">Ver PDF</span>');
	$ ('#td-banrural').text (order [13] + ' (' + order [14] + ')');
	var accepted = false;
	var rejected = false;
	if (order [15] != 0)
	{
		var newDate = new Date (order [15] * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		$ ('#td-status').text ('aceptada el ' + dateString + ' por ' + order [16] );
		accepted = true;
	}
	if (order [17] != 0)
	{
		var newDate = new Date (order [17] * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		$ ('#td-status').text ('rechazada el ' + dateString + ' por ' + order [18] + ' (' + order [19] + ')');
		rejected = true;
	}
	if (order [15] == 0 && order [17] == 0)
	{
		$ ('#td-status').text (order [11] );
	}
	
	if (order [20] == 0)
	{
		$ ('#td-receipt').text ('sin');
	}
	else
	{
		receiptId = order [20];
		$ ('#td-receipt').html ('<span class="button" onclick="showReceiptOriginal()">Ver Original</span>&nbsp;<span class="button" onclick="showReceiptCopy()">Ver Copia</span>');
	}

	if (!accepted && !rejected && order [10] == 1)
	{
		$ ('#btn-reject').show ();
		$ ('#btn-reject').click (rejectOrder);
		$ ('#btn-accept').show ();
		$ ('#btn-accept').click (acceptOrder);
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

function showPDF ()
{
	window.open ('../wsgi/getPayOrder.wsgi?' + uid);
}

function showReceiptOriginal ()
{
	window.open ('../wsgi/getReceiptOriginalPDF.wsgi?' + receiptId);
}

function showRoster ()
{
	window.open ('../wsgi/getRosterPDF.wsgi?' + rosterId);
}

function rejectOrder ()
{
	window.location.replace ('rejectOrder.html?' + uid);
}

function acceptOrder ()
{
	window.location.replace ('acceptOrder.html?' + uid);
}

