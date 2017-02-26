var React = require('react');

var SortBar = React.createClass({
  viewChanged: function(view) {
    this.props.viewChanged(view)
  },
  render: function() {

    var latestClass = ""
    var alphaClass = ""
    var mapClass = ""

    if (this.props.currentView === 'alpha') {
      latestClass = ""
      alphaClass = "active"
      mapClass = ""
    } else if (this.props.currentView === 'map') {
      latestClass = ""
      alphaClass = ""
      mapClass = "active"
    }
    else {
      latestClass = "active"
      alphaClass = ""
      mapClass = ""
    }

    return (
      <div className="sort row">
        <div className="col-sm-12">
          <ul className="nav nav-pills">
            <li className={latestClass}><a href="#" onClick={() => this.viewChanged('latest')}>Latest Releases</a></li>
            <li className={alphaClass}><a href="#" onClick={() => this.viewChanged('alpha')}>A-Z</a></li>
            <li className={mapClass}><a href="#" onClick={() => this.viewChanged('map')}>Where to Watch</a></li>
            <li className="nav-text pull-right">{this.props.movieCount} movies</li>
          </ul>
        </div>
      </div>
    )
  }
})

module.exports = SortBar;
