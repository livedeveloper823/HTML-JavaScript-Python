import sys
sys.path.append ('/etc/spe/')
import json

from libspe.persons import getPhotograph

def application (env, _):
	try:
		qs = int (env ['QUERY_STRING'] )
		print ('pregetting getPersonPhotograph pdf {}'.format (qs) )
		status, data, filename = getPhotograph (qs, None, env)
		print ('got getPersonPhotograph pdf {}'.format (filename) )
	except Exception as ex:
		print ('exception getting getPersonPhotograph: {}'.format (ex) )
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
		response_headers = [ ('Content-Disposition', 'attachment; filename="{}"'.format (filename) ), ('Content-Type', 'image/jpeg'), ('Content-Length', str (len (body) ) ) ]

	_ (status, response_headers)
	return [body]
