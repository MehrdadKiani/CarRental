import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Checkout from './Checkout'
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'
import API from "../api/API"
import { Fragment } from 'react';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ListGroup from 'react-bootstrap/ListGroup'

class ConfigForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            histories: [],
            driverAge: 1,
            carCategory: 'C',
            kilometers: 1,
            extraInsurance: 0,
            extraDrivers: 0,
            startDate: '2020-06-27',
            endDate: '2020-07-05',
            total: 0,
            leftCars: 0,
            authUser: ''
        };
    }

    componentDidMount() {
        //check if the user is authenticated
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                this.getHistories();
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
            this.props.linkHistory.push("/login");
        });
    }

    getHistories = () => {
        API.getHistories()
            .then((histories) => this.setState(
                { histories: histories.filter(item => item.userId === this.state.authUser.id) }))
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value });
        const total = 0;
        const leftCars = 0;
        this.setState({ total, leftCars });
    }

    handleSubmit1 = async (event) => {
        event.preventDefault();
        await this.getAvailableCars(this.state.carCategory);
        await this.calculateTotal();
    }

    calculateTotal = () => {

        let histories = [...this.state.histories];
        let userHistories = histories.filter(item => item.status === 2)
        let days = this.DaysBetween(this.state.startDate, this.state.endDate);
        let daysTotal = 0;
        let total = 0;
        let percentTotal = 0;
        let totalCars = this.state.cars.length;
        let leftCars = this.state.cars.filter(item => item.status === 0).length;//if status = 0 car is on the garage
        let thershold = (totalCars * 10) / 100;

        if (leftCars < thershold)
            percentTotal = percentTotal + (10);
        else
            percentTotal = percentTotal + (0);

        switch (this.state.carCategory) {
            case 'A':
                daysTotal = days * 80;
                break;
            case 'B':
                daysTotal = days * 70;
                break;
            case 'C':
                daysTotal = days * 60;
                break;
            case 'D':
                daysTotal = days * 50;
                break;
            case 'E':
                daysTotal = days * 40;
                break;
            default:
                break;
        }

        switch (this.state.kilometers) {
            case 0:
                percentTotal = percentTotal + (-5);
                break;
            case 1:
                percentTotal = percentTotal + (0);
                break;
            case 2:
                percentTotal = percentTotal + (5);
                break;
            default:
                break;
        }

        switch (this.state.driverAge) {
            case 0:
                percentTotal = percentTotal + (5);
                break;
            case 1:
                percentTotal = percentTotal + (0);
                break;
            case 2:
                percentTotal = percentTotal + (10);
                break;
            default:
                break;
        }

        switch (this.state.extraInsurance) {
            case 0:
                percentTotal = percentTotal + (0);
                break;

            default:
                percentTotal = percentTotal + (20);
                break;
        }

        switch (this.state.extraDrivers) {
            case 0:
                percentTotal = percentTotal + (0);
                break;

            default:
                percentTotal = percentTotal + (15);
                break;
        }

        if (userHistories.length > 2)
            percentTotal = percentTotal + (-10);
        else
            percentTotal = percentTotal + (0);


        total = ((100 + (percentTotal)) * daysTotal) / 100;
        this.setState({ total, leftCars })
    }

    DaysBetween = (startRent, endRent) => {
        let start = new Date(startRent);
        let end = new Date(endRent);
        const ONE_DAY = 1000 * 60 * 60 * 24;// The number of milliseconds in one day
        const differenceMs = Math.abs(start - end);// Calculate the difference in milliseconds
        return Math.round(differenceMs / ONE_DAY);// Convert back to days and return
    }

    getAvailableCars = async (category) => {
        API.syncTables().then(
            await API.getCarsByCategory(category)
                .then(
                    (carsList) => this.setState({ cars: carsList })))
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    showCheckout = (leftCars) => {
        if (leftCars)
            return (
                <Tab eventKey="profile" title="2. Checkout">

                    <ListGroup.Item>
                        <Checkout
                            userId={this.state.authUser.id}
                            total={this.state.total}
                            carCategory={this.state.carCategory}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            cars={this.state.cars}
                        />
                    </ListGroup.Item>

                </Tab>
            )
        else { return <p></p> }
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Fragment>
                        {context.authErr && <Redirect to="/login"></Redirect>}
                        <div className="col-lg-6 mx-auto">
                            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                                <Tab eventKey="home" title="1. Rent a car">

                                    <ListGroup.Item>
                                        <Form onSubmit={this.handleSubmit1} className="mt-3">
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="startDate">
                                                    <Form.Label>Start Date</Form.Label>
                                                    <Form.Control type="Date" name="startDate" required
                                                        value={this.state.startDate}
                                                        onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="endDate">
                                                    <Form.Label>End Date</Form.Label>
                                                    <Form.Control type="Date" name="endDate" required
                                                        value={this.state.endDate}
                                                        onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="carCategory">
                                                    <Form.Label>Category</Form.Label>
                                                    <Form.Control as="select" name="carCategory"
                                                        value={this.state.carCategory}
                                                        onChange={(event) => this.handleChange(event.target.name, event.target.value)}>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="C">C</option>
                                                        <option value="D">D</option>
                                                        <option value="E">E</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="driverAge">
                                                    <Form.Label>Age</Form.Label>
                                                    <Form.Control as="select" name="driverAge"
                                                        value={this.state.driverAge}
                                                        onChange={(event) => this.handleChange(event.target.name, parseInt(event.target.value))}>
                                                        <option value="0">Under 25</option>
                                                        <option value="1">25-65</option>
                                                        <option value="2">Over 65</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="kilometers">
                                                    <Form.Label>Kilometers</Form.Label>
                                                    <Form.Control as="select" name="kilometers"
                                                        value={this.state.kilometers}
                                                        onChange={(event) => this.handleChange(event.target.name, parseInt(event.target.value))}>
                                                        <option value="0">Under 50km</option>
                                                        <option value="1">50km-150km</option>
                                                        <option value="2">Over 150km</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="extraDrivers">
                                                    <Form.Label>Extra Drivers</Form.Label>
                                                    <Form.Control type="number" name="extraDrivers" required min="0" max="5"
                                                        value={this.state.extraDrivers}
                                                        onChange={(event) => this.handleChange(event.target.name, parseInt(event.target.value))} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="extraInsurance">
                                                    <Form.Label>Extra Insurance</Form.Label>
                                                    <Form.Control as="select" name="extraInsurance"
                                                        value={this.state.extraInsurance}
                                                        onChange={(event) => this.handleChange(event.target.name, parseInt(event.target.value))}>
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>
                                            <div className="m-2">
                                                <Button variant="primary" type="submit">Search</Button>
                                            </div>
                                        </Form>
                                    </ListGroup.Item>
                                    <ListGroup.Item>


                                        <div className="text-muted">
                                            <h6>Number of available cars: <span className="badge badge-secondary">{this.state.leftCars}</span></h6>
                                            <h6>Final rental price: <span className="badge badge-secondary">{this.state.total} €</span></h6>
                                        </div>


                                    </ListGroup.Item>

                                </Tab>
                                {this.showCheckout(this.state.leftCars)}
                            </Tabs>
                        </div>
                    </Fragment>
                )
                }
            </AuthContext.Consumer>
        );
    }
}

export default ConfigForm;