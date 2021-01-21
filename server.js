const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var path = require('path');
const port = 8080;
const sqlite3 = require('sqlite3').verbose();  //import module
var db;		
	
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '/')));

//render html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
});

//handle post
app.post('/handle-form', (req, res) => {
	openDB();
		db.run(`INSERT INTO answers (
							FirstName,
							LastName
						)
						VALUES (
						'${req.body.fname}',
						'${req.body.lname}')`, (err, row) => {
				if (err) {
				  console.error(err.message);
				  closeDB();
				}
				printDB(err,closeDB);
				res.redirect('thanks.html');
		  });
});

//listen
app.listen(port, () => {
  console.log(`Server running on port${port}`);
});


function openDB(){
	//create/open a DB object
	db = new sqlite3.Database('./db/surs.db', sqlite3.OPEN_READWRITE, (err) => {
		if(err){
			return console.error(err.message);
		}
		console.log('Connected to the surs SQlite database.');
	}); 
}
			
function printDB(err, callback){
	
			//print
//		db.serialize(() => {
		  db.get(`SELECT FirstName as fname,
				   LastName as lname
					FROM answers ORDER BY rowid  DESC LIMIT 1`, (err, row) => {
			if (err) {
			  console.error(err.message);
			}
			console.log(row.fname + "\t" + row.lname);
		  });
//		});
		callback();
}	
			
function closeDB(){
		// close the database connection
		db.close((err) => {
		  if (err) {
			return console.error(err.message);
		  }
		  console.log('Close the database connection.');
		});	
}
			
		

	
	