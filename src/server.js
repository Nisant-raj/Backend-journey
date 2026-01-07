const app = require('./app')

PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})