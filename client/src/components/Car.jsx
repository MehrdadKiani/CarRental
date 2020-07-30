import React, { Component } from 'react';

class Car extends Component {
    render() {
        return (
            <tr>
                {/* <td>{this.props.id}</td> */}
                <td>{this.props.model}</td>
                <td>{this.props.brand}</td>
                <td>{this.props.categoryName}</td>
                <td>{this.props.price}</td>
            </tr>
        );
    }
}

export default Car;