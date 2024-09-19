

export const numToDallor = (value: number): string => {
    if (value < 0 || !Number.isInteger(value)) {
        return "Invalid input: Only positive integers are allowed";
    }

    // Divide the value by 100 to get the decimal format
    const formattedValue = value / 100;

    // Format the number to two decimal places
    return formattedValue.toFixed(2);
}