exports.registerEmailParamsForUser = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                          <html>
                              <h1>Vérification de votre adresse e-mail</h1>
                              <p>Veuillez utiliser le lien ci-dessous pour finir votre inscription:</p>
                              <p>${process.env.CLIENT_URL}/user/activate/${token}</p>
                          </html>
                      `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Vérification de votre email",
      },
    },
  };
};

exports.emailCheckoutSuccess = (email, session) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                        <html>
                            <h1>Félicitations</h1>
                            <span>Votre commande d'un montant total de ${session.total} &euro; à bien été validée</span>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Confirmation de commande",
      },
    },
  };
};

exports.registerEmailParamsForAdmin = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                        <html>
                            <h1>Vérification de votre adresse e-mail</h1>
                            <p>Veuillez utiliser le lien ci-dessous pour finir votre inscription:</p>
                            <p>${process.env.CLIENT_URL}/admin/activate/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};
