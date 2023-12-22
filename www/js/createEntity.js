var departments = null;
var municipalities = null;
var entities = null;


$ (init);

function init ()
{
	initNav ();

	loadDepartments ();

	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-create').click (onCreateEntity);
	$ ('#sel-department').change (onDepartmentChanged);
	$ ('#sel-municipality').change (onMunicipalityChanged);

}

function onNavigateBack ()
{
	window.location = 'entities.html';
}

function onCreateEntity ()
{
	var code = $ ('#inp-code').val ().trim ();
	var name = $ ('#inp-name').val ().trim ();
	var comment = $ ('#inp-comment').val ().trim ();
	var address = $ ('#inp-address').val ().trim ();
	var account = $ ('#inp-account').val ().trim ();
	var muni = $ ('#sel-municipality').val () || 0;
	var dpto = $ ('#sel-department').val () || 0;

	var params = {'c': code, 'n': name, 'k': comment, 'a': account, 'd': address, 'm': muni, 'dp': dpto};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'createEntity', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onCreateEntitySuccess (jqXHR, textStatus, data);
		}
	} );
}


function onCreateEntitySuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'CET001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'CET002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'CET003')
	{
		var html = '<p>La entidad no se ha creado por la siguiente razón:</p><ul>';
		for (var i in data ['p'] ['e'] )
		{
			html += '<li>' + escape (data ['p'] ['e'] [i] ) + '</li>';
		}
		html += '</ul></p>';
		$ ('#div-error').html (html);
		$ ('#div-error').show ();
		$ ('#div-buttons').show ();
		$ ('#div-loading').hide ();
		return;
	}

	if (code != 'CET999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-create').hide ();
	$ ('#div-buttons').show ();
	$ ('#div-loading').hide ();
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
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

function onDepartmentChanged ()
{
	console.log ('ondptochanged');
	var department = $ ('#sel-department').val ();
	var html = '<option value="0">seleccione</option>';
	for (var i in municipalities)
	{
		var muni = municipalities [i];
		if (muni [0] != department) continue;
		html += '<option value="' + muni [1] + '">' + escape (muni [2] ) + '</option>';
	}
	$ ('#sel-municipality').html (html);
	$ ('#sel-entity').html ('');
}


function populateDepartments ()
{
	if (departments === null) return;
	var html = '<option value="0">seleccione</option>';
	for (var i in departments)
		html += '<option value="' + i + '">' + escape (departments [i] ) + '</option>';
	$ ('#sel-department').html (html);
	$ ('#sel-municipality').html ('');
	$ ('#sel-entity').html ('');
}


function filterEntity (dpto, muni, entity)
{
	return entity [2] == muni && entity [3] == dpto;
}
