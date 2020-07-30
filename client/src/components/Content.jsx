import React, { Component, Fragment } from 'react';
import CarList from './CarList'

class Content extends Component {

    render() {
        return (
            <Fragment>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4">
                    <CarList object={this.props.cars} />
                </main>
            </Fragment>
        );
    }
}

export default Content;