
var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Reo@1199",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayItems();

});

function displayItems(){
    console.log("Welcome to bamazon!!");
    connection.query(
        "SELECT item_id, product_name, price FROM products ", function (err, res) {
            if (err) throw err;
            // console.log(res);
            for (var i = 0; i < res.length; i++){
                console.log(`ID: ${res[i].item_id} \nName: ${res[i].product_name} \nPrice: ${res[i].price}`);
                console.log("___________________________________________________________________________");
            }
            customerPurchase();
           
        }
    );
};

function customerPurchase(){
    inquirer.prompt([
        {
            message: "Enter product ID to purchase:",
            name: "itemID"
        },
        {
            message: "How many units?",
            name: "units"
        }
    ]).then(function(answers){
        connection.query("SELECT * FROM products", function(err, res){
            if (err) throw err;
            var chosenItem;
            for (var i = 0; i < res.length; i++){
                if(parseInt(answers.itemID) === res[i].item_id){
                    chosenItem = res[i];
                }
            }
            if(chosenItem.stock_quantity >= parseInt(answers.units)){
                connection.query("UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity: (chosenItem.stock_quantity - parseInt(answers.units))
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function(err, res){
                        if(err) throw err;
                        console.log("Order successful! Your total is $" + chosenItem.price * parseInt(answers.units));
                        connection.end();
                    }
                );
            }
            else {
                console.log("Insufficient stock!");
                customerPurchase();

            }
        });
    });
};


