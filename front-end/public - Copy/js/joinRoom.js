const joinRoom = (dataString) => {
    namespacesChat[token].emit('joinsRoom',data,(err,val)=> {
        if(err) {
            console.log(err)
        } else {
            if(val.length !==0 ){
                val.forEach(data => {
                    console.log(data.message)
                })
            }
        }
    })
}