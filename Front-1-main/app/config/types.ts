export type resData = {
  id?:number,
  title?:string | null,
  authors?:string |unknown | null,
  author?:string |unknown | null,
  published?:unknown | null,
  pdf_url?:string | null | undefined,
  abstract?:string | null
}
export type Data = {
  title:string,
  authors?:unknown,
  author?:unknown,
  published:unknown,
  pdf_url:string,
}
export type paper = {
  paperId?:string,
  title:string,
  year:string,
  authors:author[],
  abstract:string,
  openAccessPdf:{url:''}
}
export type author = {
  name?:string,

}

export class CustomError extends Error {
  constructor(name:any,message:any,cause = "Unspecified") {
    super(message)
    this.name  = name
    this.message = message
    this.cause = cause
  }
}