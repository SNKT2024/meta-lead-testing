import { Request, Response } from "express";

const myToken = "unque-poc";

export async function verifyWebHook(req: Request, res: Response) {
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (verify_token == myToken) {
    console.log("Webhook Verified!");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}
