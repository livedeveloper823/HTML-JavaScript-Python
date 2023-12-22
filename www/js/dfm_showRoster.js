var uid = null;


$ (init);

function init ()
{
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
		data: JSON.stringify ( {'f': 'getRosterDFM', 'p': {'i': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetRosterSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-pdf').click (onShowPDF);
	$ ('#btn-csv').click (onShowCSV);
	$ ('#btn-ocsv').click (onShowOCSV);
}

function onShowPDF ()
{
	window.open ('../wsgi/getRosterPDF.wsgi?' + uid);
}

function showOrder (poid)
{
	window.open ('../wsgi/getPayOrder.wsgi?' + poid);
}

function showReceipt (rid)
{
	window.open ('../wsgi/getReceiptOriginalPDF.wsgi?' + rid);
}

function onShowCSV ()
{
	window.open ('../wsgi/getRosterCSV.wsgi?' + uid);
}

function onShowOCSV ()
{
	window.open ('../wsgi/getRosterOCSV.wsgi?' + uid);
}

function onNavigateBack ()
{
	window.location = 'dfm_rosters.html';
}


function onGetRosterSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GRDT001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GRD002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GRD003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GRD999')
		return;

	var roster = data ['p'] ['r']

	var rosterId = roster [0];
	var monthName = roster [1];
	var year = roster [2];
	var status = roster [3];
	var statusName = roster [4];
	var workerFee = roster [5];
	var patronFee = roster [6];
	var newDate = new Date (roster [7] * 1000);
	var uploadedOn = newDate.toLocaleString ('es-ES');
	var uploadedBy = roster [8];
	var newDate = new Date (roster [9] * 1000);
	var rejectedOn = newDate.toLocaleString ('es-ES');
	var newDate = new Date (roster [10] * 1000);
	var acceptedOn = newDate.toLocaleString ('es-ES');
	var agreement = roster [11];
	var workerOrders = data ['p'] ['d'] [0];
	var patronOrders = data ['p'] ['d'] [1];
	var workerReceipt = data ['p'] ['rcp'] [0];
	var patronReceipt = data ['p'] ['rcp'] [1];

	$ ('#span-id').text ('' + rosterId);
	$ ('#td-month').text (monthName);
	$ ('#td-year').text ('' + year);
	$ ('#td-uploaded').text (uploadedOn + ' por ' + uploadedBy);
	if (status == 1)
	{
		$ ('#td-status').text (statusName);
	}
	else if (status == 2)
	{
		$ ('#td-status').text (statusName + ' el ' + rejectedOn);
	}
	else
	{
		$ ('#td-status').text (statusName + ' (aceptada el ' + acceptedOn + ')');
	}

	var patron = '<tr><th>Monto:</th><td>' + escape (patronFee) + '</td></tr>';
	if (patronOrders.length > 0)
	{
		patron += '<tr><th>Órdenes de pago:</th><td><ul>';
		for (var idx in patronOrders)
		{
			var order = patronOrders [idx];
			patron += '<li>Número ' + escape ('' + order [0] ) + ' del ' + escape (order [1] ) + '; ' + escape (order [2] );
			if (order [2] == 'vigente')
				patron += '&nbsp;<span class="button" onclick="showOrder(' + escape ('' + order [0] ) + ')">Ver orden</span>';
			patron += '</li>';
		}
		patron += '</ul></td></tr>';
	}
	if (agreement != 0)
	{
		patron += '<tr><th>Convenio de pago:</th><td>' + escape ('' + agreement) + '</td></tr>';
	}
	if (patronReceipt != 0)
	{
		patron += '<tr><th>Recibo:</th><td><span class="button" onclick="showReceipt(' + escape ('' + patronReceipt) + ')">Ver recibo</span></td></tr>';
	}
	$ ('#table-patron').html (patron);

	var worker = '<tr><th>Monto:</th><td>' + escape (workerFee) + '</td></tr>';
	if (workerOrders.length > 0)
	{
		worker += '<tr><th>Órdenes de pago:</th><td><ul>';
		for (var idx in workerOrders)
		{
			var order = workerOrders [idx];
			worker += '<li>Número ' + escape ('' + order [0] ) + ' del ' + escape (order [1] ) + '; ' + escape (order [2] );
			if (order [2] == 'vigente')
				worker += '&nbsp;<span class="button" onclick="showOrder(' + escape ('' + order [0] ) + ')">Ver orden</span>';
			worker += '</li>';
		}
		worker += '</ul></td></tr>';
	}
	if (workerReceipt != 0)
	{
		worker += '<tr><th>Recibo:</th><td><span class="button" onclick="showReceipt(' + escape ('' + workerReceipt) + ')">Ver recibo</span></td></tr>';
	}
	$ ('#table-worker').html (worker);
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
