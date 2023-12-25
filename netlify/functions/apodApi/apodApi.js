// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {   const ApiKEY = process.env.apiKey;
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=${apiKEY}');
    const data = await response.json();
 

    return {
    

      statusCode: 200,
      body: JSON.stringify(data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
 