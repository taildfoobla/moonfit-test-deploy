import { BLC_CONFIGS } from "../configs/blockchain"

export const getScByNftType = (type) => {
    let sc = ""
    switch (type) {
        case "mint_pass":
            sc = BLC_CONFIGS.MINT_PASS_SC
            break;
        case "moon_beast":
            sc = BLC_CONFIGS.MOONBEAST_SC
            break;
        default: break;
    }
    return sc
}