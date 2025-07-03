// utils/helpers.ts
export const decimalToFloat = (value: any) => {
    return typeof value === "object" && value !== null ? parseFloat(value.toString()) : value;
  };
  