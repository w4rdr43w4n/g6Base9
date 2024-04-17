import axios from "axios";


export const paraphrase = async (userText: string) => {
	
	console.log(userText)
	if (userText !== "") {
		const { data } = await axios.post("http://localhost:3000/api/utils/paraphrase", {
			textToParaphrase: userText,
		});
		const { aiPrompt } = data;
		return aiPrompt;
	} else {
		alert("Please enter some text");
		return "";
	}
};
export const summarize = async (userText: string) => {
	if (userText !== "") {
		const { data } = await axios.post("http://localhost:3000/api/utils/summarize", {
			textToSummary: userText,
		});
		const { aiPrompt } = data;
		return aiPrompt;
	} else {
		alert("Please enter some text");
		return "";
	}
};
export const advanced_check = async function run(text:string) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/edits',
            {
                key: '2J7D6F5JDX3HBH5UJB3CS0UA9W0HZORO',
                session_id: 'test session',
                text,
                advanced_edits: {
                    advanced_edits: true,
                },
            },
        );
        const {status, data} = response;
        console.log({status});
        console.log(JSON.stringify(data, null, 4));
		return data;
    } catch (err:any) {
        const { msg } = err.response.data;
        console.log({err: msg});
		return '';
    }
}
// Main function to create a PDF from HTML
export const pdf = async function (text:string) {
	const apiKey = "5b14MTc4OTE6MTQ5ODM6OXJMYlF4ZWlBY0NubzVwZw=";
	const templateId = "8b277b234aa4224e";
  
	const data1 = {
	  body: text,
	  css: "<style>.bg{backgound: red};</style>",
	  data: {
		name: "",
	  },
	  settings: {
		paper_size: "A4",
		orientation: "1",
		header_font_size: "9px",
		margin_top: "40",
		margin_right: "10",
		margin_bottom: "40",
		margin_left: "10",
		print_background: "1",
		displayHeaderFooter: false,
		custom_header: "<style>#header, #footer { padding:  0 !important; }</style>\n<table style=\"width:  100%; padding:  0px  5px;margin:  0px!important;font-size:  15px\">\n  <tr>\n    <td style=\"text-align:left; width:30%!important;\"><span class=\"date\"></span></td>\n    <td style=\"text-align:center; width:30%!important;\"><span class=\"pageNumber\"></span></td>\n    <td style=\"text-align:right; width:30%!important;\"><span class=\"totalPages\"></span></td>\n  </tr>\n</table>",
		custom_footer: "<style>#header, #footer { padding:  0 !important; }</style>\n<table style=\"width:  100%; padding:  0px  5px;margin:  0px!important;font-size:  15px\">\n  <tr>\n    <td style=\"text-align:left; width:30%!important;\"><span class=\"date\"></span></td>\n    <td style=\"text-align:center; width:30%!important;\"><span class=\"pageNumber\"></span></td>\n    <td style=\"text-align:right; width:30%!important;\"><span class=\"totalPages\"></span></td>\n  </tr>\n</table>",
	  },
	};
    const options = {
        method: "POST",
        url: "https://rest.apitemplate.io/v2/create-pdf-from-html",
        data: data1,
		headers: {
			"X-API-KEY": apiKey,
			"Content-Type": "application/json",
		  },
    };
	try {
	  const response = await axios(options);
	  console.log(response.data);
	  return response.data;
	} catch (error) {
	  console.error("An error occurred:", error);
	  return error;
	}
  }
  
  export const complete = async (userText: string) => {
	if (userText !== "") {
		const { data } = await axios.post("http://localhost:3000/api/utils/complete", {
			textTocomplete: userText,
		});
		const { aiPrompt } = data;
		return aiPrompt;
	} else {
		alert("Please enter some text");
		return "";
	}
};