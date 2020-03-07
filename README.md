# Pluralkit RPC
This is a small node program that displays your pluralkit system, the current fronters, and the size of your system, in the discord Rich Presence on your profile.
Nothing needs to be configured from the program, it will automatically detect the account and fetch all public information (private information cannot be fetched)

Info (System name and member count) is fetched on start and every 10 minutes
Fronters are fetched every 15 seconds

# Running the app
## Executable
There are executables build in the executable directory, downloading one of these (appropriate to your OS) and running it will start the app
## Node
You can also run this via node. It is as simple as running `npm start`.