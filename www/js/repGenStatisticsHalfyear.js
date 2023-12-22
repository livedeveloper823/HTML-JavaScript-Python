$ (init);

function init ()
{
	var search = location.search.substring(1);
	var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	console.log (params);
	var year = params ['y'];
	var half = params ['h'];

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'repGenStatisticsHalfyear', 'p': {'y': year, 'h': half} } ),
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
	$ ('#td-half').text (meta [4] );

	$ ('#s-uploaded').text (data [2] );
	$ ('#s-payed').text (data [3] );
	uploadedWidth = '0%';
	payedWidth = '0%';
	if (data [2] > data [3] )
	{
		uploadedWidth = '100%';
		payedWidth = '' + Math.floor (100.0 * data [3] / data [2] ) + '%';
	}
	else
	{
		uploadedWidth = '' + Math.floor (100.0 * data [2] / data [3] ) + '%';
		payedWidth = '100%';
	}
	$ ('#bar-uploaded').css ('width', uploadedWidth);
	$ ('#bar-payed').css ('width', payedWidth);

	$ ('#s-workerFee').text (data [0] );
	$ ('#s-patronFee').text (data [1] );
	workerWidth = '0%';
	patronWidth = '0%';
	if (data [4] > data [5] )
	{
		workerWidth = '100%';
		patronWidth = '' + Math.floor (100.0 * data [5] / data [4] ) + '%';
	}
	else
	{
		workerWidth = '' + Math.floor (100.0 * data [4] / data [5] ) + '%';
		patronWidth = '100%';
	}
	$ ('#bar-workerFee').css ('width', workerWidth);
	$ ('#bar-patronFee').css ('width', patronWidth);

	var agreements = data [6];

	var trs = '';
	for (var idx in agreements)
	{
		var row = agreements [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td>' + escape (row [2] ) + '</td></tr>';
	}	
	$ ('#agreementsBody').html (trs);

	var workerOnTime = data [7];
	$ ('#s-cut').text (meta [3] );
	var trs = '';
	for (var idx in workerOnTime)
	{
		var row = workerOnTime [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td></tr>';
	}	
	$ ('#workerOnTimeBody').html (trs);

	var workerNotOnTime = data [8];
	$ ('#s-cut2').text (meta [3] );
	var trs = '';
	for (var idx in workerNotOnTime)
	{
		var row = workerNotOnTime [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td></tr>';
	}	
	$ ('#workerNotOnTimeBody').html (trs);

	var patronOnTime = data [9];
	$ ('#s-cut3').text (meta [3] );
	var trs = '';
	for (var idx in patronOnTime)
	{
		var row = patronOnTime [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td></tr>';
	}	
	$ ('#patronOnTimeBody').html (trs);

	var patronNotOnTime = data [10];
	$ ('#s-cut4').text (meta [3] );
	var trs = '';
	for (var idx in patronNotOnTime)
	{
		var row = patronNotOnTime [idx];
		trs += '<tr><td>' + escape (row [0] ) + '</td><td>' + escape (row [1] ) + '</td></tr>';
	}	
	$ ('#patronNotOnTimeBody').html (trs);
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}
