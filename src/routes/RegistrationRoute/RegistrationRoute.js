import React, { Component } from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import UserContext from '../../contexts/UserContext'
import AuthApiService from '../../services/auth-api-service'

class RegistrationRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  static contextType = UserContext

  handleRegistrationSuccess = (username, password) => {
    AuthApiService.postLogin({
      username: username,
      password: password,
    })
      .then(res => {
        this.context.processLogin(res.authToken)



        const { location, history } = this.props


        const destination = (location.state || {}).from || '/'
        history.push(destination)
      })
      .catch(res => {
        console.log(res.error)
      })
  }

  render() {
    return (
      <section>
        <p>
          Practice learning a language with
          <br />
          the spaced reptition revision technique.
        </p>
        <h2>Sign up</h2>
        <RegistrationForm
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute
