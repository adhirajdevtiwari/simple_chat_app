import app from './src/app.js'

import connectDB from './src/dbs/dbs.js';
connectDB();


const port = 4000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
