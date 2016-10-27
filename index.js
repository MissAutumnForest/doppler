const express = require("express");
let app = express();

app.use(express.static('dist'));

app.listen(7000, () => {
	console.log("Server started on port 7000!");
});
