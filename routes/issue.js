
app.post('/issue', verifyToken , async (req, res) => {
    try {
      const { issuerName, studentName, rollNo, courseName, issuanceDate } = req.body;

      const newCredential = new Credential({
        issuerName,
        studentName,
        rollNo,
        courseName,
        issuanceDate,
      });
  
    let data = await newCredential.save();

    let verificationUrl = `http://localhost:3000/${data._id}`
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const imgCode = await generateQRCode(verificationUrl);

    const htmlTemplate = `
      <html>
        <head>
          <title>CERTIFICATE OF COMPLETION</title>
        </head>
        <body style="border:1px solid black;padding:2rem;margin:2rem;backgroud:#f5f6f7">
          <p style="vertical-align:center;">
          <img src="https://media.licdn.com/dms/image/C4E0BAQGflufdS6fZ6g/company-logo_200_200/0/1630252448412?e=2147483647&v=beta&t=yEnTuelNcbkkNqy0OniJX5a6CBxn16n6YCEjcu26x_M" 
          alt="TechEd Academy Logo" style="height:40px;marginRight:16px;width:5rem;height:5rem;margin:0px auto;text-align:center"/>
          </p>
          <h3 style="text-align:center">CERTIFICATE OF COMPLETION</h3>
          <br/>
          <p>Issuer Name: ${issuerName}</p>
          <p>Student: ${studentName}</p>
          <p>Course: ${courseName}</p>
          <p>Roll No: ${rollNo}</p>
          <p>Issuance Date: ${issuanceDate}</p>
          <img style="float:right;margin:2rem 0;" src="data:image/png;base64,${imgCode}" />
        </body>
      </html>
    `;

    await page.setContent(htmlTemplate);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).send('Internal Server Error');
  }
  });
  