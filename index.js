var Nightmare = require('nightmare');
var cheerio = require('cheerio');

module.exports = function(params, callback) {
	this.username = params.username;
	this.password = params.password;
	this.nightmare = new Nightmare({ show: true, dock: true });

	function handleRequest( body ) {
		$ = cheerio.load(body);

		var earnings = $(".side-detail .amount").first().text();
		var clicks = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(2)").text()
		var signups = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(5)").text()
		var ftd = $(".tbl-report-general-monthly tbody tr:nth-child(1) td:nth-child(8)").text()
		
		callback({
			'earnings': parseAmount(earnings),
			'clicks': parseAmount(clicks),
			'signups': parseAmount(signups),
			'ftd': parseAmount(ftd),
		});
	}

	function parseAmount(amount) {
		return amount.replace(/[^\d.-]/g, '');
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
			console.error('Exception:', error);
		});

};