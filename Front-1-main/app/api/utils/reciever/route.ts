import { db } from "@/app/lib/db";
import { sendMail } from "@/app/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //if(req.method !== 'POST') return Response.json({error:`Method ${req.method} is not allowed.`},{status:400})
  try {
    console.log(`Webhook Recieved`);
    const body = await req.json();
    const scanId = body.scannedDocument.scanId;
    const Record = await db.plg.findUnique({
      where: {
        plgId: scanId,
      },
      select: {
        email: true,
        username: true,
      },
    });
    if (Record) {
      const results = body.results;
      const score = results.score;
      const now = new Date()
      const updateResult = await db.plg.update({
        where: {
          plgId:scanId,
        },
        data: {
          result:results,
          recieveDate: now,
        },
      })
      const resources: string[] = [];
      if (results.internet.length !== 0) {
        results.internet.forEach((e: any) => {
          let r = `\t${resources.length + 1}. Url:${e.url}\n\t Title:${
            e.title
          }\n\tIntroduction:${e.introduction}\n\t In this source there are ${
            e.identicalWords
          } identical words, ${e.similarWords} similar words and ${
            e.paraphrasedWords
          } paraphrased words to those in the text you provide, out of total ${
            e.totalWords
          } words in this source.`;
          if (e.metadata.author) {
            r = r + `\n\tAuthor:${e.metadata.author}\n\t`;
          }
          if (e.metadata.organization) {
            r = r + `\n\t Organization:${e.metadata.organization}\n\t`;
          }
          resources.push(r);
        });
      }

      let res = "";
      if (resources.length !== 0) {
        res = `2. Here are the resources on the internet we could identify:\n ${resources.join(
          "\n"
        )}`;
      }
      const msg =
        `The text you have submitted on our platform resulted in the following:\n 1. ${score.identicalWords} out of ${body.scannedDocument.totalWords} words are identical to sources we found on the internet, which are about ${score.aggregatedScore}% of the whole text.\n ` +
        res +
        "\n Thanks for using our platform!";
      const mail = await sendMail(
        `${Record.email}`,
        "Plagiarism Check Results",
        `${msg}`,
        `${Record.username}`
      );

      if (mail) {
        console.log("EMAIL sent...");
        return NextResponse.json(
          { message: "Results sent successfully to user's email" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "Couldn't send the response email" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "User's Record Not Found" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
/*
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.getAll("data");
    if (data.length !== 0) {
      return NextResponse.json({ data: data }, { status: 200 });
    }
    return NextResponse.json({ error: "Invalid Parameters" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
*/
