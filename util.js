function formatDate(date) {
    // Get day, month, year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const year = date.getFullYear();
  
    // Get hours, minutes, and AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert hours to 12-hour format
    if (hours > 12) {
      hours -= 12;
    }
  
    // Ensure that hours are padded with a leading zero if necessary
    hours = String(hours).padStart(2, '0');
  
    // Combine the formatted parts into the desired format
    const formattedDate = `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
    return formattedDate;
  }



  const generatePdf = (credential,imgCode) => {
    return `
    <html>
    <head>
      <title>CERTIFICATE OF COMPLETION</title>
      <style>
        td{
          text-align:left;
          font-family: monospace;
        }

      </style>
    </head>
    <body style="border: 1px solid black; padding: 2rem; margin: 2rem; background: #f5f6f7">
      <p style="vertical-align: center;">
        <img src="https://media.licdn.com/dms/image/C4E0BAQGflufdS6fZ6g/company-logo_200_200/0/1630252448412?e=2147483647&v=beta&t=yEnTuelNcbkkNqy0OniJX5a6CBxn16n6YCEjcu26x_M"
          alt="TechEd Academy Logo" style="height: 40px; marginRight: 16px; width: 5rem; height: 5rem; margin: 0px auto; text-align: center" />
      </p>
      <h3 style="text-align: center;font-family: cursive;">CERTIFICATE OF COMPLETION</h3>
      <table style="margin: 0px auto;">
        <tr>
          <td><strong>Issuer Name:</strong></td>
          <td>${credential.issuerName}</td>
        </tr>
        <tr>
          <td><strong>Student:</strong></td>
          <td>${credential.studentDetails.name}</td>
        </tr>
        <tr>
          <td><strong>Course:</strong></td>
          <td>${credential.courseDetails.name}</td>
        </tr>
        <tr>
          <td><strong>Roll No:</strong></td>
          <td>${credential.studentDetails.rollNumber}</td>
        </tr>
        <tr>
          <td><strong>Issuance Date:</strong></td>
          <td>${formatDate(credential.issuanceDate)}</td>
        </tr>
      </table>
      <img style="float: right; margin: 2rem 0;" src="data:image/png;base64,${imgCode}" />
    </body>
  </html>    
    `;
}


  module.exports = {formatDate,generatePdf}