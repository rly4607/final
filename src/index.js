// React
var React = require('react')
var ReactDOM = require('react-dom')

// Google Maps
var ReactGMaps = require('react-gmaps')
var {Gmaps, Marker} = ReactGMaps

// Movie data
var movieData = require('./data/movies.json')
var theatres = require('./data/theatres.json')

// Components
var Header = require('./components/Header')
var MovieDetails = require('./components/MovieDetails')
var MovieList = require('./components/MovieList')
var NoCurrentMovie = require('./components/NoCurrentMovie')
var SortBar = require('./components/SortBar')
var MovieMap = require('./components/MovieMap')

var doOnceFlag = 10

// There should really be some JSON-formatted data in movies.json, instead of an empty array.
// I started writing this command to extract the data from the learn-sql workspace
// on C9, but it's not done yet :) You must have the csvtojson command installed on your
// C9 workspace for this to work.
// npm install -g csvtojson
// sqlite3 -csv -header movies.sqlite3 'select "imdbID" as id, "title" from movies' | csvtojson --maxRowLength=0 > movies.json

// Firebase configuration
var Rebase = require('re-base')
var base = Rebase.createClass({
  apiKey: "AIzaSyCRDc1USl4tr8Xc7MASoLZ1-TYoVfT84YU",   // replace with your Firebase application's API key
  authDomain: "final-ff301.firebaseapp.com",
  databaseURL: "https://final-ff301.firebaseio.com/", // replace with your Firebase application's database URL
})

var App = React.createClass({

  movieClicked: function(movie) {
    this.setState({
      currentMovie: movie
    })
  },
  movieWatched: function(movie) {
    var existingMovies = this.state.movies
    var moviesWithWatchedMovieRemoved = existingMovies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({
      movies: moviesWithWatchedMovieRemoved,
      currentMovie: null
    })
  },
  resetMovieListClicked: function() {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased)
    })
  },
  viewChanged: function(view) {
    if(view === 'alpha') {
      this.setState({
        movies: this.state.movies.sort(this.movieCompareByTitle),
        currentView: "alpha"
      })
    } else if (view === 'latest') {
      this.setState({
        movies: this.state.movies.sort(this.movieCompareByReleased),
        currentView: "latest"
      })
    } else if (view === 'map') {
      this.setState({
        currentView: "map"
      })
    }

  },
  renderMovieDetails: function() {
    if (this.state.currentMovie == null) {
      return <NoCurrentMovie resetMovieListClicked={this.resetMovieListClicked} />
    } else {
      return <MovieDetails movie={this.state.currentMovie}
                           movieWatched={this.movieWatched} />
    }
  },
  renderMainSection: function() {


    if (this.state.currentView === 'map') {
      return (
        <MovieMap lat={this.state.latitude} long={this.state.longitude}/>
      )
    } else {
      return (
        <div>
          <MovieList movies={this.state.movies} movieClicked={this.movieClicked} />
          {this.renderMovieDetails()}
        </div>
      )
    }
  },
  movieCompareByTitle: function(movieA, movieB) {
    if (movieA.title < movieB.title) {
      return -1
    } else if (movieA.title > movieB.title) {
      return 1
    } else {
      return 0
    }
  },
  movieCompareByReleased: function(movieA, movieB) {
    if (movieA.released > movieB.released) {
      return -1
    } else if (movieA.released < movieB.released) {
      return 1
    } else {
      return 0
    }
  },
  getInitialState: function() {

    return {
      movies: movieData.sort(this.movieCompareByReleased),
      currentMovie: null,
      currentView: "latest",
      currentUser: null,
      latitude: '41.878114',
      longitude: '-87.629798'
    }
  },
  componentDidMount: function() {
    base.syncState('/movies', { context: this, state: 'movies', asArray: true })
    base.onAuth(this.authChanged)
  },

  authChanged: function(user) {
    if (user) {
      this.setState({
        currentUser: user
      })
      console.log(user)
    } else {
      this.setState({
        currentUser: null
      })
      console.log("Logged out") }
  },
  loginComplete: function(error, response) {
    if (error) {
      console.log("Login failed")
    } else {
      console.log("Login succeeded")
    }
  },
  login: function() {
    base.authWithOAuthPopup('google', this.loginComplete)
  },
  logout: function() {
    base.unauth()
  },

  render: function() {
    return (
      <div>
        <Header currentUser={this.state.currentUser}
          login={this.login}
          logout={this.logout}/>
        <SortBar movieCount={this.state.movies.length} viewChanged={this.viewChanged} currentView={this.state.currentView} />
        <div className="main row">
          {this.renderMainSection()}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App />, document.getElementById("app"))
