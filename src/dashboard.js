import axios from 'axios';
import React from 'react'
import MetricWidget from './metric-widget'
import './dashboard.css'

class Dashboard extends React.Component {
  dataTracked = [
    { order: 1, period: 'week', type: 'metric', propertyName: 'wac', name: 'Weekly Active Customers',
      load: function(dashboard) {
        axios.get('https://glenngillen.stdlib.com/heroku-dataclip-normalization@0.0.1/?dataclipUrl=https://dataclips.heroku.com/...')
          .then(function (response) {
            dashboard.setState({
              wac: {
                value: response.data.current,
                growth: ((response.data.current/response.data.previous)-1)*100,
                trend: ((response.data.current/response.data.sixPeriodsAgo)**(1/(6-1))-1)*100,
                lastUpdatedAt: new Date()
              }
            })
          })
        .catch(function (error) {
          console.log(error);
        });
      } },
    { order: 2, period: 'week', type: 'metric', propertyName: 'new_visitors', name: 'New Visitors',
      load: function(dashboard) {
        axios.get('https://glenngillen.stdlib.com/ga-weekly-visitor-growth@0.0.3/...')
          .then(function (response) {
            dashboard.setState({
              new_visitors: {
                value: response.data.current,
                growth: ((response.data.current/response.data.previous)-1)*100,
                trend: ((response.data.current/response.data.sixPeriodsAgo)**(1/(6-1))-1)*100,
                lastUpdatedAt: new Date()
              }
            })
          })
        .catch(function (error) {
          console.log(error);
        });
      } },
    { order: 2, period: 'week', type: 'metric', propertyName: 'new_signups', name: 'New Signups',
      load: function(dashboard) {
        axios.get('https://glenngillen.stdlib.com/heroku-dataclip-normalization@0.0.1/?dataclipUrl=https://dataclips.heroku.com/...')
          .then(function (response) {
            dashboard.setState({
              new_signups: {
                value: response.data.current,
                growth: ((response.data.current/response.data.previous)-1)*100,
                trend: ((response.data.current/response.data.sixPeriodsAgo)**(1/(6-1))-1)*100,
                lastUpdatedAt: new Date()
              }
            })
          })
        .catch(function (error) {
          console.log(error);
        });
      } },
    { order: 3, period: 'month', type: 'metric', propertyName: 'mrr_net_new', name: 'New New MRR' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'mrr_net_churn', name: 'Net MRR Churn' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'mrr_net_expansion', name: 'Net Expansion MRR' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'cash_in_bank', name: 'Cash in bank' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'net_burn_rate', name: 'Net burn rate' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'runway_months', name: 'Months of runway' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'customers_paying', name: 'Paying Customers' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'customers_not_paying', name: 'Non-paying Customers' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'leads', name: 'Leads' },
    { order: 3, period: 'month', type: 'metric', propertyName: 'virality_coefficient', name: 'Virality Coefficient' }
  ]

  constructor(props) {
    super(props)
    this.state = {
      wac: {
        value: 0,
        growth: 0,
        trend: 0
      },
      new_visitors: {
        value: 0,
        growth: 0,
        trend: 0
      },
      new_signups: {
        value: 0,
        growth: 0,
        trend: 0
      },
      mrr_net_new: {
        value: 0,
        growth: 0,
        trend: 0
      },
      mrr_net_churn: {
        value: 0,
        growth: 0,
        trend: 0
      },
      mrr_net_expansion: {
        value: 0,
        growth: 0,
        trend: 0
      },
      cash_in_bank: {
        value: 0,
        growth: 0,
        trend: 0
      },
      net_burn_rate: {
        value: 0,
        growth: 0,
        trend: 0
      },
      runway_months: {
        value: 0,
        growth: 0,
        trend: 0
      },
      customers_paying: {
        value: 0,
        growth: 0,
        trend: 0
      },
      customers_not_paying: {
        value: 0,
        growth: 0,
        trend: 0
      },
      leads: {
        value: 0,
        growth: 0,
        trend: 0
      },
      virality_coefficient: {
        value: 0,
        growth: 0,
        trend: 0
      }
    }
  }

  configuredWidgets() {
    return this.dataTracked.filter(function(datum) { return typeof datum.load === 'function' })
  }

  render() {
    var dashboard = this
    var widgets = this.configuredWidgets().map(function(datum) {
      return <MetricWidget order={datum.order} data={dashboard.state[datum.propertyName]} key={datum.propertyName} name={datum.name} />
    })
    return (
      <div id="dashboard">
        { widgets }
      </div>
    )
  }

  componentDidMount() {
    var dashboard = this
    this.configuredWidgets().forEach(function(datum) {
      datum.load(dashboard)
    })
  }

}

module.exports = Dashboard
