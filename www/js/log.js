var filterVisible = false;
var page = 0;

$ (init);

function init ()
{
	initNav ();

	$ ('#btn-toggle-filter').text ('<');
	$ ('#filter-hider').show ();
	$ ('#div-error').hide ();
	$ ('#div-error-exp').hide ();
	filterVisible = true;
	$ ('#btn-toggle-filter').click (toggleFilter);
	$ ('#btn-filter').click (applyFilter);
	$ ('#btn-reset-filter').click (resetFilter);
	$ ('#btn-export-csv').click (exportCSV);
	$ ('#btn-export-pdf').click (exportPDF);
	$ ('#btn-page-next').click (nextPage);
	$ ('#btn-page-next2').click (nextPage);
	$ ('#btn-page-prev').click (prevPage);
	$ ('#btn-page-prev2').click (prevPage);

	$ (document).on ('keyup', function (e) {
	    if (e.keyCode == 13) {
		applyFilter ();
	  }
	} );
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
	$ ('#inp-since').val ('');
	$ ('#inp-until').val ('');
	$ ('#inp-user').val ('');
	$ ('#inp-message').val ('');
	page = 0;
	loadPage ();
}

function loadPage ()
{
	$ ('#div-error').hide ();
	$ ('#div-error-exp').hide ();
	var since = $ ('#inp-since').val ().trim ();
	var until = $ ('#inp-until').val ().trim ();
	var user = $ ('#inp-user').val ().trim ();
	var message = $ ('#inp-message').val ().trim ();
	var params = {'s': since, 'v': until, 'u': user, 'm': message, 'p': page};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'pageLog', 'p': params} ),
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


	if (code == 'PLG001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'PLG002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'PLG003')
	{
		var html = '<p>La bitácora no se pudo desplegar por la siguiente razón:</p><ul>';
		for (var i in data ['p'] ['e'] )
		{
			html += '<li>' + escape (data ['p'] ['e'] [i] ) + '</li>';
		}
		html += '</ul></p>';
		$ ('#div-error').html (html);
		$ ('#div-error').show ();
		return;
	}

	if (code != 'PLG999')
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
		var when = row [0];
		var user = row [1];
		var role = row [2];
		var message = row [3];

		var newDate = new Date (when * 1000);
		var dateString = newDate.toLocaleString ('es-ES');
		html += '<tr><td>' + dateString.replace (/ /g, '&nbsp;') + '</td><td>' + escape (user) + '</td><td>' + escape (role) + '</td><td>' + escape (message) + '</td></tr>';
	}
	$('#page-tbody').html (html);
	var pageText = 'desplegando ' + escape (pagesize * page + 1) + ' a ' + escape (pagesize * page + rows.length) + ' de ' + escape (total);
	$('#page-text').text (pageText);
	$('#page-text2').text (pageText);
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
	$ ('#div-error-exp').hide ();

	var since = $ ('#inp-since').val ().trim ();
	var until = $ ('#inp-until').val ().trim ();
	var user = $ ('#inp-user').val ().trim ();
	var message = $ ('#inp-message').val ().trim ();
	var params = {'ef': format, 's': since, 'v': until, 'u': user, 'm': message};

	console.log (params);

	var jqXHR = $.ajax ( {
		url: '../wsgi/app.wsgi',
		contentType: 'application/json',
		type: 'POST',
		data: JSON.stringify ( {'f': 'exportLog', 'p': params} ),
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onExportCSVSuccess (jqXHR, textStatus, data);
		}
	} );
}

function onExportCSVSuccess (jqXHR, textStatus, data, requestCode)
{
	console.log (data);
	
	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}

	var code = data ['c'];

	if (code == 'ELG001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'ELG002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'ELG003')
	{
		var html = '<p>La bitácora no se pudo desplegar por la siguiente razón:</p><ul>';
		for (var i in data ['p'] ['e'] )
		{
			html += '<li>' + escape (data ['p'] ['e'] [i] ) + '</li>';
		}
		html += '</ul></p>';
		$ ('#div-error-exp').html (html);
		$ ('#div-error-exp').show ();
		return;
	}


	if (code != 'ELG999')
	{
		window.location = 'error.html';
		return;
	}

	var docId = data ['p'] ['docId'];
	window.open ('../wsgi/getDocument.wsgi?' + docId);
}

