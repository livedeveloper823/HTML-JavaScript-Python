import sys
sys.path.append ('/etc/spe/')
import json

from libspe.document import getDocument

def application (env, _):
	try:
		qs = int (env ['QUERY_STRING'] )
		print ('pregetting document {}'.format (qs) )
		status, data, header, filename = getDocument (qs, None, env)
	except Exception as ex:
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
