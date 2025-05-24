export async function checkGrammar(sentence: string) {
  const res = await fetch("https://gramma-backend.onrender.com/check_grammar/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: sentence }),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  return res.json();
}
