import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='defaultLanguage' content='en' />
          <meta name='availableLanguages' content='th, en' />
          <link rel="stylesheet" href="/styles/bootstrap.min.css" />
          <link rel="stylesheet" href="/styles/styles.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/reactstrap.min.js"></script>
        </body>
      </html>
    )
  }
}
