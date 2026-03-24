"""
梦境 CRUD API
Dream CRUD API Endpoints

提供梦境的创建、读取、更新、删除功能
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import json

from database.models import (
    DreamCreate, DreamUpdate, DreamResponse, DreamListResponse,
    EmotionAnalysis, DreamTag
)
from services.emotion_analyzer import analyze_dream_emotion

router = APIRouter(prefix="/api/dreams", tags=["梦境管理"])


def row_to_dream(row, tags=None) -> DreamResponse:
    """将数据库行转换为 DreamResponse 对象"""
    if tags is None:
        tags = []

    return DreamResponse(
        id=row[0],
        user_id=row[1],
        content=row[2],
        title=row[3],
        emotion=EmotionAnalysis(
            type=row[4],
            score=row[5],
            confidence=row[6]
        ) if row[4] else None,
        keywords=json.loads(row[7]) if row[7] else [],
        dream_image_url=row[8],
        interpretation=row[9],
        tags=tags,
        is_private=bool(row[10]),
        created_at=row[11],
        updated_at=row[12]
    )


@router.post("", response_model=DreamResponse, summary="创建梦境")
def create_dream(dream: DreamCreate):
    """
    创建新的梦境记录

    - **content**: 梦境内容（必填）
    - **user_id**: 用户 ID（必填）
    - **is_private**: 是否私密（默认 true）

    创建后会自动进行 AI 情感分析
    """
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = None

    try:
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 插入梦境记录（不使用 RETURNING）
        cursor.execute("""
            INSERT INTO dream_records (id, user_id, content, is_private)
            VALUES (seq_dream_records.NEXTVAL, :1, :2, :3)
        """, (
            dream.user_id,
            dream.content,
            1 if dream.is_private else 0,
        ))

        conn.commit()

        # 查询刚插入的记录（获取最大 ID）
        cursor.execute(f"""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            WHERE id = (SELECT MAX(id) FROM dream_records WHERE user_id = {dream.user_id})
        """)

        result = cursor.fetchone()
        dream_id = result[0]
        cursor.close()

        # 自动进行情感分析
        from services.emotion_analyzer import analyze_dream_emotion_sync
        import json

        try:
            emotion_result = analyze_dream_emotion_sync(dream.content)

            # 更新情感分析结果（使用参数绑定避免SQL注入）
            keywords_json = json.dumps(emotion_result['keywords'], ensure_ascii=False)

            cursor = conn.cursor()
            cursor.execute("""
                UPDATE dream_records
                SET emotion_type = :1,
                    emotion_score = :2,
                    emotion_confidence = :3,
                    keywords = :4
                WHERE id = :5
            """, (
                emotion_result['emotion_type'],
                emotion_result['emotion_score'],
                emotion_result['confidence'],
                keywords_json,
                dream_id
            ))
            conn.commit()
            cursor.close()
            print(f"[OK] Emotion analyzed: {emotion_result['emotion_type']}")
        except Exception as e:
            print(f"[WARN] Emotion analysis failed (continuing anyway): {e}")
            import traceback
            traceback.print_exc()

        # 重新查询返回结果
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            WHERE id = :1
        """, (dream_id,))
        result = cursor.fetchone()
        cursor.close()

        return row_to_dream(result)

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"创建梦境失败: {str(e)}")
    finally:
        if conn:
            conn.close()


@router.get("", response_model=DreamListResponse, summary="获取梦境列表")
def list_dreams(
    user_id: int = Query(..., description="用户 ID"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    emotion: Optional[str] = Query(None, description="情感类型筛选")
):
    """
    获取用户的梦境列表（分页）

    支持按情感类型筛选
    """
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = None

    try:
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 简化查询 - 获取所有用户梦境
        if emotion:
            cursor.execute(f"""
                SELECT id, user_id, content, title, emotion_type, emotion_score,
                       emotion_confidence, keywords, dream_image_url, interpretation,
                       is_private, created_at, updated_at
                FROM dream_records
                WHERE user_id = {user_id} AND emotion_type = '{emotion}'
                ORDER BY created_at DESC
                FETCH FIRST 50 ROWS ONLY
            """)
        else:
            cursor.execute(f"""
                SELECT id, user_id, content, title, emotion_type, emotion_score,
                       emotion_confidence, keywords, dream_image_url, interpretation,
                       is_private, created_at, updated_at
                FROM dream_records
                WHERE user_id = {user_id}
                ORDER BY created_at DESC
                FETCH FIRST 50 ROWS ONLY
            """)

        rows = cursor.fetchall()
        cursor.close()

        dreams = [row_to_dream(row) for row in rows]

        return DreamListResponse(
            total=len(dreams),
            dreams=dreams,
            page=page,
            page_size=page_size
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取梦境列表失败: {str(e)}")
    finally:
        if conn:
            conn.close()


@router.get("/{dream_id}", response_model=DreamResponse, summary="获取梦境详情")
def get_dream(
    dream_id: int
):
    """
    获取单个梦境的详细信息
    """
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = None

    try:
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 查询梦境
        cursor.execute(f"""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            WHERE id = {dream_id}
        """)

        row = cursor.fetchone()

        if not row:
            cursor.close()
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 查询标签
        cursor.execute(f"""
            SELECT id, tag_name, tag_category
            FROM dream_tags
            WHERE dream_id = {dream_id}
            ORDER BY created_at
        """)

        tag_rows = cursor.fetchall()
        tags = [
            DreamTag(id=t[0], tag_name=t[1], tag_category=t[2])
            for t in tag_rows
        ]

        cursor.close()

        return row_to_dream(row, tags=tags)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取梦境详情失败: {str(e)}")
    finally:
        if conn:
            conn.close()


@router.put("/{dream_id}", response_model=DreamResponse, summary="更新梦境")
def update_dream(
    dream_id: int,
    dream: DreamUpdate
):
    """
    更新梦境内容

    只能更新 content 和 is_private 字段
    """
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = None

    try:
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 检查梦境是否存在
        cursor.execute(f"SELECT id FROM dream_records WHERE id = {dream_id}")
        if not cursor.fetchone():
            cursor.close()
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 构建更新语句
        update_fields = []
        if dream.content is not None:
            # Escape single quotes
            safe_content = dream.content.replace("'", "''")
            update_fields.append(f"content = '{safe_content}'")

        if dream.is_private is not None:
            update_fields.append(f"is_private = {1 if dream.is_private else 0}")

        if not update_fields:
            cursor.close()
            raise HTTPException(status_code=400, detail="没有提供更新字段")

        update_fields.append("updated_at = CURRENT_TIMESTAMP")

        update_sql = f"""
            UPDATE dream_records
            SET {', '.join(update_fields)}
            WHERE id = {dream_id}
        """

        cursor.execute(update_sql)
        conn.commit()

        # 查询更新后的记录
        cursor.execute(f"""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            WHERE id = {dream_id}
        """)
        row = cursor.fetchone()
        cursor.close()

        return row_to_dream(row)

    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"更新梦境失败: {str(e)}")
    finally:
        if conn:
            conn.close()


@router.delete("/{dream_id}", summary="删除梦境")
def delete_dream(
    dream_id: int
):
    """
    删除梦境记录

    由于有外键约束 ON DELETE CASCADE，关联的标签也会被自动删除
    """
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = None

    try:
        conn = yaspy.connect(
            user=config.user,
            password=config.password,
            dsn=config.dsn
        )
        cursor = conn.cursor()

        # 检查梦境是否存在
        cursor.execute(f"SELECT id FROM dream_records WHERE id = {dream_id}")
        if not cursor.fetchone():
            cursor.close()
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 删除梦境
        cursor.execute(f"DELETE FROM dream_records WHERE id = {dream_id}")
        conn.commit()
        cursor.close()

        return {"message": "梦境删除成功", "dream_id": dream_id}

    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"删除梦境失败: {str(e)}")
    finally:
        if conn:
            conn.close()
