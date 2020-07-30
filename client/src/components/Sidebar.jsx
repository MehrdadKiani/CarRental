import React, { Component, Fragment } from 'react';

import Brand from './Brand'
import Category from './Category'

class Sidebar extends Component {
    state = {}
    render() {
        return (
            <Fragment>
                <div className="col-sm-3">
                    <div className="card">
                        <Category onFilter={this.props.onFilter} />
                        <Brand brands={this.props.brands} onFilter={this.props.onFilter} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Sidebar;