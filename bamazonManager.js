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
	 		} else if (id === 'Add more inventory.'){
	 			inquirer.prompt([
	 			{
	 				name: 'ID',
	 				type: 'input',
	 				message: 'Which item (ID)?',
				    validate: function(value) {
				          if (isNaN(value) === false) {
				            return true;
				          }
				          return false;
				        }
	 			},
	 			{
	 				name: 'number',
	 				type: 'input',
	 				message: 'How much are we adding to inventory?'
	 				validate: function(value) {
				          if (isNaN(value) === false) {
				            return true;
				          }
				          return false;
				        }
	 			}
	 			]).then(function(response){
	 				var idUpdate = parseInt(response.ID);
	 				console.log(idUpdate);
					var update = parseInt(response.number);
	 				connection.query('SELECT * FROM products WHERE id = ' + idUpdate + ';', response,
	 					function(error, results)
	 					{
	 						if (error) throw error;
						var recent = results[0].stock_quantity;

	 					updateInventory();
	 					});
	 			});
	 			
	 		}
  		})
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

function updateInventory(response, update,  idUpdate, recent) {
	var quantity = recent + update;
	connection.query('UPDATE products SET ? WHERE ?',
	[
		{
			stock_quantity: quantity
		},
		{
			id: idUpdate
		},
	
		function(error){
			if (error) throw error;
		}
	]);
	connectionEnd();
};


function connectionEnd () {
	connection.end();
};

