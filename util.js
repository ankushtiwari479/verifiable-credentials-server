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


  module.exports = {formatDate}