var express = require('express');
var router = express.Router();
let request = require("async-request");
var mongoose = require('mongoose')
var movieModel = require('../models/movies')

// HERE YOU NEED TO PUT YOUR API KEY ------------
var myApiKey = "26c9efb88d2df24d1beb1b75e2a90167"
//  --------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get movies
router.get('/movies',async function(req,res,next){

  // We use async await request to access movies data from the API
  var data = await request(`https://api.themoviedb.org/3/discover/movie?api_key=${myApiKey}&language=fr&sort_by=popularity.desc&include_adult=false&include_video=false&page=1
  `)

    // We need to parse the body to be able to access the data with the format json
    body = JSON.parse(data.body);

    console.log('DATA complete -->',body)

  res.json({result: true,movies:body.results});
})

// Get mymovies
router.get('/mymovies',function(req,res,next){

  // We ask the database to give us all the collection
  movieModel.find(
    function (error, data) {
      if(error){
        console.log("Oups...error ->", error)
      }else{
        console.log("Here is our movie list",data);

        res.json({result: true,data});
      }
    }
  )
  
})

// Post route
router.post('/mymovies',function(req,res,next){

  // 1) We create à newMovie with our movieModel
  var newMovie = new movieModel ({
    poster_path : req.body.poster_path,
    overview : req.body.overview,
    title: req.body.title,
    idMovieDB: req.body.idMovieDB,
   });
  //  2) We save our newMovie in our database
   newMovie.save(
       function (error, movie) {
          if(error){

            console.log("Oups...error ->", error)

          }else{

            console.log("Here is our new Liked movie ->", movie)

            res.json({result: true,movie});
          }
       }
   );
  
})

// Delete route
router.delete('/mymovies/:movieId',function(req,res,next){

  console.log('je suis dans ma route delete')

  // We will delete in our database the movie
  movieModel.deleteOne(
    { idMovieDB: req.params.movieId}, 
    function(error,movie) {

        if(error){
          console.log("Oups...error ->", error)
        }else{

          console.log("Here is our deleted movie ->", movie)

          res.json({result: true,movie});
        }
    })
})

module.exports = router;