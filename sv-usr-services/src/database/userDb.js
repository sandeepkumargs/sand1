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

async function getHierarchyMaster(){
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_HIE);
        const result = await coll.findOne();
        return result;
    } finally {
        await client.close();
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

/**
 * This is depricated, F.E is using /user/xxxx
 * @param {*} uid 
 * @returns 
 */
async function getUserAnalytics(uid){
    try{
        await client.connect();
        console.log("in getUserAnalytics Data, id is ", uid);
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const data = await coll.findOne({"skills_master.user.u_id":uid});
        const topSkills = data?.skills_master.categories
        ?.filter((category) => Boolean(category.my_score))
        .sort((a, b) => (b.my_score / b.total_score) - (a.my_score / a.total_score));
        await getUserAnalyticsSubCats(topSkills);
        return topSkills;
    }catch(err) {
        console.log("error in getUserAnalytics ",err);
        return null;
    }finally{
        await client.close();
    }
}

/**
 * depricated, not used by FE anymore
 * FE uses /users/xxxx 
 * @param {*} topSkills 
 * @returns 
 */
async function getUserAnalyticsSubCats(topSkills){
    try{
        for(var i=0;i<topSkills.length;i++){
            //define how many subcategories and provide aggregates
            topSkills[i]["sub-category"].forEach(subCategory =>{
                let score = subCategory.concern.reduce((acc, cur) => acc + parseInt(cur.score), 0);
                subCategory.my_score = score;
                subCategory.total_score = parseInt((subCategory.concern.length)*4);
            });
        }
        console.log("topSkills Cat and SubCat ", topSkills);
        return topSkills;
    }catch(err){
        console.log("err in getUserAnalyticsSubCats ",err);
        return null;
    }
}

/*
On every save :-
- Update Scores of all subcategories and categories
*/
async function reCalcScores(doc){
    try {
        //update sub-category scores
        doc.skills_master.categories.forEach(category =>{
            category["sub-category"].forEach(subcategory =>{
                subcategory.my_score = subcategory.concern.reduce((acc, cur) => acc + parseInt(cur.score), 0);
                subcategory.total_score = subcategory.concern.reduce((acc, cur) => acc + 4, 0);
            });
        });

        //update category scores
        doc.skills_master.categories.forEach(category =>{
            category.my_score = category["sub-category"].reduce((acc,cur) => acc + parseInt(cur.my_score),0);
            category.total_score = category["sub-category"].reduce((acc,cur) => acc + parseInt(cur.total_score),0);
            console.log("cat ",category.name,category.my_score,category.total_score);
        });

    return doc;

    } catch (err) {
        console.log("Error in reCalcScores : ",err);
        return null;
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

async function updateUserScores(uid,doc){
    try{
        const newdoc = await reCalcScores(doc);
        const result = await replaceDoc(uid,newdoc);
        return result;
    }catch(err){
        console.log("Error updating User Scores");
        return null;
    }finally{
        await client.close();
    }
}

async function updateEducation(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }catch(err){
        console.log("Error updating Education");
        return null;
    }finally{
        await client.close();
    }
}

async function updateCertificates(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }catch(err){
        console.log("Error updating Certificates");
        return null;
    }finally{
        await client.close();
    }
}

async function updateExperience(uid,doc){
    try{
        const result = await replaceDoc(uid,doc);
        return result;
    }catch(err){
        console.log("Error updating Experience Scores");
        return null;
    }finally{
        await client.close();
    }
}

export default {getUserAnalytics,getHierarchyMaster, testPing,getMasterData,getUserData,getUsers,updateUserScores,updateEducation,updateCertificates,updateExperience};