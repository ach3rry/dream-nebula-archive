"""
全局错误处理中间件
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from typing import Union
import logging
import traceback

logger = logging.getLogger(__name__)


class ErrorResponse:
    """标准错误响应格式"""

    @staticmethod
    def create(
        status_code: int,
        message: str,
        detail: str = None,
        error_code: str = None
    ) -> JSONResponse:
        """创建错误响应"""
        content = {
            "success": False,
            "message": message,
            "status_code": status_code
        }

        if detail:
            content["detail"] = detail

        if error_code:
            content["error_code"] = error_code

        return JSONResponse(
            status_code=status_code,
            content=content
        )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """全局异常处理器"""
    # 记录错误
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    # 开发环境返回详细错误
    import os
    if os.getenv("ENVIRONMENT") == "development":
        return ErrorResponse.create(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal Server Error",
            detail=str(exc),
            error_code=type(exc).__name__
        )

    # 生产环境隐藏错误细节
    return ErrorResponse.create(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="服务器内部错误，请稍后重试",
        error_code="INTERNAL_ERROR"
    )


async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """HTTP 异常处理器"""
    return ErrorResponse.create(
        status_code=getattr(exc, 'status_code', status.HTTP_500_INTERNAL_SERVER_ERROR),
        message=getattr(exc, 'detail', 'An error occurred'),
        error_code=getattr(exc, 'status_code', 'INTERNAL_ERROR')
    )


async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """请求验证异常处理器"""
    return ErrorResponse.create(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message="请求参数验证失败",
        detail=str(exc),
        error_code="VALIDATION_ERROR"
    )
