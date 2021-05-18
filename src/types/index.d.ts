declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            role?: import('../enums/Role');
            apiKey?: boolean;
            dbObj?: import('../db/models/User');
        };
        data?: {
            user?: import('../db/models/User');
            token?: import('../db/models/AccessToken');
            pack?: import('../db/models/Pack');
            mission?: import('../db/models/Mission');
        };
    }
}
