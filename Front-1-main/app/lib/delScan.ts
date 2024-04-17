import axios from "axios";

export async function authenticate() {
  const options = {
    method: "POST",
    url: "https://id.copyleaks.com/v3/account/login/api",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    data: {
      key: "ec379620-d47a-46cd-ad4b-d7e1dc349441",
      email: "chatgeneration6@gmail.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    return data.access_token;
  } catch (error) {
    return error;
  }
}

export default async function delScan(ids: String[] | number[],dur:number,retries=3) {
  const scanIds = ids.map(function (e) {
    return {id: e.toString()};
  });
  const auth = await authenticate();
  if(retries > 0 && auth === null){
    return delScan(ids,dur,retries - 1)
  }
  const options = {
    method: "PATCH",
    url: "https://api.copyleaks.com/v3.1/scans/delete",
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    data: { purge: false, scans: scanIds },
  };

  try {
    setTimeout(async()=> await axios.request(options),1000*dur);
    return true;
  } catch (error) {
    return false;
  }
}
