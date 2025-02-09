from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可（本番環境では制限すべき）
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# 学習データを保存するリスト
study_list = []

# APIのルート
@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

# 学習データの保存
@app.post("/save")
async def save_study(data: dict):
    title = data.get("title", "No Title")
    study_item = {
        "id": len(study_list) + 1,  # IDを付与
        "title": title,  # タイトルを保存
        "status": "未学習",  # 初期状態
        "next_review": "未定"  # 復習予定日
    }
    study_list.append(study_item)  # データをリストに追加
    return {"message": f"{title} を保存しました"}

# 学習データの取得
@app.get("/get")
async def get_study():
    if len(study_list) == 0:
        return {"message": "データがありません"}
    return study_list  # 追加された学習データを返す
