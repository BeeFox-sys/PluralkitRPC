const clientId = '685644933797117999';
const DiscordRPC = require('discord-rpc');
const bent = require('bent')
const getJSON = bent('json',200,404,403)
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
var system = null
var members = null
var memberToggle = false
async function updateInfo(){
    console.debug(`${new Date().toISOString()}: Updating Info`)
    system = await getJSON(`https://api.pluralkit.me/v1/a/${rpc.user.id}`)
    if(system == "Account not found."){
        console.error("This account does not have a pluralkit system!")
        process.exit(1)
    }
    members = await getJSON(`https://api.pluralkit.me/v1/s/${system.id}/members`)
    if(members == "Unauthorized to view member list."){
        members = null
    }
}
async function setActivity(){
    console.debug(`${new Date().toISOString()}: Updating Rich Presence`)
    let switchEntry = await getJSON(`https://api.pluralkit.me/v1/s/${system.id}/fronters`)
    let fronters = switchEntry.members || null
    let timestamp = null
    if(fronters) timestamp = new Date(switchEntry.timestamp)
    let name = trunicate(system.name,128)

    let desc = "If you are seeing this, something went wrong"
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
    if(!fronters || memberToggle){
        desc = members?`${members.length} members`:"  "
    } else if(!fronters.length){
        desc = `No Fronter`
    } else {
        for (let index = 0; index < fronters.length; index++) {
            const names = fronters.map(m=>m.name)
            desc = formatter.format(names.slice(0,index+1))
            if(desc.length > 114){
                desc = formatter.format(names.slice(0,index))+` and ${fronters.length-(index+1)} more`
                break
            }
        }
    }
    rpc.setActivity({
        details: name,
        state: desc,
        largeImageKey: "large",
        largeImageText: "Pluralkit",
        startTimestamp: (fronters && !memberToggle)?timestamp:null,
        instance: false,
      })
    memberToggle = !memberToggle
}

rpc.on('ready',async () => {  
    console.debug(`${new Date().toISOString()}: Connected to ${rpc.user.username}#${rpc.user.discriminator} (${rpc.user.id}) via application ${rpc.clientId}`)
    await updateInfo()
    setInterval(() => {
        updateInfo();
    }, 600e3); //10m
    setActivity();
    setInterval(() => {
        setActivity();
    }, 15e3); // 15s
})
rpc.login({ clientId }).catch(error => {
    if(error == "Error: Could not connect") return console.error("Could not connect! Discord is probably closed")
    console.error(error)
});


function trunicate(string,length){
    if(string.length < length) return string
    return string.substring(0,length-1)+"…"
}