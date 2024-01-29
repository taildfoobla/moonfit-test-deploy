import { getPersonalSignMessage } from "./blockchain";

export const handleSignOnChainMetaMask= async (provider,account)=>{
    try {
        const signMessage = `MoonFit:${account}:${new Date().getTime()}`
        const signature = await provider.request({
            method: "personal_sign",
            params: [getPersonalSignMessage(signMessage), account],
        })
}