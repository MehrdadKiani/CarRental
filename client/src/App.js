import React, { Component, Fragment } from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import HistoryList from './components/HistoryList'
import Content from './components/Content'
import LoginForm from './components/LoginForm'
import ConfigForm from './components/ConfigForm'
import Container from 'react-bootstrap/Container';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import API from './api/API'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cars: [], brands: [], filters: [] };
  }

  componentDidMount() {
    this.getCars();
    this.getBrands();

    //check if the user is authenticated
    API.isAuthenticated().then(
      (user) => {
        this.setState({ authUser: user });
      }
    ).catch((err) => {
      this.setState({ authErr: err.errorObj });
      this.props.history.push("/home");
    });

  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.props.history.push("/login");
      }
    }
  }

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
      API.getCars().catch((errorObj) => { this.handleErrors(errorObj) });
      this.props.history.push("/home");
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => {
        API.getCars()
          .then((cars) => {
            this.setState({ cars: cars, authUser: user, authErr: null });
            this.props.history.push("/rent");
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  getCars = () => {
    API.getCars()
      .then((cars) => this.setState({ cars: cars }))
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }

  getBrands = () => {
    API.getBrands()
      .then((brandList) => this.setState({ brands: brandList }))
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }

  selecteFilter = async (filter, status) => {
    let filtersArray = [...this.state.filters];
    if (status)
      filtersArray.push(filter);
    else
      filtersArray = filtersArray.filter(item => item !== filter);

    await this.setState({ filters: filtersArray });

    API.getFilteredCars(JSON.stringify(this.state.filters))
      .then((cars) => this.setState({ cars: cars }))
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return (
      <AuthContext.Provider value={value}>
        <Fragment>
          <Header />
          <Container fluid>
            <div className="row">
              <Switch>
                <Route path="/home">
                  <Sidebar brands={this.state.brands} onFilter={this.selecteFilter} />
                  <Content cars={this.state.cars} />
                </Route>
                <Route path="/rent">
                  <ConfigForm linkHistory={this.props.history} />
                </Route>
                <Route path="/history">
                  <HistoryList linkHistory={this.props.history} />
                </Route>
                <Route path="/login">
                  <LoginForm />
                </Route>
                <Route>
                  <Redirect to='/home' />
                </Route>
              </Switch>
            </div>
          </Container>
        </Fragment>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
