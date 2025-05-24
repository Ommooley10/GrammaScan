// frontend/app/layout.tsx
import "./globals.css"; // make sure you have this file with your Tailwind imports

export const metadata = {
  title: "GrammaScan",
  description: "Grammar‐checking dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}
