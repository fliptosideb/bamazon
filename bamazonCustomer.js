const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')

const db = createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'bamazon',
    database: 'bamazon'
})

const buy = _ => {
    const inventory = []
    db.query(`SELECT * FROM products`, function (err, res) {
        if (err) throw err
        console.table(res);
        for (let i = 0; i < res.length; i++) {
            inventory.push({
                'value': res[i].id,
                'name': res[i].product_name
            })
        }
        prompt([{
            type: 'input',
            name: 'product',
            message: 'Enter the ID of the product you want to Purchase.',
        }, {
            type: 'input',
            name: 'amt',
            message: 'How many would you like to purchase?',
        }])
            .then(answer => {
                let cart;
                for (let i = 0; i < res.length; i++) {
                    if (parseInt(res[i].id) === parseInt(answer.product)) {
                        cart = res[i]
                    }
                }
                bought(cart.id, answer.amt);

            }
            )
    })
}

const grandTotal = [];
function invoice(total, num) {
    return total + num
}

const allItems = [];

const bought = (pid, quant) => {
    db.query(`SELECT * FROM products WHERE id = ${pid}`, function (err, res) {
        if (err) { console.log(err) }
        if (quant <= res[0].stock_quantity) {
            let total = res[0].price * quant
            let item = res[0].product_name
            allItems.push(`${item} | $${res[0].price} x ${quant}`)
            console.log(`
            ${item} | $${res[0].price} x ${quant}
            Your total is $${total}.`)
            db.query(`UPDATE products SET stock_quantity = stock_quantity - ${quant} WHERE id = ${pid}`)
            grandTotal.push(total)
        } else {
            console.log(`Insufficient quantity`)
        }
        prompt([{
            name: 'continue',
            message: 'Would you like to continue shopping?',
            type: 'list',
            choices: ['Yes', 'No']
        }
        ])
            .then(answer => {
                if (answer.continue === 'Yes') {
                    buy();
                } else {
                    const due = grandTotal.reduce(invoice)
                    for (let i = 0; i < allItems.length; i++) {
                        console.log(allItems[i]);
                    }
                    console.log(`Your grand total is $${due}`)
                    prompt([{
                        name: 'check',
                        message: 'Would you like to check out?',
                        type: 'list',
                        choices: ['Yes', 'No']
                    }
                    ])
                        .then(answer => {
                            if (answer.check === 'Yes') {
                                console.log(`Well you can't. This is a fake store.`)
                                process.exit();
                            } else {
                                console.log(`Okay, have a great day!`)
                                process.exit();
                            }
                        }
                        )
                }
            })
    })
}


const welcome = _ => {
    prompt({
        type: 'list',
        name: 'action',
        message: 'Welcome to Bamazon! What would you like to do?',
        choices: ['Purchase Products', '--EXIT--']
    })
        .then(({ action }) => {

            switch (action) {
                case 'Purchase Products':
                    buy()
                    break
                case '--EXIT--':
                    process.exit()
                default:
                    welcome()
                    break
            }
        })
        .catch(e => console.log(e))
}

db.connect(e => e ? console.log(e) : welcome())