const express=require('express');
const cors = require('cors');
const Axios= require('axios');
const app=express();
const path = require('path');
const port=8000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post('/compile',(req,res)=>{

      let code= req.body.code;
      let language= req.body.language;
      let input= req.body.input;

      let languages={
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
      }

      if(!languages[language]){
          return res.status(400).send({error:"Unspportable language"});
          
      }
      let data={
        "language": languages[language].language,
        "version": "*",
        "files":[
            {
            "name":"main",
            "content": code
            }
        ],
        "stdin": input
      };
      let config = {
        method: 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: { 'Content-Type': 'application/json' },
        data: data
      };
      Axios(config)
        .then((response) => {
            res.json(response.data.run);  
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ error: "Something went wrong" });
    });


})




app.listen(port,()=>{
    console.log(`server running on port${port}`);
});