"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const paginationValidator_1 = require("../validation/paginationValidator");
const pagination = (req, res, next) => {
    const result = paginationValidator_1.validatePagination.safeParse(req.query);
    if (!result.success) {
        res.status(400).json({
            error: "Invalid query parameters",
            issues: result.error.format(),
        });
        return;
    }
    // Overwrite query with validated numbers for downstream use
    req.query.page = String(result.data.page);
    req.query.pageSize = String(result.data.pageSize);
    next();
};
exports.pagination = pagination;
