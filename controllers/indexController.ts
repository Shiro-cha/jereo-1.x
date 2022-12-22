import {watch,watchFile,existsSync,readdir,statSync, Stats} from "fs";
import {cwd} from "process";
import process from "child_process";
import {isAbsolute,join} from "path";

class Jereo {
  public path:string ="";
  public static isProcessing = false;

  //for watch not recursive
  public watchOnly(pathFileOrDirectory:string,options:{recursive?:boolean,directory?:boolean,file?:boolean,not?:string,Exec:string[]}):void{

    //definde a processus watcher
    Jereo.isProcessing=false;

    //verify if the path is absolute or not
      this.path = !isAbsolute(pathFileOrDirectory) ? join(cwd(),pathFileOrDirectory):pathFileOrDirectory;

    //verify if the file exists synchronously
    if(existsSync(this.path) && statSync(this.path).isDirectory()){

      //some util variable
      const myDir:string = this.path;
      let typeDirectory:boolean| undefined= undefined;
      //watch only
      if(options.hasOwnProperty("directory") && !options.hasOwnProperty("file")){

        typeDirectory = true;

      }else if(options.hasOwnProperty("file") && !options.hasOwnProperty("directory")){

        typeDirectory = false;

      }else{

        typeDirectory = undefined;

      }

       //read the folder to get the listes
       readdir(this.path,function(err:Object | null,listes:string[]):void{

        //iterate the liste of file
        listes.forEach((liste:string):void => {

          const myTempFile:string = join(myDir,liste); 
          const typeVerification:boolean = typeDirectory ? statSync(myTempFile).isDirectory():statSync(myTempFile).isFile();

          if(typeVerification){

            //encapsule the synchrone function in a promise to get a pseudo multi-thread
            new Promise(function(success:Function,reject:Function):void{

              //watch file begin here
              typeDirectory ? watch(myTempFile,function(evt:string,filename:string){

                //verify if there is really an event and a correspond file
                if(Boolean(evt) && Boolean(filename)){

                  //verify if the user want to execute a command
                  if(options.hasOwnProperty("Exec")){ 

                    //the execute function
                    Jereo.execute(options["Exec"],myTempFile,filename,(): void => {

                        console.log(`Watch on: ${myDir} ...`);

                      }); 
                    
                  } 
                }
              }): watchFile(myTempFile,function(){

               
                  //verify if the user want to execute a command
                  if(options.hasOwnProperty("Exec")){  

                    //the execute function
                    Jereo.execute(options["Exec"],myTempFile,myTempFile,(): void => {

                        console.log(`Watch on: ${myDir} ...`);

                      });
                    
                  }
                
              })

              success();

            }).then(function():void{

            });

          }
        });
        console.log(`Watch on: ${myDir} ...`);

      });


    }else{
      console.error(new Error("The path doesn't exist...").message);

    }

  }

  //for watch recursively
  public watchRecurvely(pathFileOrDirectory:string,options:{recursive?:boolean,directory?:boolean,file?:boolean,not?:string,Exec:string[]}):void{
    console.log("recursively");

  }


  //------------------------------
  //static methods following here

  /**the -exec option methode**/ 
  public static execute(options:string[],myTempFile:string,filename:string,callback:Function):void{

    //verify if user give some argument to the command options
    if(options.length>0){
      
      //variable to store argument in the exec option
      let tempPatternList:string[] = options;

      //set all regular expression to a correct and valid command
      tempPatternList.forEach((item:string,i:number):void => {

        //verify espacement
        if(item.includes(" ")){
          let tempArray = item.split("");
          tempArray.unshift("\"");
          tempArray.push("\"");
          tempPatternList[i] = tempArray.join("")
        }

        // :: is replace by the current file who was changed
        if(item==="::"){

          tempPatternList[i] = join(myTempFile,filename); 

        }

        // and is replace by &&
        if(item.toLowerCase()==="and"){

          tempPatternList[i] = "&&";

        }

        // or is replace by |
        if(item.toLowerCase()==="or"){

          tempPatternList[i] = "|"; 

        }

        // + are replace by -
        if(item.includes("+") && item.indexOf("+")===0){

          tempPatternList[i] = item.split('+').join('-');

        } 
        
        

      });

      let tempPatternString = tempPatternList.join(" "); //this the command to execute
     
      
      try {
        if(!Jereo.isProcessing){

          let processTemp:any = null;
          processTemp = process.exec(tempPatternString);
          console.log("\nwaiting...\n");
          Jereo.isProcessing=true;
          if(Boolean(processTemp)){ 

            processTemp.stdout.on("data",function(data:string):void{
               console.log(data);
             }); 

             processTemp.stderr.on("data",function(data:string):void{

               console.log(data); 

             });
             processTemp.on("close",function(code:number):void{
               Jereo.isProcessing=false;
               if (code===0) {

                console.log("Finish...Ok");
                
               } else {

                console.log("Finish with error");    
                 
               }
               callback(); 
             })
          }
        }


      } catch (e) {

        console.log(e);
      } 


    }

  }

}

export default new Jereo();
