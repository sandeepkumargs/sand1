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

const getMasterData = async () => {
  return await userDb.getMasterData();
};

const updateUser = async (id,doc) => {
  return await userDb.updateUser(id,doc);
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

export default {getAllUsers,getOneUser,getMasterData,updateUser,updateCertificates,updateExperience,updateEducation}