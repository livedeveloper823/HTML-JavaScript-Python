import sys
sys.path.append ('/etc/spe/')
import json

from libspe.rosters import getRosterOCSV

def application (env, _):
	try:
		qs = int (env ['QUERY_STRING'] )
		print ('pregetting rosdter pdf {}'.format (qs) )
		status, data, header, filename = getRosterOCSV (qs, None, env)
		print ('got rosdter pdf {}'.format (filename) )
	except Exception as ex:
		print ('exception getting roster: {}'.format (ex) )
		status = '400 Bad Request'
		body = 'error'
		body = body.encode ('utf-8')
		response_headers = [ ('Content-Length', str (len (body) ) ) ]
		_ (status, response_headers)
		return [body]

	if status != '200 OK':
		body = 'error'
		body = body.encode ('utf-8')
		response_headers = [ ('Content-Length', str (len (body) ) ) ]
	else:
		body = data
		response_headers = [ ('Content-Disposition', 'attachment; filename={}'.format (filename) ), ('Content-Type', header), ('Content-Length', str (len (body) ) ) ]

	_ (status, response_headers)
	return [body]
