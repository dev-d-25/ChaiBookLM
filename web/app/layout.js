import "./globals.css";



export const metadata = {
  title: "ChaiBookLM",
  description: "Chat with your uploaded PDFs and text",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
