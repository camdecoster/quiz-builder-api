// Make first letter of string uppercase
function firstLetterUppercase(stringToChange) {
    if (typeof stringToChange !== "string") return "";
    return stringToChange.charAt(0).toUpperCase() + stringToChange.slice(1);
}

module.exports = {
    firstLetterUppercase,
};
