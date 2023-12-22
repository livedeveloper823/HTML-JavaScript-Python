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
	window.open ('../reports/juridical.html');
}


function onPDF ()
{

	$ ('#p-error').hide ();
	var params = {};
	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenJuridicalPDF', 'p': params} ),
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
	var params = {};
	console.log (params);
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repJuridicalCSV', 'p': params} ),
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


function onMunicipalityChanged ()
{
	console.log ('onmunichanged');
	var department = $ ('#sel-department').val ();
	var municipality = $ ('#sel-municipality').val ();
	var html = '<option value="0">todas</option>';
	for (var i in entities)
	{
		var entity = entities [i];
		console.log (entity);
		if (! filterEntity (department, municipality, entity) ) continue;
		html += '<option value="' + entity [0] + '">' + escape ('(' + entity [0] + ') ' + entity [1] ) + '</option>';
	}
	$ ('#sel-entity').html (html);
}

function onDepartmentChanged ()
{
	console.log ('ondptochanged');
	var department = $ ('#sel-department').val ();
	var html = '<option value="0">todos</option>';
	for (var i in municipalities)
	{
		var muni = municipalities [i];
		if (muni [0] != department) continue;
		html += '<option value="' + muni [1] + '">' + escape (muni [2] ) + '</option>';
	}
	$ ('#sel-municipality').html (html);
	$ ('#sel-entity').html ('<option value="0">todas</option>');
}


function loadDepartments ()
{
	console.log ('loadDepartments');
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getDepartments', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetDepartmentsSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function onGetDepartmentsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code != 'GDP999')
		return;

	departments = data ['p'] ['d'];
	municipalities = data ['p'] ['m'];
	entities = data ['p'] ['e'];
	populateDepartments ();
}

function populateDepartments ()
{
	if (departments === null) return;
	var html = '<option value="0">todos</option>';
	for (var i in departments)
		html += '<option value="' + i + '">' + escape (departments [i] ) + '</option>';
	$ ('#sel-department').html (html);
	$ ('#sel-municipality').html ('<option value="0">todos</option>');
	$ ('#sel-entity').html ('<option value="0">todas</option>');
}


function escape (s)
{
	return $('<div>').text (s).html ()
}


function filterEntity (dpto, muni, entity)
{
	return entity [2] == muni && entity [3] == dpto;
}

