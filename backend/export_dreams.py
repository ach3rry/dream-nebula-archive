"""
导出梦境数据用于 Mock 数据更新
"""
import yaspy
import json
from database.connection import get_config

config = get_config()
conn = yaspy.connect(user=config.user, password=config.password, dsn=config.dsn)
cursor = conn.cursor()

cursor.execute('''
    SELECT id, content, title, emotion_type, emotion_score, emotion_confidence,
           keywords, created_at, updated_at
    FROM dream_records
    ORDER BY id DESC
    FETCH FIRST 15 ROWS ONLY
''')

rows = cursor.fetchall()

dreams = []
for row in rows:
    dream_id, content, title, emotion_type, emotion_score, emotion_confidence, keywords, created_at, updated_at = row

    dreams.append({
        'id': int(dream_id),
        'content': content,
        'title': title,
        'emotion': {
            'type': emotion_type,
            'score': float(emotion_score) if emotion_score else None,
            'confidence': float(emotion_confidence) if emotion_confidence else None
        } if emotion_type else None,
        'keywords': json.loads(keywords) if keywords else [],
        'created_at': created_at.isoformat() if created_at else None,
        'updated_at': updated_at.isoformat() if updated_at else None
    })

print(json.dumps(dreams, ensure_ascii=False, indent=2))

cursor.close()
conn.close()
