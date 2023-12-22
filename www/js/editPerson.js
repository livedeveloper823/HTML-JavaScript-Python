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
	$ ('#p-hidden').hide ();
	$ ('#inp-image').change (uploadPhotograph);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getPerson', 'p': {'i': uid} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetPersonSuccess (jqXHR, textStatus, data);
		}
	} );

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-save').click (onUpdatePerson);
	$ ('#btn-upload').click (onFakeClick);
}

function onFakeClick ()
{
	$ ('#inp-image').click ();
}

function onNavigateBack ()
{
	window.location = 'persons.html';
}


function onGetPersonSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'GPS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'GPS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'GPS003')
	{
		window.location = 'error.html';
		return;
	}


	if (code != 'GPS999')
		return;

	var person = data ['p'] ['r']

	$ ('#td-cui').html (formatCUI (uid) );
	$ ('#inp-first').val (person [0] );
	$ ('#inp-last').val (person [1] );
	$ ('#sel-sex').val (person [2] );
	$ ('#inp-born').val (person [3] );
	$ ('#inp-address').val (person [4] );
	$ ('#sel-status').val (person [6] );
	$ ('#inp-nit').val (person [7] );
	if (person [5] )
		$ ('#img-photograph').attr ('src', '../wsgi/getPersonPhotograph.wsgi?' + uid);
}


function onUpdatePerson ()
{
	var first = $ ('#inp-first').val ().trim ();
	var last = $ ('#inp-last').val ().trim ();
	var address = $ ('#inp-address').val ().trim ();
	var nit = $ ('#inp-nit').val ().trim ();
	var born = $ ('#inp-born').val ().trim ();
	var status = $ ('#sel-status').val ();
	var sex = $ ('#sel-sex').val ();

	var params = {'i': uid, 'f': first, 'l': last, 'a': address, 'n': nit, 'b': born, 's': status, 'x': sex};
	console.log (params);

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'updatePerson', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUpdatePersonSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onUpdatePersonSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'UPS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'UPS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'UPS003')
	{
		var html = '<p>La persona no se ha actualizado por la siguiente razón:</p><ul>';
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

	if (code != 'UPS999')
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


function formatCUI (cui)
{
	cui = '' + cui;
	cui = cui.substring (0, 5) + '&nbsp' + cui.substring (5, 9) + '&nbsp;' + cui.substring (9);
	return cui;
}

function uploadPhotograph ()
{
	$ ('#p-nofile').hide ();
	var fileInput = $('#inp-image') [0];
	var file = fileInput.files [0];
	if (file == undefined)
	{
		$ ('#p-nofile').text ('Elija primero un archivo.');
		$ ('#p-nofile').show ();
		return;
	}
	var size = file.size;
	var extension = (file.name.slice (-4) );
	if (extension != '.jpg' && extension != '.JPG' && extension != '.jpeg' && extension != '.JPEG')
	{
		$ ('#p-nofile').text ('Elija un archivo en formato JPG/JPEG.');
		$ ('#p-nofile').show ();
		return;
	}
	if (size > 10000000)
	{
		$ ('#p-nofile').text ('El archivo está muy grande.');
		$ ('#p-nofile').show ();
		return;
	}

	var fdata = new FormData ();
	fdata.append ('image', file);
	fdata.append ('cui', uid);

	var jqXHR = $.ajax ( {
		url: '../wsgi/uploadPersonPhotograph.wsgi',
		type: 'POST',
		contentType: false,
		data: fdata,
		processData: false,
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUploadSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onUploadSuccess (jqXHR, textStatus, data)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}
	var code = data ['c'];
	
	if (code == 'UPH001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'UPH002')
	{
		window.location = 'nopermission.html';
		return;
	}
	if (code != 'UPH999')
	{
		window.location = 'error.html';
		return;
	}

	location.reload ();
}

