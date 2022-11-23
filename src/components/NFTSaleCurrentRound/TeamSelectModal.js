import React, { useState } from "react"
import { WORLDCUP_TEAMS } from "../../constants/worldcup-team"
import { Modal } from "antd"

const TeamSelectModal = (props) => {

    const { open, handleCancel, onChangeTeam } = props
    const [selectedTeam, setSeletectedTeam] = useState(null)

    const onSelectTeam = (team, forceClose = false) => {
        setSeletectedTeam(team)

        if(forceClose) {
            onChangeTeam(team)
            handleCancel()
        }
    }

    return (
        <Modal
            title="PICK A TEAM"
            visible={open}
            footer={false}
            onCancel={handleCancel}
            closeIcon={(
                <svg className={'cursor-pointer'} width="32" height="32" viewBox="0 0 32 32" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="30" height="30" rx="6" stroke="white" strokeOpacity="0.2"
                        strokeWidth="2" />
                    <path d="M21.0625 10.9375L10.9375 21.0625" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.0625 21.0625L10.9375 10.9375" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            wrapClassName={'wrapper-modal'}
        >
            <div className="grid grid-cols-3 gap-4 list-team">
                {
                    WORLDCUP_TEAMS.map((team) => (
                        <div key={`${team.name}`} className="team text-center"
                             onClick={() => onSelectTeam(team)}
                             onDoubleClick={() => onSelectTeam(team, true)}
                        >
                            <div className={`team-image${selectedTeam && (selectedTeam.name === team.name) ? " selected" : ""}`}>
                                <div className="team-image-border">
                                    <img src={team.url} />
                                </div>
                            </div>
                            <span className={`race-sport-font team-name text-[16px] font-normal${selectedTeam && (selectedTeam.name === team.name) ? " text-[#E4007B]" : ""}`}>{team.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-row">
                <button
                    type="button"
                    disabled={!selectedTeam}
                    className="w-full mt-5 button button-primary" onClick={() => { onChangeTeam(selectedTeam); handleCancel() }}>
                    CONFIRM
                </button>
            </div>
        </Modal>
    )
}

export default TeamSelectModal
