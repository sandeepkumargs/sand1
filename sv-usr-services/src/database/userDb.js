import { MongoClient,ServerApiVersion } from "mongodb";
import 'dotenv/config';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

// Test Ping with the Db - Could be 1 db for 1 Microservice
async function testPing() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
testPing().catch(console.dir);

async function getMasterData() {
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_MAS);
        const result = await coll.findOne();
        console.log(result);
        return result;
    } finally{
        await client.close()
    }
}

/**
 * @returns a list of all users in the db
 */
async function getUsers(){
    try{
        await client.connect();
        console.log("in db, getUsers..");
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const result = await coll.find({});
        console.log(result);
        return result;
    } finally{
        await client.close();
    }
}

/**
 * @param {*} uid 
 * @returns a user matching the uid
 */
async function getUserData(uid) {
    try{
        await client.connect();
        console.log("in getUserData, id is ", uid);
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const result = await coll.findOne({"skills_master.user.u_id":uid});
        console.log(result);
        return result;
    } finally{
        await client.close();
    }
}

async function replaceDoc(uid,doc){
    try{
        await client.connect();
        console.log("in replaceDoc, uid is ", uid);
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const result = await coll.replaceOne({"skills_master.user.u_id":uid},doc);
        console.log("finishied updating with status ",result);
        return result;
    }finally{
        await client.close();
    }
}

async function updateUser(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }finally{
        await client.close();
    }
}

async function updateEducation(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }finally{
        await client.close();
    }
}

async function updateCertificates(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }finally{
        await client.close();
    }
}

async function updateExperience(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }finally{
        await client.close();
    }
}

export default {testPing,getMasterData,getUserData,getUsers,updateUser,updateEducation,updateCertificates,updateExperience};