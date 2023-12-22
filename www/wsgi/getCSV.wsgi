import sys
sys.path.append ('/etc/spe/')
import json

from libspe.wsgi import handle

def application (env, _):
	try:
		qs = env ['QUERY_STRING']
		body = 'CSV file for qs {}'.format (qs)
	except Exception as ex:
		print ('Exception in getCSV.wsgi')
		headers = []
		print (type (ex) )
		print (ex)
		body = 'ERROR'

	status = '200 OK'
	body = body.encode ('utf-8')
	response_headers = [ ('Content-Disposition', 'attachment; filename=dasfile.csv'), ('Content-Type', 'text/csv'), ('Content-Length', str (len (body) ) ) ]
	_ (status, response_headers)
	return [body]
