$ (init);
var uid = null;

function init ()
{
	initNav ();

	uid = window.location.search.substring (1);
	if (uid.length == 0)
	{
		window.location = 'error.html';
		return;
	}

	$ ('#btn-back').click (navigateBack);

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

function navigateBack ()
{
	window.location = 'users.html';
}


function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
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
	$ ('#td-name').text (user [1] );
	$ ('#td-login').text (user [2] );
	$ ('#td-status').text (user [3] ? 'activo' : 'inactivo');
	$ ('#td-role').text (user [4] );
	if (user [4] == 'DFM') $ ('#td-entity').text ('(' + user [5] + ') ' + user [6] );
	else $ ('#tr-entity').hide ();
	$ ('#td-email').text (user [7] );
}

