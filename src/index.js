import {app} from "./app.js"
import connectDB from "./db/db.js";

connectDB()
.then(()=> {
    app.on("errors",()=> {
        throw new Error(`App.on has heard for some error`);
    })
    app.listen(process.env.PORT, () => {
        console.log(`App listening on port:`,process.env.PORT,`\n`);
    })
})
.catch((err)=> {
    console.log('Error occured in index.js connectDB catchbox');
    process.exit(1);
})

