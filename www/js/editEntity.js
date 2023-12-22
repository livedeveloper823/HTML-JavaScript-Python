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

	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();


	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getEntity', 'p': {'i': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetEntitySuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-save').click (onUpdateEntity);
}

function onNavigateBack ()
{
	window.location = 'entities.html';
}


function onGetEntitySuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GET001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GET002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GET003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GET999')
		return;

	var entity = data ['p'] ['r']

	$ ('#td-code').text ('' + entity [0] );
	$ ('#inp-name').val (entity [1] );
	$ ('#inp-account').val (entity [2] );
	$ ('#td-comment').text (entity [3] );
	$ ('#inp-address').val (entity [4] );
	$ ('#td-department').text (entity [6] );
	$ ('#td-municipality').text (entity [5] );
}


function onUpdateEntity ()
{
	var name = $ ('#inp-name').val ().trim ();
	var account = $ ('#inp-account').val ().trim ();
	var address = $ ('#inp-address').val ().trim ();

	var params = {'i': uid, 'a': account, 'n': name, 'd': address};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'updateEntity', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUpdateEntitySuccess (jqXHR, textStatus, data);
		}
	} );
}


function onUpdateEntitySuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'UET001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'UET002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'UET003')
	{
		var html = '<p>La entidad no se ha actualizado por la siguiente razón:</p><ul>';
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

	if (code != 'UET999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#div-success').show ();
	$ ('#btn-save').hide ();
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
