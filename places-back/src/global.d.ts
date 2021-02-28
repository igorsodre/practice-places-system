type Nullable<T> = T | undefined | null;
type IAppTokenFormat = {
    userId: string;
    email?: string;
};

declare namespace Express {
    export interface Request {
        userData?: IAppTokenFormat;
    }
}
