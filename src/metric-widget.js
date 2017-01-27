import React from 'react'
import './metric-widget.css'

class MetricWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animating: false,
      prev: props.data,
      now: props.data
    }
  }

  calcStep(start, end) {
    var step = ((start - end)/12).toFixed(0)
    if (step === 0) {
      if ((start - end) > 0) {
        step = 1
      } else {
        step = -1
      }
    }
    return parseInt(step, 10)
  }

  componentWillReceiveProps(nextProps) {
    var increments = {
      value: this.calcStep(nextProps.data.value, this.props.data.value),
      growth: this.calcStep(nextProps.data.growth, this.props.data.growth),
      trend: this.calcStep(nextProps.data.trend, this.props.data.trend),
    }
    this.setState({
      animating: true,
      prev: this.props.data,
      now: nextProps.data,
      increments: increments
    })
  }

  calcIncrement(value, ceil, inc) {
    var isInt = Number.isInteger(value)
    value += inc
    if ((inc > 0 && value > ceil) || (inc < 0 && value < ceil)) {
      return ceil
    }
    if (isInt) {
      return parseInt(value, 10)
    }
    return value
  }

  doneAnimating(displaying, target) {
    return (displaying.value === target.value && displaying.growth === target.growth && displaying.trend === target.trend)
  }

  componentDidUpdate() {
    if (this.state.animating) {
      var value, growth, trend
      var component = this
      if (this.doneAnimating(this.state.prev, this.state.now)) {
        this.setState({animating: false})
      }
      value = this.calcIncrement(this.state.prev.value, this.state.now.value, this.state.increments.value)
      growth = this.calcIncrement(this.state.prev.growth, this.state.now.growth, this.state.increments.growth)
      trend = this.calcIncrement(this.state.prev.trend, this.state.now.trend, this.state.increments.trend)
      setTimeout(function() {
        component.setState({
          prev: {
            value: value,
            growth: growth,
            trend: trend
          }
        })
      }, 40)
    }
  }

  render() {
    var value, growth, trend
    value = this.state.prev.value
    growth = this.state.prev.growth
    trend = this.state.prev.trend
    var data = this.props.data
    var rateDirection = data.growth >= 0 ? 'up' : 'down'
    if (data.growth === 0) rateDirection = 'flat'
    var changeRateClass = 'change-rate icon-arrow-' + rateDirection
    var trendDirection = data.trend >= 0 ? 'up' : 'down'
    if (data.trend === 0) trendDirection = 'flat'
    var trendClass = 'trend-annotation icon-arrow-' + trendDirection
    var updatedAt = data.lastUpdatedAt
    var lastUpdateDisplay = updatedAt ? updatedAt.getHours() + ':' + updatedAt.getMinutes() : '??'
    var trendEndPoint = 50 * (1 - (trend/100))
    var trendCoords = "0 50, 100 " + trendEndPoint + ", 100 100, 0 100"
    return (
      <div className="container" style={{order: this.props.order}} >
        <h1 className="title">{this.props.name}</h1>
        <h2 className="value">{value}</h2>
        <p className={changeRateClass}>
          {growth.toFixed(2)}%
        </p>
        <p className="more-info">{this.props.info}</p>
        <p className="updated-at">Last updated at {lastUpdateDisplay}</p>
        <svg preserveAspectRatio="none" className="chart" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polygon className="trend" points={trendCoords} />
        </svg>
        <p className={trendClass} style={{top: trendEndPoint + '%' }}>{trend.toFixed(2)}%</p>
      </div>
    );
  }
}

module.exports = MetricWidget;
