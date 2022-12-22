import Jereo from "../controllers/indexController";
import {cwd} from "process";

export default function(argument:string=cwd(),options:{recursive?:boolean,directory?:boolean,file?:boolean,not?:string,Exec:string[]}):void{

  if(options.hasOwnProperty("recursive")){
    Jereo.watchRecurvely(argument,options);
  }else{
    Jereo.watchOnly(argument,options);
  }

}
