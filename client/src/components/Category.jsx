import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

class Category extends Component {
    state = {}
    render() {
        return (
            <article className="card-group-item">
                <header className="card-header">
                    <h6 className="title">Categories </h6>
                </header>
                <div className="filter-content">
                    <div className="card-body">
                        <Form.Group>
                            <label className="form-check" key="#A">
                                <input className="form-check-input" id={"ca"} type="checkbox" value=""
                                    onClick={(event) => this.props.onFilter("category_a", event.target.checked)} />
                                <span className="form-check-label">Category A</span>
                            </label>
                            <label className="form-check" key="#B">
                                <input className="form-check-input" id={"cb"} type="checkbox" value=""
                                    onClick={(event) => this.props.onFilter("category_b", event.target.checked)} />
                                <span className="form-check-label">Category B</span>
                            </label>
                            <label className="form-check" key="#C">
                                <input className="form-check-input" id={"cc"} type="checkbox" value=""
                                    onClick={(event) => this.props.onFilter("category_c", event.target.checked)} />
                                <span className="form-check-label">Category C</span>
                            </label>
                            <label className="form-check" key="#D">
                                <input className="form-check-input" id={"cd"} type="checkbox" value=""
                                    onClick={(event) => this.props.onFilter("category_d", event.target.checked)} />
                                <span className="form-check-label">Category D</span>
                            </label>
                            <label className="form-check" key="#E">
                                <input className="form-check-input" id={"ce"} type="checkbox" value=""
                                    onClick={(event) => this.props.onFilter("category_e", event.target.checked)} />
                                <span className="form-check-label">Category E</span>
                            </label>
                        </Form.Group>
                    </div>
                </div>
            </article>
        );
    }
}

export default Category;