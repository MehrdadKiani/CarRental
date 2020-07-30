import React, { Component } from 'react';
import API from '../api/API'
import Spinner from 'react-bootstrap/Spinner'
class History extends Component {
    constructor(props) {
        super(props);
        this.state = { val: '', isCanceled: false };
    }

    componentDidMount() {
        this.buildBtn(this.props.endDateTime);
    }

    handleChange = (values) => {
        let data = values.split(',');
        let carId = data[0];
        let rentId = data[1];

        API.updateCar(carId, { status: 0 })
            .then()
            .catch((errorObj) => {
                console.log(errorObj);
            });
        API.updateRent(rentId, { status: 1 })
            .then(this.props.getHistories())
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    buildBtn = (date, status) => {
        let g1 = new Date();
        let g2 = new Date(date);
        if (g1.getTime() < g2.getTime()) {
            if (status === 0) {
                return <td><button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(event) => this.handleChange(event.target.value)}
                    value={`${this.props.carId},${this.props.id}`}>Cancel</button></td>
            }
            else
                return <td><button type="button" className="btn btn-danger btn-sm" disabled >
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />Cancel</button></td>
        }
        else {
            return <td></td>
        }
    }

    buildStatus = (status) => {
        if (status === 1) {
            return <span class="badge badge-pill badge-primary">Canceled by user</span>
        }
        else if (status === 2) {
            return <span class="badge badge-pill badge-success">Expired</span>
        }
        else {
            return <span class="badge badge-pill badge-warning">In process</span>
        }
    }


    render() {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.carCategory}</td>
                <td>{this.props.total}</td>
                <td>{this.props.startDateTime}</td>
                <td>{this.props.endDateTime}</td>
                <td>{this.buildStatus(this.props.status)}</td>
                {this.buildBtn(this.props.endDateTime, this.props.status)}
            </tr>
        );
    }
}
export default History;