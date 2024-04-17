
export function parse_year(year:any) {
  const y = year.toString()
  return y.slice(0, 4)
}
export function addLineBreaks(text:string) {
  return text.replace(/\n/g, '<br />');
}

export function parse_author_name(author_name:string[]|unknown[]) {
  let author = author_name[0]?.toString()
  const comma:RegExpMatchArray | null |undefined = author?.match(/\s*,/)
  let pos:number =-1
  if(comma?.index){
    author = author?.substring(comma.index - author.length,comma.index)
    if (author!==  undefined) {
    pos = author.lastIndexOf(' ')}
    author = author?.substring(pos + 1)
    return ` ${author} et al ` 
  } 
  else{
    if (author!==  undefined) {
      pos = author.lastIndexOf(' ')}
  author = author?.substring(pos + 1)
  if (author_name.length === 1) {
    return author
  }
  else {
    return ` ${author} et al `
  }
  }
}

export function get_pdf_url_from_arxiv(arxivId:string) {
  return `http://arxiv.org/pdf/${arxivId}.pdf`
}


