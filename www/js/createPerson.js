$ (init);

function init ()
{
	initNav ();

	$ ('#div-loading').hide ();
	$ ('#div-error').hide ();
	$ ('#div-success').hide ();

	$ ('#btn-back').click (onNavigateBack);
	$ ('#btn-create').click (onCreatePerson);

}

function onNavigateBack ()
{
	window.location = 'persons.html';
}

function onCreatePerson ()
{
	var uid = $ ('#inp-cui').val ().trim ();
	var first = $ ('#inp-first').val ().trim ();
	var last = $ ('#inp-last').val ().trim ();
	var address = $ ('#inp-address').val ().trim ();
	var nit = $ ('#inp-nit').val ().trim ();
	var born = $ ('#inp-born').val ().trim ();
	var status = $ ('#sel-status').val ();
	var sex = $ ('#sel-sex').val ();

	var params = {'i': uid, 'f': first, 'l': last, 'a': address, 'n': nit, 'b': born, 's': status, 'x': sex};

	$ ('#div-error').hide ();
	$ ('#div-success').hide ();
	$ ('#div-buttons').hide ();
	$ ('#div-loading').show ();
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'createPerson', 'p': params } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onCreatePersonSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onCreatePersonSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'CPS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'CPS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'CPS003')
	{
		var html = '<p>La persona no se ha creado por la siguiente razón:</p><ul>';
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

	if (code != 'CPS999')
	{
		window.location = 'error.html';
		return;
	}

	var cui = data ['p'] ['cui'];
	location.replace ('editPerson.html?' + cui);

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
