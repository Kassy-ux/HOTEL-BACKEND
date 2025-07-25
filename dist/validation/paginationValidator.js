"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = void 0;
const zod_1 = require("zod");
exports.validatePagination = zod_1.z.object({
    page: zod_1.z.string().transform(Number).refine((val) => Number.isInteger(val) && val > 0, {
        message: "page must be a positive integer",
    }).optional(),
    pageSize: zod_1.z.string().transform(Number).refine((val) => Number.isInteger(val) && val > 0, {
        message: "pageSize must be a positive integer",
    }).optional(),
});
