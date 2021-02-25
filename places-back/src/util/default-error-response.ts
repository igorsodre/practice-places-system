export class DefaultErrorResponse extends Error {
    constructor(message?: string, public code?: number) {
        super(message);
    }
}
