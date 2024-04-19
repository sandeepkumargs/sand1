import { jwt } from "jsonwebtoken";
import express from "express";
const app = express();

app.post('/v1/api/auth/login',(req,res)=>{

});

app.post('/v1/api/auth/register',(req,res)=>{

});

app.listen(2000,()=>{
    console.log("SV-Auth-Microservice listening on ",2000);
});

