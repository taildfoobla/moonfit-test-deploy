import ApiService from "./api"
import battle from "../../components/Battle";

const getBattleActivities = async params => {
    return await ApiService.makeRequestV1.get(`/battle/activities-battle`, { params: params })
}

const getBattleDetail = async slug => {
    // return await ApiService.makeRequestV1.get(`battle/wc-2022/match?slug=${slug}`)
    return await ApiService.makeRequestV1.get(`battle/detail-battle?slug=${slug}`)
}

/**
 * @param {Number|String}blockchainClanId
 * @param {Object} battle
 * @returns {{}|{clan_id: Number, logo: String, name: String, background: String}}
 */
const mappingClanWithBlockchain = (blockchainClanId, battle) => {
    if (!battle || !battle.metadata || !battle.metadata.mappingClans || !battle.metadata.mappingClans[blockchainClanId]) {
        return {}
    }

    const item = battle.metadata.mappingClans[blockchainClanId]

    return {
        clan_id: blockchainClanId,
        logo: '',
        name: '',
        background: '',
        ...item
    }
}

const ClanBattleService = {
    getBattleActivities,
    mappingClanWithBlockchain,
    getBattleDetail,
}

export default ClanBattleService
