var departments = null;
var municipalities = null;
var entities = null;


$ (init);

function init ()
{
	initNav ();

	loadDepartments ();

	$ ('#sel-role option:eq(0)').prop ('selected', true)
	$ ('#sel-department').prop ('disabled', true);
	$ ('#sel-municipality').prop ('disabled', true);
	$ ('#sel-entity').prop ('disabled', true);
	$ ('#sel-role').change (onRoleChanged);
	$ ('#sel-department').change (onDepartmentChanged);
	$ ('#sel-municipality').change (onMunicipalityChanged);
	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();


	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-create').click (onCreateUser);
}

function onNavigateBack ()
{
	window.location = 'users.html';
}

function onCreateUser ()
{
	var email = $ ('#inp-email').val ().trim ();
	var name = $ ('#inp-name').val ().trim ();
	var login = $ ('#inp-login').val ().trim ();
	var password = $ ('#inp-password').val ().trim ();
	var role = $ ('#sel-role').val ();
	var status = $ ('#sel-status').val ();
	var depto = $ ('#sel-department').val ();
	var muni = $ ('#sel-municipality').val ();
	var entity = $ ('#sel-entity').val () || 0;

	var params = {'m': email, 'n': name, 'l': login, 'p': password, 'r': role, 's': status, 'e': entity};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'createUser', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onCreateUserSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onCreateUserSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'CUS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'CUS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'CUS003')
	{
		var html = '<p>El usuario no se ha creado por la siguiente razón:</p><ul>';
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

	if (code != 'CUS999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-create').hide ();
	$ ('#div-buttons').show ();
	$ ('#div-loading').hide ();
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
}



function onRoleChanged ()
{
	var role = $ ('#sel-role').val ();

	if (role == 2)
	{
		$ ('#sel-department').prop ('disabled', false);
		$ ('#sel-municipality').prop ('disabled', false);
		$ ('#sel-entity').prop ('disabled', false);
		$ ('#sel-department').html ('');
		$ ('#sel-municipality').html ('');
		$ ('#sel-entity').html ('');
		populateDepartments ();
	}
	else
	{
		$ ('#sel-department').prop ('disabled', true);
		$ ('#sel-municipality').prop ('disabled', true);
		$ ('#sel-entity').prop ('disabled', true);
		$ ('#sel-department').html ('<option value="0">no aplica</option>');
		$ ('#sel-municipality').html ('<option value="0">no aplica</option>');
		$ ('#sel-entity').html ('<option value="0">no aplica</option>');
	}
}


function onMunicipalityChanged ()
{
	console.log ('onmunichanged');
	var department = $ ('#sel-department').val ();
	var municipality = $ ('#sel-municipality').val ();
	var html = '';
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

function escape (s)
{
	return $('<div>').text (s).html ()
}


function filterEntity (dpto, muni, entity)
{
	return entity [2] == muni && entity [3] == dpto;
}

