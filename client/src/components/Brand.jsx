import React, { Component } from 'react';

class Brand extends Component {
    state = {}
    render() {
        return (
            <article className="card-group-item">
                <header className="card-header">
                    <h6 className="title">Brands </h6>
                </header>
                <div className="filter-content">
                    <div className="card-body">
                        <form>{
                            this.props.brands.map(item =>
                                <label className="form-check" key={item.brand}>
                                    <input className="form-check-input" id={item.brand} type="checkbox" value=""
                                        onClick={(event) => this.props.onFilter(item.brand, event.target.checked)}
                                    />
                                    <span className="form-check-label">{item.brand}</span>
                                </label>
                            )}
                        </form>
                    </div>
                </div>
            </article>
        );
    }
}

export default Brand;