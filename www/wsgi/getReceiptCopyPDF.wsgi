import sys
sys.path.append ('/etc/spe/')
import json

from libspe.document import getReceiptCopy

def application (env, _):
	try:
		qs = int (env ['QUERY_STRING'] )
		print ('pregetting getReceipt pdf {}'.format (qs) )
		status, data, filename = getReceiptCopy (qs, None, env)
		print ('got getReceipt pdf {}'.format (filename) )
	except Exception as ex:
		print ('exception getting getReceipt: {}'.format (ex) )
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
		response_headers = [ ('Content-Disposition', 'attachment; filename="{}"'.format (filename) ), ('Content-Type', 'application/pdf'), ('Content-Length', str (len (body) ) ) ]

	_ (status, response_headers)
	return [body]
