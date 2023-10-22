import mongoose from "mongoose"

let isConnected:boolean = false


export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true)

  if(!process.env.MONGODB_URL) return console.log("MISSING MONGODB_URL")

  if(isConnected){
    console.log("MongoDB is already connected")
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