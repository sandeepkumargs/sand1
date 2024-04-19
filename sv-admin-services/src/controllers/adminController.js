//User Controller
import adminService from "../services/adminService.js";

const getMaster = async (req, res) => {
  res.status(200).json(await adminService.getMasterData());
}

const getemployeeshierarchy = async(req,res) => {
  res.status(200).json(await adminService.getemployeeshierarchy());
}

const getAnalytics = async(req,res) => {
  res.status(200).json(await adminService.getAnalytics());
}

const getUsers = async(req,res) =>{
  res.status(200).json(await adminService.getUsers());
}

const setUserState = async(req,res) =>{
  try{
    const {
      body: {isActive,employeeEmail}
    } = req;
  
    if(employeeEmail && typeof employeeEmail==='string'){
      if( isActive===null || typeof isActive==='number'){
        //do your shit
        const result = await adminService.setUserState(employeeEmail,isActive);
        if (result){
          res.status(200).json({"Status":"OK",data:result});
        }else{
          res.status(500).json({"Status":"Failed"});
        }
      }else{
        res.status(400).json({"Status " :"Error","data" :"Missing isActive parameter or incorrect type.."});   
      }
    }else{
      res.status(400).json({"Status " :"Error","data" :"Missing Email parameter or incorrect email type.."});
    }
  }catch(err){
    res.status(400).json({"Status":"Error","data":err});
  }
}

const setUserAdmin = async(req,res) =>{
try{
      const {
        body:{isAdmin,employeeEmail}
      } = req;

      if(employeeEmail && typeof employeeEmail==='string'){
        if( isAdmin===null || typeof isAdmin==='number'){
          //do your shit
          const result = await adminService.setUserAdmin(employeeEmail,isAdmin);
          if (result){
            res.status(200).json({"Status":"OK",data:result});
          }else{
            res.status(500).json({"Status":"Failed"});
          }
        }else{
          res.status(400).json({"Status " :"Error","data" :"Missing isActive parameter or incorrect type.."});   
        }
      }else{
        res.status(400).json({"Status " :"Error","data" :"Missing Email parameter or incorrect email type.."});
      }
    }catch(err){
      res.status(400).json({"Status":"Error","data":err});
    }
}


export default { getAnalytics,getemployeeshierarchy, getMaster,getUsers,setUserState,setUserAdmin};