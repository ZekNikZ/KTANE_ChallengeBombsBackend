declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            role?: import('../roles/Role');
            apiKey?: boolean;
            dbObj?: import('../db/models/User');
        };
        data?: {
            user?: import('../db/models/User');
            category?: import('../db/models/Category');
            token?: import('../db/models/AccessToken');
            profile?: import('../db/models/Profile');
        };
    }
}
