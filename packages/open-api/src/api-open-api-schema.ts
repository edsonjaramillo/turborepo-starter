export interface paths {
    "/users/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get a list of users */
        get: operations["getUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Sign in a user and create a session */
        post: operations["postAuthSign-in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sign-up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Create a new user */
        post: operations["postAuthSign-up"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getUsers: {
        parameters: {
            query?: {
                limit?: string;
                page?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Response for status 200 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "success";
                        payload: {
                            id: string;
                            firstName: string;
                            lastName: string;
                        }[];
                        message: string;
                    };
                };
            };
        };
    };
    "postAuthSign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: email */
                    email: string;
                    password: string;
                };
                "application/x-www-form-urlencoded": {
                    /** Format: email */
                    email: string;
                    password: string;
                };
                "multipart/form-data": {
                    /** Format: email */
                    email: string;
                    password: string;
                };
            };
        };
        responses: {
            /** @description Response for status 200 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "success";
                        payload: {
                            firstName: string;
                            lastName: string;
                            /** Format: email */
                            email: string;
                        };
                        message: string;
                    };
                };
            };
            /** @description Response for status 401 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "error";
                        message: string;
                    };
                };
            };
            /** @description Response for status 500 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "error";
                        message: string;
                    };
                };
            };
        };
    };
    "postAuthSign-up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example Nick */
                    firstName: string;
                    /** @example Fury */
                    lastName: string;
                    /**
                     * Format: email
                     * @example nick.fury@example.com
                     */
                    email: string;
                    /** @example abcd1234 */
                    password: string;
                };
                "application/x-www-form-urlencoded": {
                    /** @example Nick */
                    firstName: string;
                    /** @example Fury */
                    lastName: string;
                    /**
                     * Format: email
                     * @example nick.fury@example.com
                     */
                    email: string;
                    /** @example abcd1234 */
                    password: string;
                };
                "multipart/form-data": {
                    /** @example Nick */
                    firstName: string;
                    /** @example Fury */
                    lastName: string;
                    /**
                     * Format: email
                     * @example nick.fury@example.com
                     */
                    email: string;
                    /** @example abcd1234 */
                    password: string;
                };
            };
        };
        responses: {
            /** @description Response for status 201 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "success";
                        payload: Record<string, never>;
                        message: string;
                    };
                };
            };
            /** @description Response for status 400 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "error";
                        message: string;
                    };
                };
            };
            /** @description Response for status 409 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @constant */
                        status: "error";
                        message: string;
                    };
                };
            };
        };
    };
}
