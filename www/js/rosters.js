var filterVisible = false;
var page = 0;

$ (init);

function init ()
{
	initNav ();

	$ ('#btn-toggle-filter').text ('>');
	$ ('#filter-hider').hide ();
	filterVisible = false;
	$ ('#btn-toggle-filter').click (toggleFilter);
	$ ('#btn-filter').click (applyFilter);
	$ ('#btn-reset-filter').click (resetFilter);
	$ ('#btn-page-next').click (nextPage);
	$ ('#btn-page-next2').click (nextPage);
	$ ('#btn-page-prev').click (prevPage);
	$ ('#btn-page-prev2').click (prevPage);
	$ ('#btn-export-csv').click (exportCSV);
	$ ('#btn-export-pdf').click (exportPDF);
	$ (document).on ('keyup', function (e) {
	    if (e.keyCode == 13) {
		applyFilter ();
	  }
	} );

	loadPage ();
}

function nextPage ()
{
	page++;
	loadPage ();
}

function prevPage ()
{
	if (page == 0) return;
	page--;
	loadPage ();
}

function applyFilter ()
{
	page = 0;
	loadPage ();
}

function resetFilter ()
{
	$ ('#inp-since-month option:eq(0)').prop ('selected', true)
	$ ('#inp-until-month option:eq(0)').prop ('selected', true)
	$ ('#inp-status option:eq(0)').prop ('selected', true)
	$ ('#inp-entity').val ('');
	$ ('#inp-since-year').val ('');
	$ ('#inp-until-year').val ('');
	$ ('#inp-receipt').val ('');
	$ ('#inp-cui').val ('');
	page = 0;
	loadPage ();
}

function loadPage ()
{
	var entity = $ ('#inp-entity').val ().trim ();
	var sinceMonth = $ ('#inp-since-month').val ();
	var sinceYear = $ ('#inp-since-year').val ().trim ();
	var untilMonth = $ ('#inp-until-month').val ();
	var untilYear = $ ('#inp-until-year').val ().trim ();
	var status = $ ('#inp-status').val ();
	var receipt = $ ('#inp-receipt').val ().trim ();
	var cui = $ ('#inp-cui').val ().trim ();
	var params = {'p': page, 'e': entity, 'sm': sinceMonth, 'sy': sinceYear, 'um': untilMonth, 'uy': untilYear, 's': status, 'r': receipt, 'c': cui};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'pageRosters', 'p': params} ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onLoadPageSuccess (jqXHR, textStatus, data);
		}
	} );
}


function onLoadPageSuccess (jqXHR, textStatus, data, requestCode)
{
	if (filterVisible) toggleFilter ();
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];


	if (code == 'PRS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'PRS002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'PRS999')
	{
		window.location = 'error.html';
		return;
	}

	var rows = data ['p'] ['r'];
	var total = data ['p'] ['t'];
	page = data ['p'] ['p'];
	var pagesize = data ['p'] ['ps'];

	if (page == 0)
	{
		$('#btn-page-prev').hide ();
		$('#btn-page-prev2').hide ();
	}
	else
	{
		$('#btn-page-prev').show ();
		$('#btn-page-prev2').show ();
	}

	if ( (20 + page * pagesize) < total)
	{
		$('#btn-page-next').show ();
		$('#btn-page-next2').show ();
	}
	else
	{
		$('#btn-page-next').hide ();
		$('#btn-page-next2').hide ();
	}

	if (rows.length == 0)
	{
		$('#page-tbody').html ('');
		$('#page-text').text ('desplegando 0 a 0 de ' + total);
		$('#page-text2').text ('desplegando 0 a 0 de ' + total);
		return;
	}

	var html = '';
	for (var i in rows)
	{
		var row = rows [i];
		var code = row [0];
		var name = row [1];
		html += '<tr><td>' + escape ('' + row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td>' + escape (row [2] ) + '</td><td>' + escape (row [3] ) + '</td><td><span class="button" onclick="showRoster(' + escape ('' + row [0] ) + ')">Ver&nbsp;detalles</span></td></tr>';
	}
	$('#page-tbody').html (html);
	var pageText = 'desplegando ' + escape (pagesize * page + 1) + ' a ' + escape (pagesize * page + rows.length) + ' de ' + escape (total);
	$('#page-text').text (pageText);
	$('#page-text2').text (pageText);
}

function showRoster (uid)
{
	window.location = 'showRoster.html?' + uid;
}

function toggleFilter ()
{
	if (filterVisible)
	{
		$ ('#btn-toggle-filter').text ('>');
		$ ('#filter-hider').hide ();
		filterVisible = false;
	}
	else
	{
		$ ('#btn-toggle-filter').text ('<');
		$ ('#filter-hider').show ();
		filterVisible = true;
	}
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function escape (s)
{
	return $('<div>').text (s).html ()
}


function exportCSV ()
{
	exportAny ('csv')
}

function exportPDF ()
{
	exportAny ('pdf')
}

function exportAny (format)
{
	var entity = $ ('#inp-entity').val ().trim ();
	var sinceMonth = $ ('#inp-since-month').val ();
	var sinceYear = $ ('#inp-since-year').val ().trim ();
	var untilMonth = $ ('#inp-until-month').val ();
	var untilYear = $ ('#inp-until-year').val ().trim ();
	var status = $ ('#inp-status').val ();
	var receipt = $ ('#inp-receipt').val ().trim ();
	var cui = $ ('#inp-cui').val ().trim ();
	var params = {'ef': format, 'e': entity, 'sm': sinceMonth, 'sy': sinceYear, 'um': untilMonth, 'uy': untilYear, 's': status, 'r': receipt, 'c': cui};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'exportRosters', 'p': params} ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onExportSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onExportSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'ERS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'ERS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code != 'ERS999')
	{
		window.location = 'error.html';
		return;
	}

	var docId = data ['p'] ['docId'];
	window.open ('../wsgi/getDocument.wsgi?' + docId);
}

