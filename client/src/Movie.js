import React, { Component } from 'react';
import {
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default class Movie extends Component {

    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this)
      this.state = {
        selected : this.props.movieLiked,
      }
    }
  
    handleClick(){
        //Log to check if the click is detected 
        console.log("Click detected on the heart picto")
  
        //We use setState to change our selected state when we click on the picto
        this.setState({						
          selected : !this.state.selected
        })

        var isLike = this.state.selected
        console.log('isLike -->', isLike)

        if(!isLike){

          // Here is our log to check if we can access the idMovie when we click on the heart picto
          console.log("id movie dans composant movie",this.props.idMovie)

          // We use send to our backend with the fetch method the informations he needs to save the movie in our database
          fetch('http://localhost:3000/mymovies', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body:`title=${this.props.movieName}&overview=${this.props.movieDesc}&poster_path=${this.props.movieImg}&idMovieDB=${this.props.idMovie}`
          }).then(function(data) {
            console.log('We have saved this movie -->',data)
          }).catch((error) => {
            console.error('Oups, there is an error when adding a movie-->',error);
          });

        }else{

          // Here we want to delete a movie in our database
            fetch(`http://localhost:3000/mymovies/${this.props.idMovie}`, {
            method: 'DELETE'})
            .catch((error) => {
            console.error(error);
          });

        }
        this.props.handleClickParent(isLike, this.props.movieName);
  
    }
  
    render(){
  
      var styleHeart = {
        color: '#F7F7F7',
        position: 'absolute', // this one is important 
        top: '5%',
        left: '80%',
        cursor: 'pointer',
      }
  
      var movieStyle = {
        marginBottom:'30px',
        display :"block",
      }
  
      // If we click on the heard, we change the color to red
      if(this.state.selected){
        styleHeart.color = "#fc6861"
      }
  
      var display = ''
  
      if(this.props.displayOnlyLike && !this.state.selected){
        display='none'
      }
    
      return(
  
            <Col xs="12" sm="6" md="4" lg="3" style={{display}}>
              <div style={movieStyle}>
                <Card>
                  <CardImg top width="100%" src={`https://image.tmdb.org/t/p/w500/${this.props.movieImg}`} alt="Card image cap" />
                  <FontAwesomeIcon size="2x" style={styleHeart} icon={faHeart} onClick={this.handleClick} />
                    <CardBody style={{height: 250}}>
                   
                      <CardTitle>{this.props.movieName}</CardTitle>
                      <CardText>{this.props.movieDesc.substr(0, 110) + ' ...'}</CardText>
                    </CardBody>
                  </Card>
              </div>
            </Col>
  
      )
    }
  }

  