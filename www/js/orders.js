var filterVisible = false;
var departments = null;
var municipalities = null;
var entities = null;
var page = 0;

$ (init);

function init ()
{
	initNav ();

	loadDepartments ();

	$ ('#sel-status option:eq(0)').prop ('selected', true)
	$ ('#btn-toggle-filter').text ('>');
	$ ('#filter-hider').hide ();
	filterVisible = false;
	$ ('#btn-toggle-filter').click (toggleFilter);
	$ ('#sel-department').change (onDepartmentChanged);
	$ ('#sel-municipality').change (onMunicipalityChanged);
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
	$ ('#sel-status option:eq(0)').prop ('selected', true)
	$ ('#sel-department option:eq(0)').prop ('selected', true)
	$ ('#sel-municipality option:eq(0)').prop ('selected', true)
	$ ('#sel-entity option:eq(0)').prop ('selected', true)
	$ ('#inp-uid').val ('');
	page = 0;
	loadPage ();
}

function loadPage ()
{
	var uid = $ ('#inp-uid').val ().trim ();
	var status = $ ('#sel-status').val ();
	var depto = $ ('#sel-department').val ();
	var muni = $ ('#sel-municipality').val ();
	var entity = $ ('#sel-entity').val ();

	var params = {'p': page, 'i': uid, 's': status, 'd': depto, 'm': muni, 'e': entity};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'pageOrders', 'p': params} ),
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


	if (code == 'PPO001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'PPO002')
	{
		window.location = 'nopermission.html';
		return;
	}


	if (code != 'PPO999')
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
		var fee = row [1];
		if (fee == 'P') fee = 'patronal';
		if (fee == 'L') fee = 'laboral';
		var status = row [4];
		if (row [8] ) status = 'aceptada';
		if (row [9] ) status = 'rechazada';
		html += '<tr><td>' + escape ('' + row [0] ) + '</td><td>' + escape (fee) + '</td><td>' + escape ('' + row [6] + '/' + row [7] ) + '</td><td>' + escape (row [2] ) + ' (' + escape (row [3] ) + ')</td><td>' + escape (status) + '</td><td>' + escape (row [5] ) + '</td><td><span class="button" onclick="showOrder(' + escape (row [0] ) + ')">Ver&nbsp;detalles</span></td></tr>';
	}
	$('#page-tbody').html (html);
	var pageText = 'desplegando ' + escape (pagesize * page + 1) + ' a ' + escape (pagesize * page + rows.length) + ' de ' + escape (total);
	$('#page-text').text (pageText);
	$('#page-text2').text (pageText);
}

function showOrder (uid)
{
	console.log ('showUser ' + uid);
	window.location = 'showOrder.html?' + uid;
}

function onMunicipalityChanged ()
{
	console.log ('onmunichanged');
	var department = $ ('#sel-department').val ();
	var municipality = $ ('#sel-municipality').val ();
	var html = '<option value="0">todas</option>';
	for (var i in entities)
	{
		var entity = entities [i];
		console.log (entity);
		if (! filterEntity (department, municipality, entity) ) continue;
		html += '<option value="' + entity [0] + '">' + escape ('(' + entity [0] + ') ' + entity [1] ) + '</option>';
	}
	$ ('#sel-entity').html (html);
}

function onDepartmentChanged ()
{
	console.log ('ondptochanged');
	var department = $ ('#sel-department').val ();
	var html = '<option value="0">todos</option>';
	for (var i in municipalities)
	{
		var muni = municipalities [i];
		if (muni [0] != department) continue;
		html += '<option value="' + muni [1] + '">' + escape (muni [2] ) + '</option>';
	}
	$ ('#sel-municipality').html (html);
	$ ('#sel-entity').html ('<option value="0">todas</option>');
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

function onGetDepartmentsSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code != 'GDP999')
		return;

	departments = data ['p'] ['d'];
	municipalities = data ['p'] ['m'];
	entities = data ['p'] ['e'];
	populateDepartments ();
}

function populateDepartments ()
{
	if (departments === null) return;
	var html = '<option value="0">todos</option>';
	for (var i in departments)
		html += '<option value="' + i + '">' + escape (departments [i] ) + '</option>';
	$ ('#sel-department').html (html);
	$ ('#sel-municipality').html ('<option value="0">todos</option>');
	$ ('#sel-entity').html ('<option value="0">todas</option>');
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
	var uid = $ ('#inp-uid').val ().trim ();
	var status = $ ('#sel-status').val ();
	var depto = $ ('#sel-department').val ();
	var muni = $ ('#sel-municipality').val ();
	var entity = $ ('#sel-entity').val ();

	var params = {'ef': format, 'i': uid, 's': status, 'd': depto, 'm': muni, 'e': entity};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'exportOrders', 'p': params} ),
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

	if (code == 'EPO001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'EPO002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code != 'EPO999')
	{
		window.location = 'error.html';
		return;
	}

	var docId = data ['p'] ['docId'];
	window.open ('../wsgi/getDocument.wsgi?' + docId);
}

