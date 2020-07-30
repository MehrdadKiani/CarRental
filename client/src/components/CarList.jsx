import React, { Component, Fragment } from 'react';
import Car from './Car'

class CarList extends Component {
    state = {}
    render() {

        return (
            <Fragment>
                <div className="card">
                    <article className="card-group-item">
                        <header className="card-header">
                            <h6 className="title">Cars list </h6>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-sm table-hover">
                                        <thead className=""><tr><th>Model</th><th>Brand</th><th>Category</th><th>Price (€/Day)</th></tr></thead>
                                        <tbody>
                                            {
                                                this.props.object.map((item) =>
                                                    <Car key={item.id} id={item.id} model={item.model} brand={item.brand} categoryName={item.categoryName} price={item.price} />
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </Fragment>
        );
    }
}

export default CarList;