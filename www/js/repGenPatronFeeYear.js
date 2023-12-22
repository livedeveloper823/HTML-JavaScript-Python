$ (init);

function init ()
{
	var search = location.search.substring(1);
	var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	console.log (params);
	var year = params ['y'];

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenPatronFeeYear', 'p': {'y': year} } ),
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
	var data = data ['p'] ['d'];

	$ ('#td-when').text (meta [0] );
	$ ('#td-who').text (meta [1] );
	$ ('#td-year').text (meta [2] );
	var trs = '';
	for (var idx in data)
	{
		var row = data [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td class="currency">Q ' + escape (row [2] ) + '</td><td>' + escape (row [3] ) + '</td></tr>';
	}	
	trs += '<tr class="tr-sum"><td colspan="2">Total</td><td class="currency">Q ' + escape (total) + '</td><td></td></tr>';
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
