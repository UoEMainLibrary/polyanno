# polyanno_storage
Node and Express package for easy MongoDB storage of Polyanno annotations

The request mapping is :

![Table](https://pigeonsblue.files.wordpress.com/2017/01/polyannourltable.gif?w=648)

Each of the functions can be accessed individually if wanted, but the whole Express router (except the users routes for now) can be imported using **polyanno.router** allowing you to simply include the following in your server.js (or equivalent) file:

```
	var polyanno = require('polyanno_storage');
	app.use('/api', polyanno.router);

```

