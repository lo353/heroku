const express = require('express');
const app = express();

app.use(express.json());

const MongoClient = require('mongodb').MongoClient;


let db;
MongoClient.connect('mongodb+srv://admin:polpik11@kai2.sc90x.mongodb.net/webstore?retryWrites=true&w=majority'
, (err, client) => {
db = client.db('webstore');
})

app.param('collectionName'
, (req, res, next, collectionName) => {
req.collection = db.collection(collectionName)
return next()
})

app.get('/'
, (req, res, next) => {
res.send('Select a collection, e.g., /collection/messages')
})


app.get('/collection/:collectionName'
, (req, res, next) => {
req.collection.find({}).toArray((e, results) => {
if (e) return next(e);
res.send(results);
}
)
})

app.post('/collection/:collectionName'
, (req, res, next) => {
req.collection.insert(req.body, (e, results) => {
if (e) return next(e)
res.send(results.ops)
})
})

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})

app.put('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.update(
{_id: new ObjectID(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
})
})


const port = process.env.PORT || 3000
app.listen(port, ()=>  {
console.log('Expressss')


})

