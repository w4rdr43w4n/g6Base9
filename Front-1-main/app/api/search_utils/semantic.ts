import axios from "axios";
import KEYS from "@/app/config/config";
import { parse_year, parse_author_name } from "./dep";
import { paper, resData } from "@/app/config/types";
import URLS from "@/app/config/urls";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Search async function
export async function searchInSemantic(
  query: string,
  maxResults = 15,
  retries = 2,
  delay = 300
): Promise<resData[]> {
  // Searching for the query
  try {
    const response = await axios.get(KEYS.SEMANTIC_CONFIG.api_url, {
      params: {
        query: `${query}`,
        limit: maxResults,
      },
      headers: {
        "x-api-key": KEYS.SEMANTIC_CONFIG.api_key,
      },
    });
    // preparing Ids array
    const Data = response.data.data;
    const Ids: string[] = [];
    // eslint-disable-next-line array-callback-return
    Data.map((paper: paper) => {
      const id = `${paper["paperId"]}`;
      Ids.push(id);
    });
    // sending them to get paper Metadata
    const detResponse = await axios.post(
      URLS.endpoints.semantic_search,
      {
        ids: Ids,
        headers: {
          "x-api-key": KEYS.SEMANTIC_CONFIG.api_key,
        },
      }
    );
    const Metadata = detResponse.data;
    const rs: resData[] = [];
    Metadata.forEach((paper: paper) => {
      const title = paper.title;
      const year = parse_year(paper.year);
      // parsing author names
      const author_names: string[] = [];
      if (paper.authors.length === 0) {
        return;
      } else {
        paper.authors.forEach((author) => {
          if (author.name) {
            author_names.push(author.name);
          }
        });
        // const author = parse_author_name(author_names)
        // Get pdf url
        const abstract = paper.abstract;
        const pdf_url =
          paper.openAccessPdf === null ? "" : paper.openAccessPdf.url;
        rs.push({
          id: rs.length,
          title: title,
          author: parse_author_name(author_names),
          authors: author_names,
          published: year,
          pdf_url: pdf_url,
          abstract: abstract,
        });
      }
    });
    return rs;
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return searchInSemantic(query, maxResults, retries - 1, delay);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

// Test it using the example below
/*
let query = 'canada'
searchInSemantic(query).then(res => {
    // Handle the response data here
    console.log(res);
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error);
  })
*/
