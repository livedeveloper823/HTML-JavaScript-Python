$ (init);

function init ()
{
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenJuridical', 'p': {} } ),
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
	var total = data ['p'] ['t'];
	var total2 = data ['p'] ['t2'];
	var data = data ['p'] ['d'];

	$ ('#td-when').text (meta [0] );
	$ ('#td-who').text (meta [1] );
	$ ('#td-monthyear').text (meta [2] );
	$ ('#s-monthyear').text (meta [2] );
	var trs = '';
	for (var idx in data)
	{
		var row = data [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td>' + escape (row [2] ) + '</td><td>' + escape (row [3] ) + '</td></tr>';
	}	
	
	$ ('#theBody').html (trs);
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
