import sys
sys.path.append ('/etc/spe/')
import json
import cgi
from libspe.persons import uploadPhotograph

def application (env, _):
	try:
		form = cgi.FieldStorage (fp=env['wsgi.input'], environ=env, keep_blank_values = True)
		fname = form ['image'].filename
		raw = form ['image'].value
		cui = form ['cui'].value
		body, headers = uploadPhotograph ( {}, env, raw, cui)
		body = json.dumps (body)
	except Exception as ex:
		print ('Exception in uploadPhotograph.wsgi')
		headers = []
		print (type (ex) )
		print (ex)
		body = json.dumps ( {'r': False, 'm': 'Ha ocurrido un error: {}'.format (ex) } )

	status = '200 OK'
	body = body.encode ('utf-8')
	response_headers = headers + [ ('Content-Length', str (len (body) ) ) ]
	if all (a != 'Content-Type' for a, b in response_headers):
		response_headers += [ ('Content-Type', 'application/json') ]
	_ (status, response_headers)
	return [body]
