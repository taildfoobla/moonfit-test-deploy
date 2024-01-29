// export default function (number) {
//     return number
//         ? number
//               .toString()
//               .replace(/\D/g, "")
//               .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//         : ""
// }
export default function (number) {
    const result = +number
    return result ? result.toLocaleString() : "0"
}
