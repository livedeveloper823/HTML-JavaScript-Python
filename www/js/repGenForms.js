$ (init);

function init ()
{
	var search = location.search.substring(1);
	var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	console.log (params);
	
	var since = params ['s'];
	var until = params ['u'];

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenForms', 'p': {'s': since, 'u': until} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGenerateSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onGenerateSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'blank.html';
		return;
	}

	var code = data ['c'];

	if (code != 'GRP999')
	{
		window.location = 'blank.html';
		return;
	}

	var meta = data ['p'] ['m'];
	var data2 = data ['p'] ['d2'];
	var data = data ['p'] ['d'];

	$ ('#td-when').text (meta [0] );
	$ ('#td-who').text (meta [1] );
	$ ('#s-since').text (meta [2] );
	$ ('#s-until').text (meta [3] );
	$ ('#s-firstOut').text (data [0] );
	$ ('#s-lastOut').text (data [1] );
	$ ('#s-out').text (data [2] );
	$ ('#s-firstIn').text (data2 [0] );
	$ ('#s-lastIn').text (data2 [1] );
	$ ('#s-in').text (data2 [2] );
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
