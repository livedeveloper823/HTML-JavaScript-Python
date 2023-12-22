$ (init);

function init ()
{
	initNav ();

	$ ('#btn-upload').click (uploadRoster);
	$ ('#canvas2').hide ();
	$ ('#canvas3').hide ();
	$ ('#p-nofile').hide ();
	$ ('#btn-cancel').click (navigateBack);
	$ ('#btn-cancel2').click (navigateBack);
}

function navigateBack ()
{
	window.location = 'dfm_rosters.html';
}

function uploadRoster ()
{
	$ ('#p-nofile').hide ();
	var fileInput = $('#inp-csv') [0];
	var file = fileInput.files [0];
	if (file == undefined)
	{
		$ ('#p-nofile').text ('Elija primero un archivo.');
		$ ('#p-nofile').show ();
		return;
	}
	var size = file.size;
	var extension = (file.name.slice (-4) );
	if (extension != '.csv' && extension != '.CSV')
	{
		$ ('#p-nofile').text ('Elija un archivo en formato CSV.');
		$ ('#p-nofile').show ();
		return;
	}
	if (size > 10000000)
	{
		$ ('#p-nofile').text ('El archivo está muy grande.');
		$ ('#p-nofile').show ();
		return;
	}

	$ ('#canvas1').hide ();
	$ ('#canvas2').show ();
	$ ('#div-error').hide ();


	var fdata = new FormData ();
	fdata.append ('csv', file);

	var jqXHR = $.ajax ( {
		url: '../wsgi/uploadRoster.wsgi',
		type: 'POST',
		contentType: false,
		data: fdata,
		processData: false,
		error: function (jqXHR, textStatus, errorThrown)
		{
			onAjaxError (jqXHR, textStatus, errorThrown);
		},
		success: function (data, textStatus, jqXHR)
		{
			onUploadSuccess (jqXHR, textStatus, data);
		}
	} );
}



function onAjaxError (jqXHR, textStatus, errorThrown, requestCode)
{
	window.location = 'error.html';
}

function onUploadSuccess (jqXHR, textStatus, data)
{
	console.log (data);

	if ( !('c' in data) )
	{
		window.location = 'error.html';
		return;
	}
	var code = data ['c'];

	
	if (code == 'URS001')
	{
		window.location = 'nosession.html';
		return;
	}

	if (code == 'URS002')
	{
		window.location = 'nopermission.html';
		return;
	}

	if (code == 'URS003')
	{
		var html = '<p>La planilla no se ha cargado por la siguiente razón:</p><ul>';
		for (var i in data ['p'] ['e'] )
		{
			html += '<li>' + escape (data ['p'] ['e'] [i] ) + '</li>';
		}
		html += '</ul></p>';
		$ ('#div-error').html (html);
		$ ('#div-error').show ();
		$ ('#canvas1').show ();
		$ ('#canvas2').hide ();
		return;
	}

	if (code != 'URS999')
	{
		window.location = 'error.html';
		return;
	}

	$ ('#canvas3').show ();
	$ ('#canvas2').hide ();
	$ ('#canvas1').hide ();

}

function escape (s)
{
	return $('<div>').text (s).html ()
}

