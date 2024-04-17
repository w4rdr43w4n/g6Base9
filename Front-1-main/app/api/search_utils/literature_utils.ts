import { searchInSemantic } from "./semantic";
import { AxiosError, default as axios } from "axios";
import { resData } from "@/app/config/types";
import searchInArxiv from "./arxiv";
import URLS from "@/app/config/urls";
import { S3Client, PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import KEYS from "@/app/config/config";
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION ?? KEYS.s3_Client.region,
  credentials: {
     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? KEYS.s3_Client.credentials.accessKeyId,
     secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? KEYS.s3_Client.credentials.secretAccessKey,
  },
 });
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchAndProcess(
  query: string,
  style: string,
  retries = 3,
  delay = 500
) {
  const spRes: resData[] = [];
  try {
    let res: any[] = [];

    try {
      res = await searchInSemantic(query, 15);
    } catch (error) {
      console.error("Error in searchInSemantic:", error);
      res = await searchInArxiv(query, 10);
    }
    let filteredResults = res.filter((r) => r.abstract !== null);
    filteredResults = filteredResults.slice(0, 5);
    filteredResults.forEach((r) => {
      const item: resData = {
        title: r.title,
        authors: r.authors,
        pdf_url: r.pdf_url,
        published: r.published,
        abstract: r.abstract,
      };
      spRes.push(item);
    });
    console.log(spRes);
    const res1 = await literature(spRes, style, query);
    console.log(res1);
    return res1;
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return searchAndProcess(query, style, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}
export async function literature(
  items: resData[],
  style: string,
  query: string,
  retries = 3,
  delay = 500
) {
  console.log(items);
  const reqData = {
    Researches: items,
    style: style,
    subject: query,
  };

  try {
    return axios
      .post(`${URLS.urls.backendUrl}/${URLS.endpoints.literature}`, reqData)
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return literature(items, style, query, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
}

export async function documentation(
  items: resData[],
  style: string,
  retries = 3,
  delay = 500
) {
  console.log(items);
  const reqData = {
    Researches: items,
    style: style,
  };

  try {
    // Return the Promise chain from the Axios POST request
    return axios
      .post(`${URLS.urls.backendUrl}/${URLS.endpoints.documentation}`, reqData)
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (error) {
    if (retries > 0) {
      // Ensure sleep is awaited
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return documentation(items, style, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

// Define the sleep function if it's not already defined elsewhere


export async function plagiarism(text: string, retries = 3, delay = 500) {
  console.log(text);
  const new1 = await axios.post(
    URLS.endpoints.tokens,
    { upd:{'access_token': '', '.issued': '', '.expires': ''}}
  );
  console.log(new1.data.token);
  //const token = {'access_token': 'CB456498027F6EE6CEB83D321099BA0D13BB093A23477498230BBF6FE40DA85B', '.issued': '2024-04-13T18:19:27.9318686Z', '.expires': '2024-04-15T18:19:27.9318686Z'}
  const reqData = {
    text: text,
    token: new1.data.token
  };
  try {
    const resp = await axios.post(
      `${URLS.urls.backendUrl}/${URLS.endpoints.plagiarism}`,
      reqData
    );
    if(resp.data.userId){
      console.log(resp.data.token);
    const newPlgRecord = await axios.post(
      URLS.endpoints.record,
      { type: "plg",plgId:resp.data.userId.toString()}
    );
    const new2 = await axios.post(
      URLS.endpoints.tokens,
      { upd:resp.data.token}
    );
    console.log(new2.status)
    if(newPlgRecord.data.ok)return resp;
    return {data:{message:"Something went wrong"}}
    }
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return plagiarism(text, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

export async function searchAndDoc(
  query: string,
  style: string,
  retries = 3,
  delay = 500
) {
  const sdRes: resData[] = [];
  try {
    const res = await searchInSemantic(query);
    const filteredResults = res.filter((r) => r.pdf_url !== "");
    filteredResults.forEach((r) => {
      const item = {
        title: r.title,
        authors: r.authors,
        pdf_url: r.pdf_url,
        published: r.published,
      };
      sdRes.push(item);
    });
    console.log(sdRes);
    const re = await documentation(sdRes, style);
    console.log(re);
    return re;
  } catch (error) {
    if (retries > 0) {
      // Use setTimeout to create a delay and make it awaitable
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return searchAndDoc(query, style, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

export async function article(
  query: string,
  refs: any[] = [],
  outline: string,
  arxiv: boolean,
  retries = 3,
  delay = 500
) {
  let filteredResults = [];
  if (refs.length == 0 && arxiv == false) {
    let res: any[] = [];
    try {
      res = await searchInSemantic(query, 40);
    } catch (error) {
      console.error("Error in searchInSemantic:", error);
      // If an error occurs, assign an empty array to res
      res = [];
    }
    console.log(res);
    filteredResults = res.filter(
      (r) => r.abstract !== null && r.pdf_url !== ""
    );
  } else {
    filteredResults = refs;
  }

  const reqData = {
    topic: query,
    res: filteredResults,
    outline: outline,
    arxiv: arxiv,
  };
  try {
    return axios
      .post(`${URLS.urls.backendUrl}/${URLS.endpoints.article}`, reqData)
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return article(query, refs, outline, arxiv, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

export async function outline(query: string, retries = 3, delay = 500) {
  let res: any[] = [];
  try {
    res = await searchInSemantic(query, 40);
  } catch (error) {
    console.error("Error in searchInSemantic:", error);
    // If an error occurs, assign an empty array to res
    res = [];
  }
  console.log(res);
  let filteredResults = res.filter(
    (r) => r.abstract !== null && r.pdf_url !== ""
  );
  const reqData = {
    topic: query,
    res: filteredResults,
  };
  try {
    return axios
      .post(`${URLS.urls.backendUrl}/${URLS.endpoints.outline}`, reqData)
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return outline(query, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}
export async function save(project:string,type: string,title : string,content:string,style:string,outline:string,retries = 3, delay = 500) {
 try {
  console.log(outline)
    const newSaveRecord = await axios.post(
      URLS.endpoints.saver,
      {project:project,type: type,title:title,content:content,style:style,outline:outline}
    );
    if(newSaveRecord.data.ok) return {data:{message:"Saved"}};
    return {data:{error:"Something went wrong"}}
  } catch (error:any) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return save(project,type,title,content, style,outline,retries - 1, delay);
    } else {

      if(error.response.status === 429){
        return {data:{error:error.response.data.error}}
      }
      return {data:{error:error.message}}
    }
  }
}
export async function savedocs(type: string,link : string,status:string,total_pages:Number,date:string,retries = 3, delay = 500) {
  try {
     const docs = await axios.post(
       URLS.endpoints.documents,
       {type:type,link:link,status:status,total_pages:total_pages,date:date}
     );
     console.log(docs);
     if(docs.data.ok) return {data:{message:"Saved"}};
     return {data:{message:"Something went wrong"}}
   } catch (error) {
     if (retries > 0) {
       // Wait for the specified delay before retrying
       await sleep(delay);
       // Retry the request with one less retry attempt and double the delay
       return savedocs(type,link,status,total_pages, date,retries - 1, delay);
     } else {
       // If no more retries left, throw the error
       throw error;
     }
   }
 }

 export async function upload(file:any,fileName:string,retries = 3, delay = 500) {
  const docs = await axios.post(
    URLS.endpoints.upload,
    {name:fileName});
    fileName = docs.data.key;
    console.log(docs.data);
    console.log(process.env.AWS_S3_BUCKET_NAME);
  try {
      const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? 'g6-group',
      Key: fileName,
      Body: file,
      ContentType: "text/html"
    }
  
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log('Upload response:', response.$metadata);
    const m = response.$metadata;
     if(m) return {data:{success:true}};
     return {data:{success:false}}
   } catch (error) {
     if (retries > 0) {
       // Wait for the specified delay before retrying
       await sleep(delay);
       return {data:{success:false}}
       // Retry the request with one less retry attempt and double the delay
       //return upload(file,fileName,retries - 1, delay);
     } else {
       // If no more retries left, throw the error
       throw error;
     }
   }
 }
 /*
 export async function upload(file:any,filename:string,retries = 3, delay = 500) {

  try { 
    const docs = await axios.post(
      "http://localhost:3000/api/utils/upload",
      {file:file,fileName:filename}
    );
    console.log(docs);
    if(docs.data) return {data:{message:"Saved"}};
    return {data:{message:"Something went wrong"}}
   } catch (error) {
     if (retries > 0) {
       // Wait for the specified delay before retrying
       await sleep(delay);
       // Retry the request with one less retry attempt and double the delay
       return upload(file,filename,retries - 1, delay);
     } else {
       // If no more retries left, throw the error
       throw error;
     }
   }}
 
 */
 // Assuming s3Client is already defined and configured elsewhere in your code
 
 export async function uplo(fileName:string, retries = 3, delay = 500) {
  console.log('N');
  console.log(fileName);
  const docs = await axios.post(
    URLS.endpoints.get,
    {name:fileName});
    fileName = docs.data.key;
    console.log(docs.data);
  try {
     const client = s3Client;
 
     const command = new GetObjectCommand({
       Bucket: "g6-group",
       Key: fileName,
     });
 
     const response = await client.send(command);
     // Ensure to await the transformation of the stream to a string
     const htmlContent = await response.Body?.transformToString();
     if (htmlContent) {
       return { data: { message: htmlContent } };
     } else {
       return { data: { message: "Something went wrong" } };
     }
  } catch (error) {
     if (retries > 0) {
      await sleep(delay);
      return {data:{success:false}}
       // Wait for the specified delay before retrying
       //await new Promise(resolve => setTimeout(resolve, delay));
       // Retry the request with one less retry attempt and double the delay
       //return uplo(fileName, retries - 1, delay * 2);
     } else {
       // If no more retries left, throw the error
       throw error;
     }
  }
 }

 export async function Import(type:string,project="",list=[],retries = 3,delay = 500) {
  try {
    const importResp = await axios.post(
      URLS.endpoints.import,
      {
        type:type,
        project:project,
        list:list
      }
    );
    if (importResp.status === 200) return { data: { message: "Imported",imports:importResp.data.imports }};
    return { data: { message: "Something went wrong" } };
  } catch (error:any) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return Import(type,project,list, retries - 1, delay);
    } else {
      // If no more retries left, throw the error
      return error.message
    }
  }
}
export async function updateImport(project:string,content:string,type:string,retries=3,delay=500) {
  try{
    const resp = await axios.post(URLS.endpoints.update_import,{
      type:type,
      content:content,
      project:project
    })
    return resp
  } catch (error:any) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return updateImport(project,content,type, retries - 1, delay);
    } else {
      if(error.response.status === 429){
        return {data:{error:error.response.data.error}}
      }
      return {data:{error:error.message}}
    }
  }
}
export async function Import_editor(type:string,retries = 3,delay = 500) {
  try {
    const importResp = await axios.post(
      URLS.endpoints.Import_edits, {type:'html'}
    );console.log(importResp.data.imports[0])
    if (importResp.status === 200) return { data: { message: "Imported",imports:importResp.data.imports }};
    return { data: { message: "Something went wrong" } };
  } catch (error:any) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return Import_editor(type, retries - 1, delay);
    } else {
      // If no more retries left, throw the error
      return error.message
    }
  }
}
export async function save_cite(authors:string,title:string,year:string,link:string,style:string,retries = 3,delay = 500) {
  try {
    const Resp = await axios.post(
      URLS.endpoints.citation, {authors:authors,title:title,year:year,link:link,style:style}
    );
    console.log(Resp.data)
    if(Resp.data.ok) return {data:{message:"Saved"}};
    return {data:{error:"Something went wrong"}}
  } catch (error:any) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return save_cite(authors,title,year,link,style,retries - 1, delay);
    } else {

      if(error.response.status === 429){
        return {data:{error:error.response.data.error}}
      }
      return {data:{error:error.message}}
    }
  }
}