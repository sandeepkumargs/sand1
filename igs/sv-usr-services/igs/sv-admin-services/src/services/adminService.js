// User Service Layer

import adminDb from "../database/adminDb.js";

const getEmployeesHierarchy = async() =>{
  const hierarchy =  await adminDb.getHierarchyMaster(); 
  //console.log("got heirarchy..",hierarchy);

  try{
    // Extracting Progression values into a single array
    const allProgressions = hierarchy["Hierarchy_Progression"].flatMap(entry => {
      if (Array.isArray(entry.Progression)) {
        // Handling case where Progression is an array
        return entry.Progression.flatMap(progression => Object.values(progression));
      } else {
        // Handling case where Progression is an object
        return Object.values(entry.Progression);
      }
    });
    //console.log("all progressions ", allProgressions);
    //get employees for all progressions
    //key :"designation"
    //value : count
    return adminDb.getEmpDesignationCount(allProgressions);
    //return allProgressions;

  }catch(err){
    console.log("err in srv getemployeeshierarchy ",err);
    return null;
  }
};

const getHierarchy = async() =>{
  try{
    const hp =  await adminDb.getHierarchyMaster(); 
    //console.log("got hierarchy..",hp);
    const progressionPairs = [];
    const hierarchyProgression = hp["Hierarchy_Progression"];
    hierarchyProgression.forEach(hierarchy => {
      const progression = hierarchy.Progression;
      if (Array.isArray(progression)) {
        // If progression is an array, iterate over each object
        progression.forEach(progressionObj => {
          Object.entries(progressionObj).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'name') {
              progressionPairs.push({ key, value });
            }
          });
        });
      } else {
        // If progression is an object, extract key-value pairs
        Object.entries(progression).forEach(([key, value]) => {
          progressionPairs.push({ key, value });
        });
      }
    });

    return progressionPairs;

  }catch(err){
    console.log("error in getHierarchy Service ",err);
    return null;
  }
};

const getAnalytics = async () =>{
  return await adminDb.getAnalytics();
};

const getUsers = async() =>{
  return await adminDb.getUsers();
};

const setUserState = async (s_email,i_activeStatus)=>{
  return await adminDb.setUserState(s_email,i_activeStatus);
};

const setUserAdmin = async (s_email,i_AdminStatus) =>{
  return await adminDb.setUserAdmin(s_email,i_AdminStatus);
};

const addUser = async(user) =>{
  const userExists = await adminDb.checkUserExists(user.Email);
  //console.log("user exists service ",userExists);
  if(userExists){
    return {"Status":"Error","Data":"User exists.."}
  }
  //TODO : This has to be an atomic process aka a transaction
  //addNewUser && initUserScores --Commit otherwise --Rollback
  const addStatus = await adminDb.addNewUser(user);
  if(addStatus?.AddUser === "OK"){
      const initStatus = await adminDb.initUserScores(user);
      if (initStatus?.InitUser ==="OK"){
        return {"Status":"OK"};
      }else{
        return null;
      }
  }else{
    return addStatus;
  }
};

/**
 *  //get all employee_scores
 *  //for each employee score
    //for each category, sub-category and skill in searchQry,
    //return employee who's score matches searchCriteria
    //searchCriteria - gte - (Skill_Score AND Skill_Score AND Skill_Score...) gte criteria_val
    //searchCriteria - per - (Skill_Score AND Skill_Score AND Skill_Score...) per criteria_val
 * @param {*} searchJson 
 * @param {*} searchCriteria 
 * @returns all employees who matches the searchJson categories, subcategories, skills and searchCriteria
 */
const searchSkills = async (searchQry,searchQryCriteria,searchQryOperator)=>{
  try {
    //let searchJson=[{"categoryName":"Business Domain","subCategoryNames":["Domain"],"skillNames":["OTT","Healthcare - Remote Patient Monitoring"]}];
    //let searchCriteria = {"criteria_name":"gte","criteria_val":1};
    let matches = [];
    let empScores = await adminDb.getUserScores();
    empScores = empScores.filter(employee =>{
      return Boolean(employee.skills_master.user.isActive) && 
             Boolean(employee.skills_master.user.Role==="User")
    });
    
    //console.log("empScores Len ",empScores.length);
    for(var i=0;i<empScores.length;i++){
      //check if the skills are included
      var isEligible = true;
      var searchEvalList = [];
      for(var j=0;j<searchQry.length;j++){
        //console.log("catName ",searchQry[j].categoryName);
        var empCat = empScores[i].skills_master.categories.find(cat=>cat.name===searchQry[j].categoryName);
        //console.log("sub cat is ",empCat["sub-category"]);
        for(var k=0;k<empCat["sub-category"].length;k++){            
          if(searchQry[j].subCategoryNames.includes(empCat["sub-category"][k].name)){
              for(var l=0;l<searchQry[j].skillNames.length;l++){
                //console.log("search skill:",searchQry[j].skillNames[l]);
                const matchedSkill = empCat["sub-category"][k].concern.find(skill =>  skill.name===searchQry[j].skillNames[l]);
                if(matchedSkill){
                  if(matchedSkill.score >=searchQryCriteria.criteria_val){
                    isEligible = true;
                    searchEvalList.push(isEligible);
                  }
                  else{
                    isEligible = false;
                    searchEvalList.push(isEligible);
                  }
                }
              }
          }
        }
      } //if (isEligible===true){matches.push(empScores[i])}
      const result = await evaluateSearchQueries(searchEvalList,searchQryOperator);
      if(result){
        matches.push(empScores[i].skills_master.user);
      }
    }
    console.log("Search results count : ",matches.length);
    var results={
      count:matches.length,
      matches:matches
    }
  return results;
}catch (err) {
    console.log("Error in searchSkills svc : ",err);
    return null;
}
};

const evaluateSearchQueries = async (searchQueryEvalList,searchQryOperator)=>{
    var evalString = "";
    var operator = (searchQryOperator==="AND") ? '&&' : '||';

    for(var i=0;i<searchQueryEvalList.length;i++){
      if(i==searchQueryEvalList.length-1){
        evalString+=searchQueryEvalList[i];
      }else{
        evalString+=searchQueryEvalList[i]+operator;
      }
    }
    // console.log("evalString is ", evalString, "value is ",eval(evalString));
    const flag = await eval(evalString);
    return flag;
}

const resetPassword = async (employeeEmail,newPassword )=>{
  return await adminDb.resetPassword(employeeEmail,newPassword);
};

const getMasterCategories = async() =>{
  try{
    const masterData = await adminDb.getMaster();
    if(masterData){
      return masterData.skills_master.categories;
    }return null;
  }catch(err){
    console.log("Error in getMasterCategories svc ",err);
    return null;
  }
};

export default {
                getHierarchy,
                getEmployeesHierarchy,
                getAnalytics,
                getUsers,
                setUserState,
                setUserAdmin,
                addUser,
                searchSkills,
                resetPassword,
                getMasterCategories
}