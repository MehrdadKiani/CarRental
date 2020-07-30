class Car {
    constructor(id, model, brand, categoryName, price, status) {
        if (id) {
            this.id = id;
        }
        this.model = model;
        this.brand = brand;
        this.categoryName = categoryName;
        this.price = price;
        this.status = status;
    }

    /**
     * Construct a Car from a plain object
     * @param {{}} json 
     * @return {Car} the newly created Car object
     */
    static from(json) {
        const t = Object.assign(new Car(), json);
        return t;
    }

}

export default Car;

