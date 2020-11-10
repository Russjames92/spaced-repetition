import React, { Component } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';

class DashboardRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  };

  render() {
    return (
      <section>
        <Dashboard />
      </section>
    );
  }
}

export default DashboardRoute
