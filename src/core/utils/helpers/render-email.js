export const renderEmail=(email,digit)=>{
    if(email){
        const arr = email?.split("@")
        const arr0=arr[0]
        const arr1=arr[1]
        let newArr0=arr0+"@"
        let newArr1=arr1
        if(arr0?.length>digit+4){
            newArr0=arr0.slice(0,digit)+"...@"
          }
        if(arr1?.length>digit+3){
            newArr1=arr1.slice(0,digit/2)+"..."+arr1.slice(arr1.length-digit/2,arr1.length)
        }
        return newArr0+newArr1
    }
  
}