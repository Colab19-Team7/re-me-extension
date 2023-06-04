export async function getOGImage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const ogImage = doc.querySelector('meta[property="og:image"]');
  if (ogImage) {
    return ogImage.getAttribute("content");
  } else {
    console.log("No OG image found.");
    return null;
  }
}

// // Example usage:
// getOGImage("https://www.example.com")
//   .then((imageURL) => {
//     console.log(imageURL);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
