import axios from "axios";
import { resData } from "@/app/config/types";
import { parse_author_name, parse_year } from "./dep";
import URLS from "@/app/config/urls";

let errNum = 0;
export default async function searchInArxiv(
  searchQuery: string,
  maxResults?: number
): Promise<resData[]> {
  try {
    const response = await axios.get(URLS.endpoints.arxiv_search, {
      params: {
        search_query: `all:"${searchQuery}"`,
        start: 0,
        max_results: maxResults || 10,
      },
    });
    const parser = new DOMParser();
    const xmlDoc: XMLDocument = parser.parseFromString(
      response.data,
      "text/xml"
    );
    const articleElements = xmlDoc.querySelectorAll("entry");
    const articles: resData[] = [];

    articleElements.forEach((articleElement) => {
      articles.push({
        id: articles.length,
        title: articleElement.querySelector("title")?.textContent?.trim(),
        author: parse_author_name([
          articleElement.querySelector("author")?.textContent?.trim(),
        ]),
        authors: [articleElement.querySelector("author")?.textContent?.trim()],
        published: parse_year(
          articleElement.querySelector("published")?.textContent?.trim()
        ),
        pdf_url: articleElement
          .querySelector('link[title="pdf"]')
          ?.getAttribute("href"),
        abstract: articleElement.querySelector("summary")?.textContent?.trim(),
      });
    });
    return articles;
  } catch (error) {
    if (errNum < 3) {
      errNum++;
      console.log(error);
      return searchInArxiv(searchQuery, maxResults);
    } else {
      throw error;
    }
  }
}
