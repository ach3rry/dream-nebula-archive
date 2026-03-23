"""
梦境 CRUD API
Dream CRUD API Endpoints

提供梦境的创建、读取、更新、删除功能
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import json

from database.models import (
    DreamCreate, DreamUpdate, DreamResponse, DreamListResponse,
    EmotionAnalysis, DreamTag
)
from database.connection import get_connection

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
async def create_dream(dream: DreamCreate, conn=Depends(get_connection)):
    """
    创建新的梦境记录

    - **content**: 梦境内容（必填）
    - **user_id**: 用户 ID（必填）
    - **is_private**: 是否私密（默认 true）
    """
    try:
        cursor = conn.cursor()

        # 使用序列插入梦境记录
        cursor.execute("""
            INSERT INTO dream_records (id, user_id, content, is_private)
            VALUES (seq_dream_records.NEXTVAL, :1, :2, :3)
            RETURNING id, user_id, content, title, emotion_type, emotion_score,
                      emotion_confidence, keywords, dream_image_url,
                      interpretation, is_private, created_at, updated_at
            INTO :4
        """, (
            dream.user_id,
            dream.content,
            1 if dream.is_private else 0,
            cursor.var(int)
        ))

        result = cursor.fetchone()
        conn.commit()
        cursor.close()

        return row_to_dream(result)

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"创建梦境失败: {str(e)}")


@router.get("", response_model=DreamListResponse, summary="获取梦境列表")
async def list_dreams(
    user_id: int = Query(..., description="用户 ID"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    emotion: Optional[str] = Query(None, description="情感类型筛选"),
    conn=Depends(get_connection)
):
    """
    获取用户的梦境列表（分页）

    支持按情感类型筛选
    """
    try:
        cursor = conn.cursor()

        # 构建查询条件
        where_clause = "WHERE user_id = :1"
        params = [user_id]

        if emotion:
            where_clause += " AND emotion_type = :2"
            params.append(emotion)

        # 查询总数
        count_sql = f"SELECT COUNT(*) FROM dream_records {where_clause}"
        cursor.execute(count_sql, params)
        total = cursor.fetchone()[0]

        # 查询梦境列表
        offset = (page - 1) * page_size
        list_sql = f"""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            {where_clause}
            ORDER BY created_at DESC
            OFFSET {offset} ROWS FETCH NEXT {page_size + 1} ROWS ONLY
        """
        cursor.execute(list_sql, params)
        rows = cursor.fetchall()
        cursor.close()

        dreams = [row_to_dream(row) for row in rows[:page_size]]

        return DreamListResponse(
            total=total,
            dreams=dreams,
            page=page,
            page_size=page_size
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取梦境列表失败: {str(e)}")


@router.get("/{dream_id}", response_model=DreamResponse, summary="获取梦境详情")
async def get_dream(
    dream_id: int,
    conn=Depends(get_connection)
):
    """
    获取单个梦境的详细信息
    """
    try:
        cursor = conn.cursor()

        # 查询梦境
        cursor.execute("""
            SELECT id, user_id, content, title, emotion_type, emotion_score,
                   emotion_confidence, keywords, dream_image_url, interpretation,
                   is_private, created_at, updated_at
            FROM dream_records
            WHERE id = :1
        """, (dream_id,))

        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 查询标签
        cursor.execute("""
            SELECT id, tag_name, tag_category
            FROM dream_tags
            WHERE dream_id = :1
            ORDER BY created_at
        """, (dream_id,))

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


@router.put("/{dream_id}", response_model=DreamResponse, summary="更新梦境")
async def update_dream(
    dream_id: int,
    dream: DreamUpdate,
    conn=Depends(get_connection)
):
    """
    更新梦境内容

    只能更新 content 和 is_private 字段
    """
    try:
        cursor = conn.cursor()

        # 检查梦境是否存在
        cursor.execute("SELECT id FROM dream_records WHERE id = :1", (dream_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 构建更新语句
        updates = []
        params = []
        param_index = 1

        if dream.content is not None:
            updates.append(f"content = :{param_index}")
            params.append(dream.content)
            param_index += 1

        if dream.is_private is not None:
            updates.append(f"is_private = :{param_index}")
            params.append(1 if dream.is_private else 0)
            param_index += 1

        updates.append("updated_at = CURRENT_TIMESTAMP")
        params.append(dream_id)

        update_sql = f"""
            UPDATE dream_records
            SET {', '.join(updates)}
            WHERE id = :{param_index}
            RETURNING id, user_id, content, title, emotion_type, emotion_score,
                      emotion_confidence, keywords, dream_image_url, interpretation,
                      is_private, created_at, updated_at
        """

        cursor.execute(update_sql, params)
        row = cursor.fetchone()
        conn.commit()
        cursor.close()

        return row_to_dream(row)

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"更新梦境失败: {str(e)}")


@router.delete("/{dream_id}", summary="删除梦境")
async def delete_dream(
    dream_id: int,
    conn=Depends(get_connection)
):
    """
    删除梦境记录

    由于有外键约束 ON DELETE CASCADE，关联的标签也会被自动删除
    """
    try:
        cursor = conn.cursor()

        # 检查梦境是否存在
        cursor.execute("SELECT id FROM dream_records WHERE id = :1", (dream_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="梦境不存在")

        # 删除梦境
        cursor.execute("DELETE FROM dream_records WHERE id = :1", (dream_id,))
        conn.commit()
        cursor.close()

        return {"message": "梦境删除成功", "dream_id": dream_id}

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"删除梦境失败: {str(e)}")
