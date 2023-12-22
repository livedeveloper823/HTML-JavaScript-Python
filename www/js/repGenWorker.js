$ (init);

function init ()
{
	var search = location.search.substring(1);
	var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	console.log (params);
	
	var cui = params ['c'];

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenWorker', 'p': {'c': cui} } ),
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
	var total1 = data ['p'] ['t1'];
	var total2 = data ['p'] ['t2'];
	var data = data ['p'] ['d'];

	$ ('#td-when').text (meta [0] );
	$ ('#td-who').text (meta [1] );
	$ ('#td-cui').html (formatCUI (meta [2] ) );
	$ ('#td-person').text (meta [3] );
	var trs = '';
	for (var idx in data)
	{
		var row = data [idx];
		trs += '<tr><td>' + escape (row [0] ) + '/' + escape (row [1] ) + '</td><td>' + escape (row [2] ) + '</td><td>' + escape (row [3] ) + '</td><td class="currency">Q ' + escape (row [4] ) + '</td><td class="currency">Q ' + escape (row [5] ) + '</td></tr>';
	}	
	trs += '<tr class="tr-sum"><td colspan="3">Total</td><td class="currency">Q ' + escape (total1) + '</td><td class="currency">Q ' + escape (total2) + '</td></tr>';
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

function formatCUI (cui)
{
	cui = '' + cui;
	cui = cui.substring (0, 4) + '&nbsp' + cui.substring (4, 9) + '&nbsp;' + cui.substring (9);
	return cui;
}

