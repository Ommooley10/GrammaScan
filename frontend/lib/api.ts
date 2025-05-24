export async function checkGrammar(sentence: string) {
  const res = await fetch("https://your-backend.onrender.com/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  });
  return res.json();
}
