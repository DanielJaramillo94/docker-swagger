const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express()
const port = 8081

const db_link = "mongodb://mongo:27017/helloworlddb";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(db_link, options).then( function() {
  console.log('MongoDB is connected');
})
.catch( function(err) {
  console.log(err);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "HelloWorld API",
      description: "Hello World Class",
      contact: {
        name: "DanielJaramillo"
      },
      servers: ["http://localhost:8081"]
    }
  },
  apis: ["index.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let Schema = mongoose.Schema;

let userSchema = new Schema({
  id: {type: String},
  userName: {type: String},
  level: {type: Number, min: 0}
}, {versionKey: false})

let User = mongoose.model('Users', userSchema)

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/customers", (req, res) => {
  let users = User.find({})
  .exec((err, users) => {
    if(err)
      res.status(400).send('Oops! Something went wrong!');
    else
      res.status(200).send(users);
  })
  // res.status(200).send(users);
});

app.get("/customer-add", (req, res) => {
  let newUser = User.create({id: 'newId', userName: 'This is my new name', level: 3})
  res.status(200).send(newUser);
});

app.post('/book', function(req, res) {
  var newUser = new User();

  newUser.id = req.body.id;
  newUser.userName = req.body.userName;
  newUser.level = req.body.level;

  newUser.save(function(err, user) {
    if(err) {
      res.status(400).send('error saving user');
    } else {
      console.log(user);
      res.status(201).send(user);
    }
  });
});

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to return all customers
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
app.put("/customer", (req, res) => {
  res.status(200).send("Successfully updated customer");
});

app.listen(port, () => {
  console.log(`Example app listening at 8081`)
})