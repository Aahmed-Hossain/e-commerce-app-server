const express = require("express");
const app = express();
const cors = require("cors");

// middle ware
app.use(cors({ origin: ["http://localhost:3000"], }));
app.use(express.json());

// BucketBD
// YLD297ERok6HhIuA

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port = process.env.PORT || 5000;
const uri = "mongodb+srv://BucketBD:YLD297ERok6HhIuA@cluster0.hmijryu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const productsCollection = client.db("bucketBD").collection("products");
    const userCollection = client.db("bucketBD").collection("users");
    const orderCollection = client.db("bucketBD").collection("orders");
    
    app.get('/products', async(req, res)=> {
        const result = await productsCollection.find().toArray();
        res.send(result);
    });
    app.get('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(filter);
      res.send(result);
    });
    app.post('/addProducts', async(req, res)=> {
      const body = req.body;
      const result = await productsCollection.insertOne(body);
      res.send(result);
    });

    app.post('/users/register', async(req, res)=> {
      const body = req.body;
      const result = await userCollection.insertOne(body);
      res.send(result);
    });
    app.post('/orders', async(req, res)=> {
      const body = req.body;
      const result = await orderCollection.insertOne(body);
      res.send(result);
    });
    app.get('/orders', async(req, res)=> {
      const result = await orderCollection.find().toArray();
      res.send(result);
  });
  app.delete('/orders/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const filter = { _id: new ObjectId(id) };
    console.log(filter);
    const result = await orderCollection.deleteOne(filter);
    res.send(result);
  });

  app.get('/users', async(req, res)=> {
        const result = await userCollection.find().toArray();
        res.send(result);
    });
    
    // app.get("/search-course/:name", async (req, res) => {
    //   const name = req.params.name;
    //   const query = { name: { $regex: new RegExp(name, "i") } }; // Case-insensitive search
    //   const result = await courseCollection.find(query).toArray();
    //   res.send(result);
    // });

    const isValidBangladeshiNumber = (mobileNumber) => {
      const result = { isValid: false, message: "" };
    
      if (!mobileNumber || typeof mobileNumber !== "string") {
        result.message = "ERROR! Please enter a valid mobile number";
        return result;
      }
    
      if (!/^\+?\d+$/.test(mobileNumber)) {
        result.message = "ERROR! Mobile number must contain only digits (0-9)";
        return result;
      }
    
      let inputNumber = mobileNumber.trim();
    
      const countryCode = inputNumber.startsWith("+")
        ? inputNumber.slice(0, 3)
        : null;
    
      const operatorCode = inputNumber.startsWith("+")
        ? inputNumber.slice(3, 6)
        : inputNumber.slice(0, 3);
    
      const validCountryCode = "+88";
      const validTotalDigit = 11;
      const validOperatorCodes = ["013", "014", "015", "016", "017", "018", "019"];
    
      if (countryCode) {
        if (countryCode !== validCountryCode) {
          result.message = `ERROR! ${countryCode} is an invalid country code for Bangladesh.`;
          return result;
        } else {
          inputNumber = inputNumber.slice(3);
        }
      }
    
      if (inputNumber.length !== validTotalDigit) {
        result.message = `ERROR! ${inputNumber} has an invalid total digit as a Bangladeshi number.`;
        return result;
      }
    
      if (!validOperatorCodes.includes(operatorCode)) {
        result.message = `ERROR! ${operatorCode} is an invalid operator code for Bangladeshi number.`;
        return result;
      }
    
      result.isValid = true;
      result.message = `${inputNumber} is a valid Bangladeshi mobile number.`;
      return result;
    };
    
    // app.post('/users/register', async(req,res )=> {
    //   const {number, password} = req.body;
    //   // const isValidNumber = isValidBangladeshiNumber(number);
    //   if(isValidNumber.isValid){
    //     // check user avaiale is already?
    //     // bcrypt password 
    //     // insert 
    //     // genetate jwt token 
    //     const result = await userCollection.insertOne(body);
    //   res.send(result);
    //   res.status(200).send({success:ture,message:"user registered successfully", data:result, token:"token"})
    //   }else{
    //     res.status(422).send({success:false,message:isValidNumber.message, data:isValidNumber})
    //   }
    // });


    // app.get('/students', async(req,res)=> {
    //   const result = await enrolledStudentCollection.find().toArray();
    //   res.send(result);
    // });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send(`BucketBD server is running`);
  });
  app.listen(port, () => {
    console.log(`BucketBD server is  running on Port${port}`);
  });