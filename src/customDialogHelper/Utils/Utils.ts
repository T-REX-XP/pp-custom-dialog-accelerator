export function convertToSize(input: number | string, defaultSize: number): number | Xrm.Navigation.NavigationOptions.SizeValue | undefined {
    let result: number | Xrm.Navigation.NavigationOptions.SizeValue | undefined = defaultSize;
    if (typeof input === "number") {
        if (input > 0) {
            result = input;
        }
    } else {
        const parsedInput = Number(input);
        if (isNaN(parsedInput)) {
            if (input.endsWith("px")) {
                const numberPart = Number(input.substring(0, input.length - 2));
                if (!isNaN(numberPart)) {
                    result = { value: numberPart, unit: "px" };
                }
            } else if (input.endsWith("%")) {
                const numberPart = Number(input.substring(0, input.length - 1));
                if (!isNaN(numberPart)) {
                    result = { value: numberPart, unit: "%" };
                }
            }
        } else {
            if (parsedInput > 0) {
                result = parsedInput;
            }
        }
    }
    return result;
}