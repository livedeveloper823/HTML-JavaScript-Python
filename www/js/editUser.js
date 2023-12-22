var departments = null;
var municipalities = null;
var entities = null;
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
	$ ('#btn-save').click (onUpdateUser);
}

function onNavigateBack ()
{
	window.location = 'users.html';
}


function onGetUserSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GUS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GUS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GUS003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GUS999')
		return;

	var user = data ['p'] ['r']

	$ ('#td-uid').text ('' + user [0] );
	$ ('#inp-name').val (user [1] );
	$ ('#inp-password').val ('********');
	$ ('#td-login').text (user [2] );
	if (user [3] )
		$('#sel-status option[value="1"]').prop ('selected', true);
	else
		$('#sel-status option[value="0"]').prop ('selected', true);
	$('#sel-role option[value="' + user [8] + '"]').prop ('selected', true);
	onRoleChanged ();
	if (user [4] == 'DFM')
	{
		var depto = parseInt ( ('' + user [5] ).slice (-4, -2), 10);
		$('#sel-department option[value="' + depto + '"]').prop ('selected', true);
		onDepartmentChanged ();
		var muni = parseInt ( ('' + user [5] ).slice (-2), 10);
		$('#sel-municipality option[value="' + muni + '"]').prop ('selected', true);
		onMunicipalityChanged ();
		$('#sel-entity option[value="' + user [5] + '"]').prop ('selected', true);
	}
	$ ('#inp-email').val (user [7] );
}


function onUpdateUser ()
{
	var email = $ ('#inp-email').val ().trim ();
	var name = $ ('#inp-name').val ().trim ();
	var password = $ ('#inp-password').val ().trim ();
	var role = $ ('#sel-role').val ();
	var status = $ ('#sel-status').val ();
	var entity = $ ('#sel-entity').val () || 0;

	var params = {'i': uid, 'm': email, 'n': name, 'p': password, 'r': role, 's': status, 'e': entity};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'updateUser', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUpdateUserSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onUpdateUserSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'UUS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'UUS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'UUS003')
	{
		var html = '<p>El usuario no se ha actualizado por la siguiente razón:</p><ul>';
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

	if (code != 'UUS999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-save').hide ();
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

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getUser', 'p': {'i': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetUserSuccess (jqXHR, textStatus, data);
		}
	} );
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

