class History {
    constructor(id, startDateTime, endDateTime, total, status, userId, carId, carCategory) {
        if (id) {
            this.id = id;
        }
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.total = total;
        this.status = status;
        this.userId = userId;
        this.carId = carId;
        this.carCategory = carCategory;
    }

    /**
     * Construct a History from a plain object
     * @param {{}} json 
     * @return {History} the newly created History object
     */
    static from(json) {
        const t = Object.assign(new History(), json);
        return t;
    }

}

export default History;

