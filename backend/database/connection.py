"""
YashanDB 数据库连接池配置
YashanDB Database Connection Pool Configuration

使用 yaspy 驱动建立连接池
"""
import os
from typing import Optional
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# YashanDB 连接配置
YASDB_HOST = os.getenv("YASDB_HOST", "localhost")
YASDB_PORT = int(os.getenv("YASDB_PORT", "1688"))
YASDB_USER = os.getenv("YASDB_USER", "system")
YASDB_PASSWORD = os.getenv("YASDB_PASSWORD", "Cod-2022")


class YashanDBConfig:
    """YashanDB 连接配置类"""

    def __init__(
        self,
        host: str = YASDB_HOST,
        port: int = YASDB_PORT,
        user: str = YASDB_USER,
        password: str = YASDB_PASSWORD
    ):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.dsn = f"{host}:{port}"

    def get_connection_params(self) -> dict:
        """获取连接参数"""
        return {
            "user": self.user,
            "password": self.password,
            "dsn": self.dsn
        }

    def get_pool_params(self) -> dict:
        """获取连接池参数"""
        return {
            "user": self.user,
            "password": self.password,
            "dsn": self.dsn,
            "min": 2,      # 最小连接数
            "max": 10,     # 最大连接数
            "increment": 1 # 连接增长步长
        }


# 全局连接池（延迟初始化）
_pool = None


def get_connection_pool():
    """
    获取 YashanDB 连接池
    使用 yaspy.SessionPool 创建连接池

    注意：需要先安装 YashanDB C 驱动和 Python 驱动
    使用 /yashandb-c 和 /yashandb-python 技能安装
    """
    global _pool

    if _pool is None:
        try:
            import yaspy
            config = YashanDBConfig()
            params = config.get_pool_params()

            _pool = yaspy.SessionPool(**params)

            # 测试连接
            conn = _pool.acquire()
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM dual")
            result = cursor.fetchone()
            cursor.close()
            _pool.release(conn)

            if result and result[0] == 1:
                print(f"✅ YashanDB 连接池创建成功！")
                print(f"   主机: {config.host}:{config.port}")
                print(f"   用户: {config.user}")
                return _pool
            else:
                raise Exception("数据库连接测试失败")

        except ImportError as e:
            print(f"❌ yaspy 驱动未安装！")
            print(f"   请使用 /yashandb-python 技能安装驱动")
            print(f"   错误: {e}")
            raise

        except Exception as e:
            print(f"❌ YashanDB 连接失败！")
            print(f"   请检查数据库是否运行，配置是否正确")
            print(f"   错误: {e}")
            raise

    return _pool


def get_connection():
    """
    获取数据库连接（用于依赖注入）
    """
    pool = get_connection_pool()
    conn = pool.acquire()
    try:
        yield conn
    finally:
        pool.release(conn)


def close_connection_pool():
    """关闭连接池"""
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None
        print("🔌 YashanDB 连接池已关闭")


# 供测试使用
if __name__ == "__main__":
    try:
        pool = get_connection_pool()
        print("✅ 数据库连接池初始化成功！")
        close_connection_pool()
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
