import React from 'react'
import "./styles.less"
import noData from "../../../../../assets/images/assets-management/no-data.png"

export default function NoData({type}) {
  return (
   <div className='no-data'>
        <img src={noData} alt=''/>
        <p>No {type}</p>
   </div>
  )
}
