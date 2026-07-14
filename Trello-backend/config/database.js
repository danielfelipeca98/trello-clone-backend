import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
    try{
        if(!process.env.MONGO_URL){
            throw new Error("MONGO_URL  no esta definida en .env")
        }
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoose conectado")
        console.log(`base de datos : ${mongoose.connection.name}`)
        return mongoose.connection        
    }
    catch(error){
        console.error(`Error al conectarse a MongoDb${error.message}`)
        throw error;
    }
}

export async function disconnectDB(){
    try{
        await mongoose.disconnect();
        console.log('Conexion cerrada')
    }catch(error){
        console.log('Error al cerrar conexion;'.error.message);
    }
}