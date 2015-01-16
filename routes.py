from flask import *
from functools import wraps
from flask import request
from flask import session, url_for, escape, redirect
import requests
import json
import urllib2
import base64
import urllib
from flask import render_template

app = Flask(__name__)
app.secret_key = '3030293942' #bad practice

buying = False
selling = False
error = True
data = ''

@app.route('/', methods=['GET', 'POST'])
def home():
	if 'username' in session:
		return redirect(url_for('success'))
	if request.method == 'POST':
		if 'username' not in session:
			session['stocks'] = {}
			session['amount'] = 10000
			return "still working"
			session['amount'] = 10000
			session['username'] = request.form['username']
			return "dskfhsdklf"
		return redirect(url_for('success'))
	return render_template('home.html')

@app.route('/success', methods=['GET', 'POST'])
def success():
	error = True
	global data
	if request.method == ('POST' or 'GET'):
		buystock = request.form['buystock']
		r = requests.get('http://data.benzinga.com/stock/' + buystock)
		r.text
		data = json.loads(r.text)
		if 'msg' in data: #incorrect
			return redirect(url_for('error'))
		else: #correct
			return redirect(url_for('stocksuccess'))
	return render_template('success.html')

@app.route('/error')
def error():
	return render_template('error.html')

@app.route('/stocksuccess', methods=['GET', 'POST'])
def stocksuccess():
	global buying
	global selling
	if request.method == ('POST' or 'GET'):
		if request.form['submit'] == 'buy':
			print "BUY"
			buying = True
			selling = False
			return redirect(url_for('quantity'))
		else:
			print "SELL"
			if(data['symbol'] not in session['stocks']):
				buying = False
				selling = False
				return redirect(url_for('error'))
			buying = False
			selling = True
			return redirect(url_for('quantity'))
		return redirect(url_for('error'))
	return render_template('stocksuccess.html')

@app.route('/quantity', methods=['GET', 'POST'])
def quantity():
	global data
	if request.method == ('POST' or 'GET'):
		quantity = request.form['quantity']
		quantity = int(quantity)
		session['amount'] = float(session['amount'])
		if quantity < 1:
			return redirect(url_for('error.html'))
		if buying:
			bid = float(data['bid'])
			total = bid * quantity
			print total
			if (round(total, 2)) > (round(session['amount'],2)):
				return redirect(url_for('error'))
			else:
				session['amount'] -= total
				if session['stocks'].has_key(data['symbol']):
					session['stocks'][data['symbol']] += quantity
				else:
					session['stocks'][data['symbol']] = quantity
				return redirect(url_for('success'))
			return redirect(url_for('success'))
		else:
			ask = float(data['ask'])
			if data['symbol'] in session['stocks']:
				if quantity > session['stocks'][data['symbol']]:
					return redirect(url_for('error'))
				else:
					print "ERROR"
					if quantity == session['stocks'][data['symbol']]:
						print "WOMP"
						del session['stocks'][data['symbol']]
						session['amount'] += (float(data['ask']) * quantity)
						return redirect(url_for('success'))
					else:
						print "WOMPERS"
						session['stocks'][data['symbol']] -= quantity
						session['amount'] += (float(data['ask']) * quantity)
						return redirect(url_for('success'))
					return redirect(url_for('error'))
			else:
				return redirect(url_for('error.html'))
		return redirect(url_for('error'))
	return render_template('quantity.html')

@app.route('/welcome')
def welcome():
	return render_template('welcome.html')

@app.route('/log', methods=['GET', 'POST'])
def log():
	error = None
	if request.method == 'POST':
		if request.form['username'] != 'admin':
			error = 'Invalid Credentials, Try Again.'
		else:
			return redirect(url_for('hello'))
	return render_template('log.html')


if __name__ == '__main__':
	app.run(debug=True)