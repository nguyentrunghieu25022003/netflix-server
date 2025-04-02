module.exports = (email, subject, text) => {
  const userMailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };
  return userMailOptions;
};