// import React, { useEffect, useState } from "react"
// import ClanBattleWrapper from "../../components/Wrapper/ClanBattleWrapper/ClanBattleWrapper"
// import { useAuth } from "../../core/contexts/auth"
// import BattleListTeam from "./components/BattleListTeam"
// import PrizePool from "./components/PrizePool"
// import Timeline from "./components/Timeline"
// import TransactionHistory from "./components/TransactionHistory"
// import { useParams } from "react-router-dom"
// import "./styles.less"
// import ClanBattleService from "../../core/services/clan-battle"
// import clanBattleContract from "../../core/services/clan-battle-contract";
// import { BATTLE_STATUS } from '../../core/utils/constants/clan-battle'
// import { newDepositTransaction, notificationError } from "../../core/utils/helpers/notification";

// /* eslint-disable no-restricted-globals */
// const ClanBattle = () => {
//     const params = useParams()
//     const { onDisconnect, auth, provider } = useAuth()
//     const { user } = auth
//     const [battle, setBattle] = useState(null)
//     const [width, setWidth] = useState(window.innerWidth)
//     const [contract, setContract] = useState(null)
//     const [clansBattle, setClansBattle] = useState([])
//     const [betTimeLock, setBetTimeLock] = useState(0)
//     const [prizePool, setPrizePool] = useState(0)
//     const [battleStatus, setBattleStatus] = useState(BATTLE_STATUS.RUNNING)
//     const [victoryTeam, setVictoryTeam] = useState(null)
//     const [battleUser, setBattleUser] = useState(null)
//     const [isLoading, setIsLoading] = useState(false)
//     const [refreshTransaction, setRefreshTransaction] = useState(false)

//     const _newTransactions = {}

//     const updateDimensions = () => {
//         setWidth(window.innerWidth);
//     }

//     useEffect(() => {
//         const interval = setInterval(() => {
//             let open = false
//             Object.values(_newTransactions).forEach(({isOpen, id, transaction, transactionHash}) => {
//                 if (open || isOpen) {
//                     return
//                 }

//                 open = true
//                 _newTransactions[id].isOpen = true

//                 // console.log({transaction, transactionHash, clansBattle});

//                 newDepositTransaction(transaction, transactionHash, clansBattle, {duration: 5})
//             })
//         }, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         init().then()

//         return () => null
//     }, [onDisconnect])

//     useEffect(() => {
//         window.addEventListener("resize", updateDimensions);
//         return () => window.removeEventListener("resize", updateDimensions);
//     }, []);

//     const init = async () => {
//         if (isLoading) {
//             return
//         }

//         setIsLoading(true)
//         try {
//             const { data } = await ClanBattleService.getBattleDetail(params.id);
//             setBattle(data)
//             document.title = data?.battle?.name || "Moonfit x Worldcup 2022"
//             document.description = "Moonfit x Worldcup 2022"
//             if (!data.battle) {
//                 return notificationError('Battle is invalid')
//             }

//             if (!data.battle.contract) {
//                 return notificationError('Battle contract is invalid')
//             }

//             const { metadata } = data.battle

//             if (!metadata) {
//                 return notificationError('Battle metadata is invalid')
//             }

//             if (!metadata.betTimeLock) {
//                 return notificationError('Battle betTimeLock is invalid')
//             }

//             if (!metadata.mappingClans || Object.keys(metadata.mappingClans).length !== 2) {
//                 return notificationError('Battle mappingClans is invalid')
//             }

//             let _victoryTeam = data.battle.winner_clan_id
//             if (!_victoryTeam) {
//                 const clanBattles = data.clan_battles
//                 if (clanBattles[0]?.total_level !== clanBattles[1]?.total_level) {
//                     _victoryTeam = clanBattles[0]?.total_level > clanBattles[1]?.total_level ? clanBattles[0]?.clan_id : clanBattles[1]?.clan_id
//                 }
//             }

//             const { mappingClans } = metadata
//             if (_victoryTeam) {
//                 Object.values(mappingClans).forEach(item => {
//                     if (item.clan_id == _victoryTeam) {
//                         setVictoryTeam(item.contract_clan)
//                     }
//                 })
//             }

//             const _contract = clanBattleContract(data.battle.contract)
//             window.contracts = window.contracts || {}
//             window.contracts[location.pathname] = _contract
//             setContract(_contract)
//             fetchUserInfo(_contract).then()

//             _contract.subscribeTransactions(subscribeTransactions, {pathname: location.pathname})
//             await fetchClanBattle(_contract, mappingClans)

//             let _battleStatus = data.battle.status
//             if (_battleStatus === BATTLE_STATUS.RUNNING && data?.battle?.metadata?.betTimeLock < Date.now()) {
//                 _battleStatus = BATTLE_STATUS.BET_LOCKED
//             }

//             // setBetTimeLock(data?.battle?.metadata?.betTimeLock)

//             // world cup
//             setBetTimeLock(new Date(data?.battle?.metadata?.betTimeLock).getTime())
//             setBattleStatus(_battleStatus)

//             setIsLoading(false)
//         } catch (e) {
//             console.error(e)
//         }
//     }

//     const fetchUserInfo = async (_contract) => {
//         _contract = _contract || contract || window.contracts[location.pathname]
//         if (user && user.account) {
//             setBattleUser(await _contract.getUser(user.account))
//         }
//     }
//     const fetchClanBattle = async (_contract, _mappingClans) => {
//         _contract = _contract || contract || window.contracts[location.pathname]
//         const mappingClans = _mappingClans || battle?.battle?.metadata?.mappingClans

//         const clanData = await _contract.getClans()
//         const objClans = {}
//         let pool = 0
//         clanData.forEach(clan => {
//             pool += clan.balance
//             objClans[clan.id] = clan

//             mappingClans[clan.id].balance = clan.balance
//         })

//         const _calculateRate = (current, total, size) => {
//             if (total === 0) {
//                 return Math.round(100 / size * 10000) / 10000
//             }

//             return Math.round(current / total * 10000) / 100
//         }

//         let _rate = 0
//         const countClans = Object.values(mappingClans).length

//         Object.values(mappingClans).forEach((item, index) => {
//             const tmp = _calculateRate(item.balance, pool, countClans)
//             mappingClans[item.contract_clan].rate = tmp

//             if (index + 1 === countClans) {
//                 mappingClans[item.contract_clan].rate = Math.round((100 - _rate) * 1000) / 1000
//             } else {
//                 _rate += tmp
//             }
//         })
//         setClansBattle(mappingClans)
//         setPrizePool(pool)
//     }

//     const handleBetTimeLocked = () => {
//         if (battleStatus === BATTLE_STATUS.RUNNING) {
//             setBattleStatus(BATTLE_STATUS.BET_LOCKED)
//         }
//     }

//     const subscribeTransactions = async ({ name, event, transaction, pathname }) => {
//         if (!transaction || !!_newTransactions[transaction.id] || pathname !== location.pathname) {
//             return
//         }

//         _newTransactions[transaction.id] = {
//             id: transaction.id,
//             transaction,
//             transactionHash: event.transactionHash
//         }

//         // console.log('NewTransition', { name, event }, transaction);
//         await fetchClanBattle()
//         if (String(transaction.address).toLowerCase() === String(user.account).toLowerCase()) {
//             await fetchUserInfo()
//         }
//     }

//     return (
//         <>
//             {
//                 !isLoading && battle && <ClanBattleWrapper>
//                     <div className="clan-battle-container">
//                         <BattleListTeam
//                             battle={battle}
//                             listTeam={battle?.clan_battles}
//                         />
//                         {/* <BattleListTeam
//                             battle={battle}
//                             listTeam={battle?.clan_battles}
//                             mappingClans={battle?.battle?.metadata?.mappingClans}
//                         /> */}
//                         <Timeline
//                             width={width}
//                             slug={params.id}
//                             battle={battle?.battle}
//                             listTeam={battle?.clan_battles}
//                             createdAt={battle?.battle?.created_at}
//                             timelines={battle?.activities?.activities}
//                         />

//                         <PrizePool
//                             width={width}
//                             user={user}
//                             battle={battle?.battle}
//                             provider={provider}
//                             clansBattle={clansBattle}
//                             contract={contract}
//                             betTimeLock={betTimeLock}
//                             battleStatus={battleStatus}
//                             handleBetTimeLocked={handleBetTimeLocked}
//                             depositMapping={battle?.battle?.metadata?.depositMapping || {}}
//                             prizePool={prizePool}
//                             victoryTeam={victoryTeam}
//                             battleUser={battleUser}
//                             refreshTransaction={refreshTransaction}
//                         />
//                         <TransactionHistory
//                             clansBattle={clansBattle}
//                             contract={contract}
//                             setRefreshTransaction={setRefreshTransaction} />
//                     </div>

//                 </ClanBattleWrapper>}
//         </>
//     )
// }

// export default ClanBattle
