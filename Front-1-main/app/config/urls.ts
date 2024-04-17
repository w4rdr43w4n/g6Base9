
const origin = 'http://localhost:3000'
//const origin = 'https://chatg6.ai'
const urls = {
  //backendUrl:"http://127.0.0.1:8000",
  backendUrl: "https://api.chatg6.ai",
  verif:`${origin}/authentication/verification`,
  gpt_url:'https://api.openai.com/v1/chat/completions',
  sem_url:'https://api.semanticscholar.org/graph/v1/paper/search'
};


const endpoints = {
  literature: "literature/",
  documentation: "documentation/",
  plagiarism: "plagiarism/",
  article: "article/",
  outline: "outline/",
  arxiv_search:"https://export.arxiv.org/api/query",
  archive_search:"https://archive.org/advancedsearch.php",
  archive_metadata:"https://archive.org/metadata",
  semantic_search:"https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,year,authors,openAccessPdf,abstract",
  plg_record:`${origin}/api/utils/record`,
  expired:`${origin}/api/utils/expired`,
  login:`${origin}/api/auth/login`,
  verify_endpoint:`${origin}/api/auth/verify`,
  saver:`${origin}/api/utils/saver`,
  import:`${origin}/api/utils/import`,
  get:`${origin}/api/utils/get`,
  Import_edits:`${origin}/api/utils/import_edits`,
  upload:`${origin}/api/utils/upload`,
  documents:`${origin}/api/utils/documents`,
  tokens:`${origin}/api/utils/tokens`,
  record:`${origin}/api/utils/record`,
  update_import:`${origin}/api/utils/update_import`,
  citation:`${origin}/api/utils/citation`
};

const URLS = {
  urls: urls,
  endpoints: endpoints,
};

export default URLS;