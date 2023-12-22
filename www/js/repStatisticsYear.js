$ (init);

function init ()
{
	initNav ();

	$ ('#btn-show').click (onShowReport);
	$ ('#btn-pdf').click (onPDF);
	$ ('#p-error').hide ();
}

function onShowReport ()
{
	$ ('#p-error').hide ();
	var year = parseInt ($ ('#inp-year').val ().trim (), 10);
	if (isNaN (year) || year < 1900 || year > 2100)
	{
		$ ('#p-error').text ('Ingrese un año.');
		$ ('#p-error').show ();
		return;
	}
	window.open ('../reports/statisticsYear.html?y=' + year);
}


function onPDF ()
{
	$ ('#p-error').hide ();
	var year = parseInt ($ ('#inp-year').val ().trim (), 10);
	if (isNaN (year) || year < 1900 || year > 2100)
	{
		$ ('#p-error').text ('Ingrese un año.');
		$ ('#p-error').show ();
		return;
	}

	var params = {'y': year};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenStatisticsYearPDF', 'p': params} ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onExportSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onExportSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GRP001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GRP002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code != 'GRP999')
	{
		window.location = 'error.html';
		return;
	}

	var docId = data ['p'] ['docId'];
	window.open ('../wsgi/getDocument.wsgi?' + docId);
}


