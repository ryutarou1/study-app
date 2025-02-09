import { useState, useEffect } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [studyList, setStudyList] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ **API から学習データを取得**
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get")
      .then((response) => response.json())
      .then((data) => {
        console.log("📥 APIから受信:", data);
        if (Array.isArray(data)) {
          setStudyList(data);
        } else {
          setMessage(data.message);
          setStudyList([]);
        }
      })
      .catch((error) => console.error("Error fetching API:", error));
  }, []);

  // ✅ **学習データを保存**
  const saveStudy = () => {
    console.log("📤 学習データを送信:", title);
    fetch("http://127.0.0.1:8000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ 保存レスポンス:", data);
        alert(data.message);

        // **手動で studyList に追加する**
        setStudyList((prevList) => [
          ...prevList,
          {
            id: prevList.length + 1,
            title: title,
            status: "未学習",
            next_review: "未定"
          }
        ]);

        setTitle(""); // **入力欄をリセット**
      })
      .catch((error) => console.error("Error saving study:", error));
  };

  return (
    <div>
      <h1>Next.js + FastAPI</h1>
      <p>APIからのメッセージ: {message}</p>

      <h2>学習タイトルを入力</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={saveStudy}>保存</button>

      <h2>学習リスト</h2>
      {studyList.length === 0 ? (
        <p>学習データがありません</p>
      ) : (
        <ul>
          {studyList.map((item) => (
            <li key={item.id}>
              {item.title} - {item.status}（復習予定: {item.next_review}）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
