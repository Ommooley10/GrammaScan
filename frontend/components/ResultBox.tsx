interface Result {
  ll1_valid: boolean;
  dependency_valid: boolean;  // match backend response key
  language_tool_issues: string[];
  is_grammatically_correct?: boolean; // optional if backend doesn’t return this yet
}

interface ResultBoxProps {
  result: Result;
}

export default function ResultBox({ result }: ResultBoxProps) {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <p><strong>LL1 Check:</strong> {result.ll1_valid ? "✅" : "❌"}</p>
      <p><strong>Dependency Check:</strong> {result.dependency_valid ? "✅" : "❌"}</p>
      <p><strong>Grammar Issues:</strong></p>
      <ul className="list-disc ml-6">
        {result.language_tool_issues.length > 0 ? (
          result.language_tool_issues.map((err: string, i: number) => (
            <li key={i}>{err}</li>
          ))
        ) : (
          <li>No issues found</li>
        )}
      </ul>
      {result.is_grammatically_correct !== undefined && (
        <p className="mt-2"><strong>Overall:</strong> {result.is_grammatically_correct ? "✅ Correct" : "❌ Issues detected"}</p>
      )}
    </div>
  );
}
