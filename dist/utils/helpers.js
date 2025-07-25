"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalToFloat = void 0;
// utils/helpers.ts
const decimalToFloat = (value) => {
    return typeof value === "object" && value !== null ? parseFloat(value.toString()) : value;
};
exports.decimalToFloat = decimalToFloat;
