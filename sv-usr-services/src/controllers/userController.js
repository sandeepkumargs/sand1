//User Controller
import userService from "../services/userService.js";

const getMaster = async (req, res) => {
  res.status(200).json(await userService.getMasterData());
}

const getUser = async (req, res) => {
  console.log("in controller , id is ", req.params.empId);
  res.status(200).json(await userService.getOneUser(req.params.empId));
}

const updateUser = async (req, res) => {
const {
    body,
    params :{empId},
  } = req;

  if(!empId){
    return;
  }

  const result = await userService.updateUser(empId,body);
  if (result){
    res.status(200).json({"Status":"OK",data:result});
  }else{
    res.status(500).json({"Status":"Failed"});
  }
}

const updateCertificates = async(req,res) =>{
  const {
    body,
    params :{empId},
  } = req;

  if(!empId){
    return;
  }

  const result = await userService.updateCertificates(empId,body);
  if (result){
    res.status(200).json({"Status":"OK",data:result});
  }else{
    res.status(500).json({"Status":"Failed"});
  }
}

const updateEducation = async (req,res) =>{
  const{
    body,
    params :{empId},
  } = req;

  const result = await userService.updateEducation(empId,body);
  if (result){
    res.status(200).json({"Status":"OK",data:result});
  }else{
    res.status(500).json({"Status":"Failed"});
  }
}

const updateExperience = async(req,res) =>{

  const{
    body,
    params:{empId},
  } = req;

  const result = await userService.updateExperience(empId,body);
  if (result){
    res.status(200).json({"Status":"OK",data:result});
  }else{
    res.status(500).json({"Status":"Failed"});
  }
}


export default { getMaster,getUser,updateUser,updateCertificates, updateEducation,updateExperience};