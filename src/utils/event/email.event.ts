import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "../email/send.email";
import { verifyEmailTemplate } from "../email/verify.templete.email";
export const emailEvent = new EventEmitter();
interface IEmail extends Mail.Options{
  otp:number
}
emailEvent.on("confirmEmail", async (data: IEmail) => {
  try {
    data.subject = "Confirm-Email";
      data.html = verifyEmailTemplate({ otp:345686 /*data.otp*/, title: "Confirm Email" });
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail to send email `, error);
  }
});
