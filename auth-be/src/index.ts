import { app } from "./app";
import { envVariables } from "./config/envLoader";

app.listen(envVariables.port, ()=>{
    console.log("App listening on port", envVariables.port);
});
