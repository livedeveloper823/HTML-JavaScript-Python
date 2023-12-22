var uid = null;


$ (init);

function init ()
{
	$ ('#btns-tsr-only').hide ();
	$ ('#div-payorder-p').hide ();
	$ ('#div-payorder-l').hide ();
	$ ('#div-receipt-p').hide ();
	$ ('#div-receipt-l').hide ();
	$ ('#canvas2').hide ();
	$ ('#btn-ok').click (function () {window.location.reload ();} );

	initNav (onSession);
}

function onSession (role)
{

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
		data: JSON.stringify ( {'f': 'getRoster', 'p': {'i': uid} } ),
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

function acceptRoster () {
	window.location.replace ('acceptRoster.html?' + uid);
}

function registerAgreement () {
	window.location.replace ('registerAgreement.html?' + uid);
}

function rejectRoster ()
{
	window.location.replace ('rejectRoster.html?' + uid);
}

function removeAgreement ()
{
	$ ('#canvas1').hide ();
	$ ('#btn-ok').hide ();
	$ ('#div-canvas2').text ('Removiendo...');
	$ ('#canvas2').show ();

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'revokeRosterAgreement', 'p': {'r': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onRevokeAgreementSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onRevokeAgreementSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'RRA001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'RRA002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'RRA003')
	{
		var result = '<p class="error">El convenio no pudo ser removido por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-canvas2').html (result);
		$ ('#btn-ok').show ();
		return;
	}


	if (code != 'RRA999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p class>El convenio ha sido removido.</p>';
	$ ('#div-canvas2').html (result);
	$ ('#btn-ok').show ();

}



function revokeRejection ()
{
	$ ('#canvas1').hide ();
	$ ('#btn-ok').hide ();
	$ ('#div-canvas2').text ('Revocando rechazo...');
	$ ('#canvas2').show ();

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'revokeRosterRejection', 'p': {'r': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onRevokeRejectionSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onRevokeRejectionSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'RRR001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'RRR002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'RRR003')
	{
		var result = '<p class="error">El rechazo no pudo ser revocado por la siguiente razón: ' + escape (data ['p'] ['m'] ) + '</p>';
		$ ('#div-canvas2').html (result);
		$ ('#btn-ok').show ();
		return;
	}


	if (code != 'RRR999')
	{
		window.location = 'error.html';
		return;
	}

	var result = '<p class>El rechazo ha sido recovado.</p>';
	$ ('#div-canvas2').html (result);
	$ ('#btn-ok').show ();

}

function onShowPDF ()
{
	window.open ('../wsgi/getRosterPDF.wsgi?' + uid);
}

function onShowCSV ()
{
	window.open ('../wsgi/getRosterCSV.wsgi?' + uid);
}

function onShowOCSV ()
{
	window.open ('../wsgi/getRosterOCSV.wsgi?' + uid);
}

function showPayOrder (poid)
{
	window.open ('../wsgi/getPayOrder.wsgi?' + poid);
}

function showReceipt (roid)
{
	window.open ('../wsgi/getReceiptOriginalPDF.wsgi?' + roid);
}

function onNavigateBack ()
{
	window.location.replace ('rosters.html');
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

	if (code == 'GRS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GRS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GRS003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GRS999')
		return;

	var roster = data ['p'] ['r']

	$ ('#span-id').text ('' + roster [0] );
	$ ('#td-month').text (roster [1] );
	$ ('#td-year').text (roster [2] );
	var newDate = new Date (roster [7] * 1000);
	var dateString = newDate.toLocaleString ('es-ES');
	$ ('#td-uploaded').text (dateString + ' por ' + roster [8] );
	$ ('#td-entity').text (roster [9] + ' (' + roster [10] + ')');
	var status = roster [3];
	var statusName = roster [4];
	if (status == 1)
	{
		var tr = '<th>Estado:</th><td>' + statusName + '</td>'
		$ ('#tr-status').html (tr);
		tablePatron = '<tr><th>Monto:</th><td>' + escape (roster [6] ) + '</td></tr>';
		tableWorker = '<tr><th>Monto:</th><td>' + escape (roster [5] ) + '</td></tr>';
		$ ('#table-patron').html (tablePatron);
		$ ('#table-worker').html (tableWorker);

		$ ('#btn-reject-roster').show ();
		$ ('#btn-accept-roster').show ();
		$ ('#btn-revoke-rejection').hide ();
	}
	if (status == 2)
	{
		var newDate = new Date (roster [12] * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		var tr = '<th>Estado:</th><td>' + statusName + ' (el ' + dateString + ' por ' + escape (roster [11] ) + ') </td>';
		$ ('#tr-status').html (tr);
		tablePatron = '<tr><th>Monto:</th><td>' + escape (roster [6] ) + '</td></tr>';
		tableWorker = '<tr><th>Monto:</th><td>' + escape (roster [5] ) + '</td></tr>';
		$ ('#table-patron').html (tablePatron);
		$ ('#table-worker').html (tableWorker);

		$ ('#btn-reject-roster').hide ();
		$ ('#btn-accept-roster').hide ();
		$ ('#btn-revoke-rejection').show ();
	}
	if (status == 3)
	{
		var newDate = new Date (roster [14] * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		var tr = '<th>Estado:</th><td>' + statusName + ' (aceptada el ' + dateString + ' por ' + escape (roster [13] ) + ') </td>';
		$ ('#tr-status').html (tr);
		tablePatron = '<tr><th>Monto:</th><td>' + escape (roster [6] ) + '</td></tr>';
		tableWorker = '<tr><th>Monto:</th><td>' + escape (roster [5] ) + '</td></tr>';
		if (session == 3) tablePatron += '<tr><th>Convenio:</th><td>sin&nbsp;<span 	class="button" onclick="registerAgreement()">Registrar convenio</span></td></tr>';

		$ ('#table-patron').html (tablePatron);
		$ ('#table-worker').html (tableWorker);

		var poL = data ['p'] ['d'] [0];
		var poP = data ['p'] ['d'] [1];

		if (poL != 0)
		{
			$ ('#div-payorder-l').show ();
			$ ('#btn-payorder-l').click (function () {showPayOrder (poL); } );
		}
		if (poP != 0)
		{
			$ ('#div-payorder-p').show ();
			$ ('#btn-payorder-p').click (function () {showPayOrder (poP); } );
		}

		$ ('#btn-reject-roster').show ();
		$ ('#btn-accept-roster').hide ();
		$ ('#btn-revoke-rejection').hide ();
	}
	if (status == 4 || status == 5 || status == 6)
	{
		var newDate = new Date (roster [14] * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		var tr = '<th>Estado:</th><td>' + statusName + ' (aceptada el ' + dateString + ' por ' + escape (roster [13] ) + ') </td>';
		$ ('#tr-status').html (tr);
		tablePatron = '<tr><th>Monto:</th><td>' + escape (roster [6] ) + '</td></tr>';
		tableWorker = '<tr><th>Monto:</th><td>' + escape (roster [5] ) + '</td></tr>';

		if (roster [15] != 0)
		{
			tablePatron += '<tr><th>Convenio:</th><td>' + escape ('' + roster [15] ) + '&nbsp;<span class="button" onclick="removeAgreement()">Remover</span></td></tr>';
		}
		else
		{
			if (status == 3 || status == 5)
			{
				tablePatron += '<tr><th>Convenio:</th><td>sin&nbsp;<span 	class="button" onclick="registerAgreement()">Registrar convenio</span></td></tr>';
			}
			else
			{
				tablePatron += '<tr><th>Convenio:</th><td>sin</td></tr>';
			}
		}

		console.log ('xxxxxxxxxxx');

		$ ('#table-patron').html (tablePatron);
		$ ('#table-worker').html (tableWorker);

		var poL = data ['p'] ['d'] [0];
		var poP = data ['p'] ['d'] [1];

		if (poL != 0)
		{
			$ ('#div-payorder-l').show ();
			$ ('#btn-payorder-l').click (function () {showPayOrder (poL); } );
		}
		if (poP != 0)
		{
			$ ('#div-payorder-p').show ();
			$ ('#btn-payorder-p').click (function () {showPayOrder (poP); } );
		}

		var rcpL = data ['p'] ['rcp'] [0];
		var rcpP = data ['p'] ['rcp'] [1];

		if (rcpL != 0)
		{
			$ ('#div-receipt-l').show ();
			$ ('#btn-receipt-l').click (function () {showReceipt (rcpL); } );
		}
		if (rcpP != 0)
		{
			$ ('#div-receipt-p').show ();
			$ ('#btn-receipt-p').click (function () {showReceipt (rcpP); } );
		}

		$ ('#btn-reject-roster').hide ();
		$ ('#btn-accept-roster').hide ();
		$ ('#btn-revoke-rejection').hide ();
	}

	if (session == 3)
	{
		$ ('#btns-tsr-only').show ();
		$ ('#btn-accept-roster').click (acceptRoster);
		$ ('#btn-reject-roster').click (rejectRoster);
		$ ('#btn-revoke-rejection').click (revokeRejection);
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
