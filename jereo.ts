#!/bin/nodejs
import {version} from "./package.json";
import {program} from "commander";
import indexRoute from "./routes/indexRoute";

//jereo [argument] -[options]
program.name("jereo")
.description("Command line tool to whatch file and do something funny")
.version(version)
.option("-r | --recursive","To specify if the watch will be do recursively")
.option("-d | --directory","To watch on directory")
.option("-f | --file","To watch only file")
.option("-n | --not <file-pattern>","To not include file(s) in the event")
.argument("[path]","Path to the folder or file to watch")
.option("-exec <pattern...>","To execute a commande for each changed in the folder or (file)\n Example: -exec ls :: (Where \"::\" is the current file/folder)")
.action(indexRoute); 


//program parser  
program.parse(); 
