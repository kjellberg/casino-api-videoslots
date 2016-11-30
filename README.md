# Videoslots Earnings scraper (videoslots.com)
## A node.js package for my "Casino Earnings"-Application

Collect stats as total earnings, clicks, signups and first time depositors for the current month.


### Install
```javascript
npm install -save casino-api-videoslots
```

### Example:
```javascript
var Videoslots = require('casino-api-videoslots');

new Videoslots({
	'username': 'affiliateusername',
	'password': 'mysecretpassword'
}, function(response) {
  console.log(response);
  /*
  { earnings: '543.61', clicks: '0', signups: '22', ftd: '8' }
  */
});
