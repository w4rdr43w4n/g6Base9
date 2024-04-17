import axios from "axios";
import { parse_author_name, parse_year } from "./dep";
import { resData, Data } from "@/app/config/types";
import URLS from "@/app/config/urls";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchInArchive(
  query: string,
  maxResults = 10,
  retries = 3,
  delay = 500
): Promise<unknown[]> {
  try {
    const response = await axios.get(URLS.endpoints.archive_search, {
      params: {
        q: `"${query}" AND collection:(journals) AND format:(Text PDF) AND mediatype:(texts)`,
        fl: ["identifier"],
        rows: maxResults,
        output: "json",
      },
    });
    const res = [];
    console.log(response.data);
    for (const e of response.data.response.docs) {
      const details = await getInternetArchiveItemDetails(e.identifier);
      const r: resData = {
        id: res.length,
        title: details.title,
        author: parse_author_name([details.authors]),
        pdf_url: details.pdf_url,
        published: parse_year(details.published),
      };
      res.push(r);
    }
    console.log(res);
    return res;
  } catch (error) {
    if (retries > 0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return searchInArchive(query, maxResults, retries - 1, delay * 2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}

async function getInternetArchiveItemDetails(identifier: string) {
  const filesMetadataUrl = `${URLS.endpoints.archive_metadata}/${identifier}`;
  const response = await axios.get(filesMetadataUrl);
  // adjusting author name
  const MetaData = response.data.metadata;
  let author = "";
  if ("creator" in MetaData) {
    author = MetaData.creator;
  } else if ("journaltitle" in MetaData) {
    author = MetaData.journaltitle;
  } else if ("contributor" in MetaData) {
    author = MetaData.contributor;
  } else {
    author = "Unknown";
  }
  const year = MetaData.publicdate;
  const title = MetaData.title;
  const filesMetaData = response.data["files"];
  let pdf_url = "";
  for (const fileData of filesMetaData) {
    if (fileData.format === "Text PDF") {
      const pdfdownloadUrl = `https://archive.org/download/${identifier}/${fileData.name}`;
      pdf_url = pdfdownloadUrl;
    }
  }
  const details: Data = {
    title: title,
    authors: author,
    published: year,
    pdf_url: pdf_url,
  };
  return details;
}
