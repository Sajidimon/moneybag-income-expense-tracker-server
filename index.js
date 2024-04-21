const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// CORS Configuration
app.use(
    cors({
        origin: "https://moneybag-expense-tracker.web.app"
    })
);

//middleware
app.use(express.json())

async function run() {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcocwar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        // db & collection

        const incomeCollection = client.db('moneybagDB').collection('income list')
        const expenseCollection = client.db('moneybagDB').collection('expense list')

        //income collection;
        //create or insert income to db;

        app.post('/income', async (req, res) => {
            const incomeList = req.body;
            const result = await incomeCollection.insertOne(incomeList);
            res.send(result)
        })

        //find, read or bring income from db;

        app.get('/income', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await incomeCollection.find(query).toArray();
            res.send(result);
        })

        //delete income from db;

        app.delete('/income/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await incomeCollection.deleteOne(query)
            res.send(result)
        })

        //get specific data to update income list;

        app.get('/income/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await incomeCollection.findOne(query);
            res.send(result);
        })

        //update income list;

        app.put('/income/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    amount: item.amount,
                    category: item.category,
                    date: item.date

                }
            }
            const result = await incomeCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        //expense collection;
        // create or insert expense to db;

        app.post('/expense', async (req, res) => {
            const expenseList = req.body;
            const result = await expenseCollection.insertOne(expenseList)
            res.send(result)
        })

        //find, read or bring data from db;

        app.get('/expense', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await expenseCollection.find(query).toArray();
            res.send(result)
        })

        // delete expense data from db;

        app.delete('/expense/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await expenseCollection.deleteOne(query);
            res.send(result);
        })

        // get specific data from db to update expense data;

        app.get('/expense/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await expenseCollection.findOne(query);
            res.send(result)
        })

        //update data to db;

        app.put('/expense/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    amount: item.amount,
                    category: item.category,
                    date: item.date
                }
            }
            const result = await expenseCollection.updateOne(filter, updateDoc);
            res.send(result);

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})