import mongoose from "mongoose"

let isConnected:boolean = false


// MONGODB_URL=mongodb+srv://root:root@cluster0.x8fy1zc.mongodb.net/?retryWrites=true&w=majority
export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true)

  if(!process.env.MONGODB_URL) return console.log("MISIING MONGODB_URL")

  if(isConnected){
    console.log("MOngoDB is already connected")
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "DevFlow"
    })

    isConnected = true

    console.log("Mongodb is connected")
  } catch (error) {
    console.error(error)
  }

}