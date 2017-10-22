var mysql = require('mysql');
var inquirer = require('inquirer');
// var updateItems = require('./bamazonCustomer.js');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

connection.connect(function(error) {
  if (error) throw error;
  // call info function to show products
  managerPrompt();
});


function managerPrompt() {
  inquirer.prompt([
  {
  	name: 'id',
  	type: 'list',
  	message: 'What would you like to do?',
  	choices: ['What is in stock?','Which items have 5 or less in stock?',
  		'Add more inventory.','New products have arrived!']
  },
  	]).then(function(response){
      var id = response.id;
      var units = response.units;
  		// checks the database for up-to-date data
  		connection.query("SELECT * FROM products WHERE id = " + id + ";", response, function (error, results) {
	 		if (id === 'What is in stock?') {
	 			listItems();
	 		} else if (id === 'Which items have 5 or less in stock?') {
	 			lowStock();
	 		}

  		});
  	})
  };

function listItems () {
  // display item_id, product_name, price
  connection.query("SELECT * FROM products",
  function(error, results) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
      console.log("ID " + results[i].id + " | " + results[i].product_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
    }
    // stocks the conection
    connectionEnd();
  });
};

function lowStock (id, units, quantity, results) {
  connection.query("SELECT * FROM products",
  function(error, results) {
    if (error) throw error;
	for (var i = 0; i < results.length; i++) {
    	if (results[i].stock_quantity < 5) {
    		console.log("ID " + results[i].id + " | " + results[i].product_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
    	}
    }
    connectionEnd();
  });
};

function connectionEnd () {
	connection.end();
};

