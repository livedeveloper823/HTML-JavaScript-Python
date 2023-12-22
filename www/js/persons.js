var filterVisible = false;
var departments = null;
var municipalities = null;
var entities = null;
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
	$ ('#btn-create').click (onCreatePerson);
	$ (document).on ('keyup', function (e) {
	    if (e.keyCode == 13) {
		applyFilter ();
	  }
	} );
	loadPage ();
}

function onCreatePerson ()
{
	window.location = 'createPerson.html';
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
	$ ('#inp-cui').val ('');
	$ ('#inp-first').val ('');
	$ ('#inp-last').val ('');
	page = 0;
	loadPage ();
}

function loadPage ()
{
	var cui = $ ('#inp-cui').val ().trim ();
	var first = $ ('#inp-first').val ().trim ();
	var last = $ ('#inp-last').val ().trim ();

	var params = {'p': page, 'c': cui, 'f': first, 'l': last};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'pagePersons', 'p': params} ),
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


	if (code == 'PPR001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'PPR002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'PPR999')
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
		var status = 'ignorado';
		if (row [5] == 'J') status = 'jubilado';
		if (row [5] == 'A') status = 'activo';
		if (row [5] == 'S') status = 'suspendido';
		if (row [5] == 'D') status = 'deceso';
		html += '<tr><td>' + formatCUI (row [0] ) + '</td><td>' + escape (row [1] ) + '</td><td>' + escape ('' + row [2] ) + '</td><td>' + escape (row [3] ) + '</td><td>' + escape (row [4] ) + '</td><td>' + escape (status) + '</td><td><span class="button" onclick="showPerson (' + escape (row [0] ) + ')">Ver&nbsp;detalles</span></td></tr>';
	}
	$('#page-tbody').html (html);
	var pageText = 'desplegando ' + escape (pagesize * page + 1) + ' a ' + escape (pagesize * page + rows.length) + ' de ' + escape (total);
	$('#page-text').text (pageText);
	$('#page-text2').text (pageText);
}

function formatCUI (cui)
{
	cui = '' + cui;
	cui = cui.substring (0, 5) + '&nbsp' + cui.substring (5, 9) + '&nbsp;' + cui.substring (9);
	return cui;
}

function showPerson (uid)
{
	window.location.replace ('../static/editPerson.html?' + uid);
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

function loadDepartments ()
{
	console.log ('loadDepartments');
	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'getDepartments', 'p': {} } ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onGetDepartmentsSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}


function escape (s)
{
	return $('<div>').text (s).html ()
}

function filterEntity (dpto, muni, entity)
{
	return entity [2] == muni && entity [3] == dpto;
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
	var cui = $ ('#inp-cui').val ().trim ();
	var first = $ ('#inp-first').val ().trim ();
	var last = $ ('#inp-last').val ().trim ();

	var params = {'ef': format, 'c': cui, 'f': first, 'l': last};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'exportPersons', 'p': params} ),
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

	if (code == 'EPS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'EPS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code != 'EPS999')
	{
		window.location = 'error.html';
		return;
	}

	var docId = data ['p'] ['docId'];
	window.open ('../wsgi/getDocument.wsgi?' + docId);
}

