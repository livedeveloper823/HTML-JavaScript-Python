$ (init);

function init ()
{
	initNav ();

	$ ('#btn-show').click (onShowReport);
	$ ('#btn-pdf').click (onPDF);
	$ ('#btn-csv').click (onCSV);
	$ ('#p-error').hide ();
}

function onShowReport ()
{
	$ ('#p-error').hide ();
	var cui = $ ('#inp-cui').val ().trim ();
	if (cui == '')
	{
		$ ('#p-error').text ('Ingrese un CUI.');
		$ ('#p-error').show ();
		return;
	}
	window.open ('../reports/worker.html?c=' + encodeURI (cui) );
}


function onPDF ()
{

	$ ('#p-error').hide ();
	var cui = $ ('#inp-cui').val ().trim ();
	if (cui == '')
	{
		$ ('#p-error').text ('Ingrese un CUI.');
		$ ('#p-error').show ();
		return;
	}

	var params = {'c': cui};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenWorkerPDF', 'p': params} ),
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

function onCSV ()
{

	$ ('#p-error').hide ();
	var cui = $ ('#inp-cui').val ().trim ();
	if (cui == '')
	{
		$ ('#p-error').text ('Ingrese un CUI.');
		$ ('#p-error').show ();
		return;
	}

	var params = {'c': cui};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenWorkerCSV', 'p': params} ),
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

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}

