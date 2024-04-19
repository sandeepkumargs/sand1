// User Service Layer

import userDb from "../database/userDb.js";

const getAllUsers = async () => {
  console.log("in user service, getAllUsers ");
  return await userDb.getUsers();
};

const getOneUser = async (id) => {
  console.log("in user service, id is ", id);
  return await userDb.getUserData(id);
};

const getUserAnalytics = async(id) =>{
  return await userDb.getUserAnalytics(id);
}

const getMasterData = async () => {
  return await userDb.getMasterData();
};

const updateUserScores = async (id,doc) => {
  return await userDb.updateUserScores(id,doc);
};

const updateCertificates =  async (id,doc) => {
  return await userDb.updateCertificates(id,doc);
};

const updateExperience = async (id,doc) => {
  return await userDb.updateExperience(id,doc);
};

const updateEducation =  async(id,doc) =>{
  return await userDb.updateEducation(id,doc);
};

const getHierarchyMaster = async () =>{
  return await userDb.getHierarchyMaster();
}

export default {getUserAnalytics,getHierarchyMaster, getAllUsers,getOneUser,getMasterData,updateUserScores,updateCertificates,updateExperience,updateEducation}