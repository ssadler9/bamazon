var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

connection.connect(function(error) {
  if (error) throw error;
  // call info function to show products
  listItems();
});


function listItems () {
  // display item_id, product_name, price
  connection.query("SELECT * FROM products",
  function(error, results) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
      console.log("ID " + results[i].id + " | " + results[i].product_name + " | $" + results[i].price);
    }
    // run the function to prompt user
    customerPrompt();
  });
};


function customerPrompt() {
  inquirer.prompt([
  {
  	type: 'input',
  	message: 'What is item ID would you like to purchace?',
  	name: 'id'
  },
  {
  	type: 'input',
  	message: 'How many do you want?',
  	name: 'units'
  },
  	]).then(function(response){
      var id = response.id;
      var units = response.units;
  		// checks the database for up-to-date data
  		connection.query("SELECT * FROM products WHERE id = " + id + ";", response, function (error, results) {
  			if (error)
  					throw error;
          // checks quantity in stock and stores in variable
        var quantity = parseInt(results[0].stock_quantity);
        // turns the price into a value
        var price = parseInt(results[0].price);
        var cost = units * price;
        var remaining = quantity - units;
        if (quantity === 0 || remaining < 0 ) {
          noInventory();
        } else {
          console.log('Total cost: ' + cost);
          updateInventory(id, units, quantity);
        }
  		});
  	})
  };

function updateInventory (id, units, quantity) {
  var quantity = quantity - units;
  connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: quantity
              },
              {
                id: id
              },
            ],
            function(error) {
              if (error) throw error;
            }
          );
  connectionEnd();
};


function noInventory () {
	console.log('Insufficient Quantity');
};

function connectionEnd () {
	connection.end();
};