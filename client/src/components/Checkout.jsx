import React, { Component, Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { AuthContext } from '../auth/AuthContext'
import API from "../api/API"

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namecard: '',
            cardnumber: '',
            expiration: '',
            cvv: '100',
            msg: ''
        };
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit2 = async (event) => {
        event.preventDefault();
        const selectedCar = this.props.cars.filter(cars => cars.status !== 1);
        const selectedCarId = selectedCar[0].id;
        let history = {
            startDateTime: this.props.startDate,
            endDateTime: this.props.endDate,
            total: this.props.total,
            status: 0,
            userId: this.props.userId,
            carId: selectedCarId,
            carCategory: this.props.carCategory
        };
        this.do(history);
    }

    do = (history) => {
        API.checkPayment({ namecard: this.state.namecard, cardnumber: this.state.cardnumber, expiration: this.state.expiration, cvv: this.state.cvv })
            .then(() =>
                API.addHistory(history)
                    .then(() =>
                        API.updateCar(history.carId, { status: 1 }).then(this.setState({ msg: 'Payment submitted' })))
            )
            .catch((errorObj) => {
                this.setState({ msg: errorObj.errors[0].msg });
            });
    }

    controlButton = (msg) => {
        if (msg === 'Payment submitted')
            return <Button variant="primary" type="submit" disabled>Checkout</Button>
        else
            return <Button variant="primary" type="submit" >Checkout</Button>
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Fragment>
                        <Form onSubmit={this.handleSubmit2} className="mt-3">
                            <Form.Row>
                                <Form.Group as={Col} controlId="namecard">
                                    <Form.Label>Name on card</Form.Label>
                                    <Form.Control type="text" name="namecard" required
                                        value={this.state.namecard}
                                        onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="cardnumber">
                                    <Form.Label>Credit card number</Form.Label>
                                    <Form.Control type="text" placeholder="1234-1234-1234-1234" name="cardnumber" required pattern="[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{4}"
                                        value={this.state.cardnumber}
                                        onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Col xs={4}>
                                    <Form.Group Col={4} controlId="expiration">
                                        <Form.Label>Expiration</Form.Label>
                                        <Form.Control type="Date" name="expiration" required
                                            value={this.state.expiration}
                                            onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col xs={4}>
                                    <Form.Group Col={4} className="mr-2" controlId="cvv">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control type="number" name="cvv" required placeholder="000" min="100" max="999"
                                            value={this.state.cvv}
                                            onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                            <div className="m-2">
                                <h6>Final rental price: <span className="badge badge-secondary">{this.props.total} €</span></h6>
                                <h6>Payment result: <span className="badge badge-secondary">{this.state.msg}</span></h6>
                                {this.controlButton(this.state.msg)}
                            </div>
                        </Form>


                    </Fragment>
                )}
            </AuthContext.Consumer>










        );
    }
}

export default Checkout;