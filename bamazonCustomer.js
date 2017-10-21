var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

connection.connect();

connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;

  // console.log('The solution is: ', results);
  	results.forEach(function (products, product_name) {
  		
  			console.log('------------------');
  			console.log(products.product_name);
  			console.log('------------------');
  		
  	});

});

function post() {
  inquirer.prompt([
  {
  	type: 'input',
  	message: 'What is your product name?',
  	name: 'item_name'
  },
  {
  	type: 'input',
  	message: 'What is the category?',
  	name: 'category'
  },
  {
  	type: 'input',
  	message: 'What is your starting bid?',
  	name: 'starting_bid'
  },

  	]).then(function(response){
  		response.starting_bid = parseInt(response.starting_bid);
  		connection.query('INSERT INTO auction SET ?', response, function (error, results, fields) {
  			if (error)
  					throw error;
  		});
  		connection.end();
  	})
  };



function noInventory () {
	console.log('Insufficient Quantity');
};

function end () {
	connection.end();
};