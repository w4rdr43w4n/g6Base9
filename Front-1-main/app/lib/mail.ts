import { Resend } from "resend";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendVerificationMail(email: string, url: URL, username: string,expDur:number) {
  try {
    const data = await resend.emails.send({
      from: "G6 Account <G6Account@chatg6.ai>",
      to: [`${email}`],
      subject: "Email verification",
      html: `<p>Dear user: ${username} <br/> Please verify your <strong>G6 Account </strong> email <a href='${url.toString()}'>Here</a></p><br/>Note that this token will expire within ${expDur} minutes.`,
    });
    if(data)return Response.json({data:data.data},{status:200});
    return Response.json({error:'The email is not sent'},{status:226});
  } catch (error) {
    return Response.json({ error });
  }
}

export async function sendMail(email: string,subject:string, message:string, username: string) {
  try {
    const data = await resend.emails.send({
      from: "G6 Account <G6Account@chatg6.ai>",
      to: [`${email}`],
      subject: `${subject}`,
      html: `<p>Dear user:<b> ${username}</b> ,<br/> <pre style='font-family:sans-serif;font-size:14px;'>${message}</pre>`,
    });
    if(data)return Response.json({data:data.data},{status:200});
    return Response.json({error:'The email is not sent'},{status:226});
  } catch (error) {
    return Response.json({ error });
  }
}

