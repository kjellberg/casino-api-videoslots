var nightmare = require('nightmare');
var cheerio = require('cheerio');

module.exports = function( params, SuccessCallback, ErrorCallback ) {
	this.username = params.username;
	this.password = params.password;
	this.nightmare = new nightmare({waitTimeout: 5000});

	function handleRequest( body ) {
		$ = cheerio.load(body);

		var earnings = $(".side-detail .amount").first().text();
		var clicks = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(2)").text()
		var signups = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(5)").text()
		var ftd = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(8)").text()
		
		SuccessCallback({
			'earnings': parseAmount(earnings),
			'clicks': parseAmount(clicks),
			'signups': parseAmount(signups),
			'ftd': parseAmount(ftd),
		});
	}

	function parseAmount(amount) {
		amount = amount.replace(/[^\d.-]/g, '');
		if (amount > 0) {
			return amount.replace(/[^\d.-]/g, '');
		} else {
			return 0;
		}
	}

	this.nightmare
		.goto('https://partner.videoslots.com/?signout=true')
		.click('#header-login button')
		.insert('#login_username', this.username)
		.insert('#login_password', this.password)
		.click('#submit_login')
		.wait(".side-detail .amount")
		.goto('https://partner.videoslots.com/reports/?action=general')
		.wait(".side-detail .amount")
		.click('a[href="#monthly"]')
		.wait(1000)
		.evaluate(function() {
			return document.body.innerHTML;
		})
		.then(function(body) {
			handleRequest(body);
		})
		.catch(function (error) {
			if (error == "Error: .wait() timed out after 5000msec") {
				error = "Wrong username, password or login limit (max once per 60 seconds) exceeded."
			}
			if (ErrorCallback) {
				ErrorCallback(error);
			} else {
				console.log(error);
			}
		});

};