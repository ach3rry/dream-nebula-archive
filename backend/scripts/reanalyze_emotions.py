# -*- coding: utf-8 -*-
"""
重新分析所有现有梦境的情感
使用 DeepSeek API 更新数据库中的情感标签
"""
import sys
import os

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import get_config
import yaspy
from services.emotion_analyzer import analyze_dream_emotion_sync
import json

def reanalyze_all_dreams(user_id: int = 1):
    """重新分析所有梦境的情感"""
    config = get_config()
    conn = None

    try:
        print("Connecting to database...")
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 查询所有梦境
        print(f"Fetching dreams for user {user_id}...")
        cursor.execute(f"""
            SELECT id, content, emotion_type
            FROM dream_records
            WHERE user_id = {user_id}
            ORDER BY created_at DESC
        """)

        rows = cursor.fetchall()
        print(f"Found {len(rows)} dreams")

        if not rows:
            print("No dreams found")
            return

        # 逐个重新分析
        success_count = 0
        fail_count = 0

        for i, (dream_id, content, old_emotion) in enumerate(rows, 1):
            print(f"\n[{i}/{len(rows)}] Analyzing dream #{dream_id}")
            print(f"  Old emotion: {old_emotion or 'None'}")

            try:
                # 使用 DeepSeek API 重新分析
                print(f"  Content: {content[:50]}...")
                result = analyze_dream_emotion_sync(content)

                # 更新数据库
                keywords_json = json.dumps(result['keywords'], ensure_ascii=False)

                cursor.execute("""
                    UPDATE dream_records
                    SET emotion_type = :1,
                        emotion_score = :2,
                        emotion_confidence = :3,
                        keywords = :4,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = :5
                """, (
                    result['emotion_type'],
                    result['emotion_score'],
                    result['confidence'],
                    keywords_json,
                    dream_id
                ))

                conn.commit()
                print(f"  [OK] New emotion: {result['emotion_type']} (score: {result['emotion_score']:.2f})")
                print(f"  Keywords: {result['keywords'][:5]}")
                success_count += 1

            except Exception as e:
                print(f"  [FAIL] Analysis failed: {e}")
                fail_count += 1
                continue

        cursor.close()

        print(f"\n{'='*50}")
        print(f"Analysis Complete!")
        print(f"  Success: {success_count} dreams")
        print(f"  Failed: {fail_count} dreams")
        print(f"  Success rate: {success_count/(success_count+fail_count)*100:.1f}%")
        print(f"{'='*50}")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

    finally:
        if conn:
            conn.close()
            print("\nDatabase connection closed")

if __name__ == "__main__":
    print("="*50)
    print("Reanalyze Dream Emotions")
    print("="*50)

    # 检查 API Key
    api_key = os.getenv("DEEPSEEK_EMOTION_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("WARNING: DeepSeek API Key not configured")
        print("Please configure DEEPSEEK_EMOTION_API_KEY in backend/.env")
        sys.exit(1)

    print(f"API Key configured: {api_key[:10]}...{api_key[-4:]}")

    user_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    reanalyze_all_dreams(user_id)
