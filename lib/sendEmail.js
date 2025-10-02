import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: ,
    port : ,
    secure : false,
    auth : {
        user :,
        pass : ,
        
    }

  });
};
