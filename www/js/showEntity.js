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
	$ ('#td-name').text (entity [1] );
	$ ('#td-account').text (entity [2] );
	$ ('#td-comment').text (entity [3] );
	$ ('#td-address').text (entity [4] );
	$ ('#td-department').text (entity [6] );
	$ ('#td-municipality').text (entity [5] );

}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
