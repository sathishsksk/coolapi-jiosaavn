const express = require('express');
const { GetDetails } = require('../endpoints');
const { get } = require('../get');
const router = express.Router();
const cache=require('memory-cache');

const caching=new cache.Cache();
const cacheTime=20*60*1000;//time in mili seconds

router.get('/', async (req, res) => {

      const type=req.query.type;
      const id=req.query.id;
      const page=req.query.page || 1;
      const n=req.query.n || 10;
     
      if(!type || !id){
          res.json({"error":"Invalid Arguments"});
          return;
      }

      if(caching.get(id)){
        res.status(200).json({"data":caching.get(id),"source":"cache"});
        return;
      }


      const response=await get(GetDetails(id,type,page,n));

      caching.put(id,response.data,cacheTime);
      res.status(200).json({"data":response.data,"source":"API"});
    
  

  });

module.exports = router;
