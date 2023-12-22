import sys
sys.path.append ('/etc/spe/')
import json

from libspe.wsgi import handle

def application (env, _):
	try:
		print ('Reading input in app.wsgi')
		inp = env ['wsgi.input'].read ().decode ('utf-8')
		print ('Parsing json in app.wsgi')
		print ('Input is {}'.format (inp) )
		jData = json.loads (inp)
		print ('Handling data in app.wsgi')
		body, headers = handle (jData, env)
		body = json.dumps (body)
	except Exception as ex:
		print ('Exception in app.wsgi')
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
