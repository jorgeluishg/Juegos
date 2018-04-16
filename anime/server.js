// server.js


const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://jorge:hurtarte3018@localhost:5432/shopcar');
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const anime = sequelize.define('anime', {
	codigo: {
	  type: Sequelize.INTEGER
	},
	nombre: {
		type: Sequelize.STRING
	},
	genero: {
		type: Sequelize.STRING
	},
	espisodios: {
		type: Sequelize.FLOAT
	},
	emision: {
		type: Sequelize.STRING
	}
  });
  

// call the packages

var express = require('express')
var cors = require('cors')
var app = express();
app.use(cors())

var bodyParser = require('body-parser');

// config app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8081; 

// routes for our api
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('something is happen..');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();  // make sure we go to the next routes
});


// test route

router.get('/', function(req, res) {
 res.json({ message: 'yahoo!! welcome to our api !' });
});

// more routes for our API will happen here
router.route('/anime')
 
  // create a product accessed at POST
  // http://localhost:8080/api/products
  
 .post(function (req, res) {
 
	 return anime
	 .create({ 
		 				codigo: req.body.codigo, 
						nombre: req.body.nombre, 
						genero: req.body.genero, 
						episodios : req.body.episodios,
						emision: req.body.emision 
					})
					.then(todoItem => res.status(201).send(todoItem))
					.catch(error => res.status(400).send(error));
	})
  
 // get all the devices (accessed at 
 // http://localhost:8080/api/anime
 .get(function (req, res) {
    Productos.findAll().then(products => {
	   	res.json(products);
	  })
 });

// on routes that end in /products/:anime_id
router.route('/anime/:anime_id')
 // get the device with that id 
 // accessed at GET 
 // http://localhost:8080/api/anime/:anime_id

 .get(function(req, res) {
	
	return anime
    .findById(req.params.anime_id, {
    })
    .then(myanime => {
      if (!myanime) {
        return res.status(404).send({
          message: 'Product Not Found',
        });
      }
      return res.status(200).send(myanime);
    })
    .catch(error => res.status(400).send(myanime));
	})

 // update the product with this id
 // accessed at PUT
 // http://localhost:8080/api/anime/:anime_id

 .put(function (req, res) {
	 return anime
    .findById(req.params.anime_id, {
    })
    .then(myanime => {
      if (!myanime) {
        return res.status(404).send({
          message: 'Anime Not Found',
        });
      }
      return myanime
        .update({
					nombre: req.body.nombre || myanime.nombre,
					genero: req.body.genero || myanime.genero,
					episodios:  req.body.episodios || myanime.episodios,
					emision: req.body.emision || myanime.emision,
        })
        .then(() => res.status(200).send(myanime))  // Send back the updated anime.
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
})

 // delete the product with this id 
 // accessed at DELETE
 // http://localhost:8080/api/anime/:anime_id
 .delete(function (req, res) {
	return anime
    .findById(req.params.anime_id)
    .then(myanime => {
      if (!myanime) {
        return res.status(400).send({
          message: 'Product Not Found',
        });
      }
      return myanime
        .destroy()
        .then(() => res.status(200).send({ message: 'Product deleted successfully.' }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));

	
 });

 // register our routes
app.use('/api', router);
//app.use(require('cors')());

// start the server
app.listen(port);
console.log('Magic happens on port: ' + port);
