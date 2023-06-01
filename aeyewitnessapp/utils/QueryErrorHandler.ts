import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

const QueryErrorHandler: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        
        // Error status 401, ... can be handled here

        return next(action);
    }

export default QueryErrorHandler;
