import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            trim:true
        },
        list:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'List',
            required:true
        },
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        status:{
            type: String,
            enum:['Pending','In-progress','Done'],
            default:'Pending'
        },
        dueDate:{
            type:Date
        },
        position:{
            type: Number,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Task = mongoose.model('Task',taskSchema)
export default Task;