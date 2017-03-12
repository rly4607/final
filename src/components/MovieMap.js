var React = require('react')
var ReactGMaps = require('react-gmaps') // https://github.com/MicheleBertoli/react-gmaps
var {Gmaps, Marker, InfoWindow} = ReactGMaps

var theatres = require('../data/theatres.json')

var MovieMap = React.createClass({

    render: function() {
      return (
        <div className="map col-sm-12">
          <Gmaps width={'100%'}
                 height={'480px'}
                 lat={this.props.lat}
                 lng={this.props.long}
                 zoom={13}
                 loadingMessage={'Loading Theatres Nearest You'}
                 params={{v: '3.exp', key: 'AIzaSyB3p_xQIXsFMDGLYNEiVkgW5fsVSUOd01c'}}>

                 {theatres.map( function(place) {
                   return <Marker lat={place.lat} lng={place.long} />
                 })}

          </Gmaps>
        </div>
      )
    }

})

module.exports = MovieMap
