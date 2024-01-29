import CryptoJS from "crypto-js"

export const decodeString = (encode, slug) => {
    const bytes = CryptoJS.AES.decrypt(encode, slug)
    const decodeText = bytes.toString(CryptoJS.enc.Utf8)
    return decodeText   
}