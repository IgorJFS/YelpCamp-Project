class ExpressError extends Error {
    constructor(message: string, public statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default ExpressError;