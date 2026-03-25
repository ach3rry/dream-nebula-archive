"""
程序化星云生成器
根据梦境内容生成独特的星云视觉效果参数
"""
import hashlib
import colorsys
from typing import Dict, List, Tuple
import random


class NebulaGenerator:
    """星云生成器 - 基于梦境内容生成视觉参数"""

    # 情感到颜色的映射
    EMOTION_COLORS = {
        "CALM": {
            "primary": (0.6, 0.7, 0.9),      # 淡蓝
            "secondary": (0.5, 0.5, 0.7),    # 淡紫
            "accent": (0.8, 0.9, 1.0)        # 亮白蓝
        },
        "SAD": {
            "primary": (0.3, 0.4, 0.6),      # 灰蓝
            "secondary": (0.4, 0.3, 0.5),    # 灰紫
            "accent": (0.5, 0.5, 0.6)        # 淡灰
        },
        "FEAR": {
            "primary": (0.8, 0.2, 0.2),      # 暗红
            "secondary": (0.4, 0.1, 0.2),    # 深红紫
            "accent": (1.0, 0.3, 0.1)        # 亮橙红
        },
        "EXCITED": {
            "primary": (1.0, 0.8, 0.2),      # 金黄
            "secondary": (1.0, 0.5, 0.1),    # 橙色
            "accent": (1.0, 1.0, 0.6)        # 亮黄
        },
        "ANXIOUS": {
            "primary": (0.8, 0.3, 0.3),      # 红
            "secondary": (0.6, 0.2, 0.4),    # 红紫
            "accent": (1.0, 0.4, 0.4)        # 亮红
        },
        "MELANCHOLY": {
            "primary": (0.4, 0.2, 0.6),      # 深紫
            "secondary": (0.3, 0.3, 0.5),    # 蓝紫
            "accent": (0.6, 0.4, 0.8)        # 亮紫
        },
        "JOYFUL": {
            "primary": (0.3, 0.9, 0.5),      # 亮绿
            "secondary": (0.5, 0.8, 0.4),    # 黄绿
            "accent": (0.6, 1.0, 0.7)        # 青绿
        }
    }

    def __init__(self, seed: int = None):
        """初始化生成器"""
        self.seed = seed or random.randint(0, 999999)

    def generate_from_dream(self, dream_content: str, emotion: str = "CALM") -> Dict:
        """
        根据梦境内容生成星云参数

        Args:
            dream_content: 梦境文本内容
            emotion: 主导情感类型

        Returns:
            星云视觉参数字典：
            {
                "colors": [...],
                "particles": {...},
                "clouds": [...],
                "effects": [...]
            }
        """
        # 基于内容生成种子
        content_hash = hashlib.md5(dream_content.encode()).hexdigest()
        seed = int(content_hash[:8], 16)
        random.seed(seed)

        # 获取情感配色
        colors = self.EMOTION_COLORS.get(emotion, self.EMOTION_COLORS["CALM"])

        # 生成粒子系统参数
        particles = self._generate_particles(dream_content)

        # 生成星云参数
        clouds = self._generate_clouds(dream_content, colors)

        # 生成特效参数
        effects = self._generate_effects(emotion)

        return {
            "seed": seed,
            "emotion": emotion,
            "colors": {
                "primary": self._rgb_to_hex(*colors["primary"]),
                "secondary": self._rgb_to_hex(*colors["secondary"]),
                "accent": self._rgb_to_hex(*colors["accent"])
            },
            "particles": particles,
            "clouds": clouds,
            "effects": effects
        }

    def _generate_particles(self, content: str) -> Dict:
        """生成粒子系统参数"""
        word_count = len(content)
        intensity = min(word_count / 100, 1.0)

        return {
            "count": 500 + int(word_count * 5),
            "size": {
                "min": 0.5,
                "max": 3.0 + intensity * 2
            },
            "speed": {
                "min": 0.01,
                "max": 0.05 + intensity * 0.03
            },
            "opacity": {
                "min": 0.3,
                "max": 0.9
            },
            "distribution": "gaussian" if word_count > 50 else "uniform"
        }

    def _generate_clouds(self, content: str, colors: Dict) -> List[Dict]:
        """生成星云层"""
        num_clouds = 3 + min(len(content) // 50, 5)
        clouds = []

        for i in range(num_clouds):
            clouds.append({
                "id": i,
                "color": self._rgb_to_hex(*colors["secondary"]),
                "opacity": 0.2 + random.random() * 0.3,
                "scale": 1.0 + random.random() * 2.0,
                "position": {
                    "x": random.random() * 100 - 50,
                    "y": random.random() * 100 - 50,
                    "z": random.random() * 50 - 25
                },
                "blur": 20 + random.random() * 40,
                "animation_speed": 0.001 + random.random() * 0.002
            })

        return clouds

    def _generate_effects(self, emotion: str) -> Dict:
        """生成特效参数"""
        effects = {
            "glow": {
                "enabled": True,
                "intensity": 0.5,
                "radius": 20
            },
            "twinkle": {
                "enabled": emotion in ["CALM", "JOYFUL", "EXCITED"],
                "speed": 0.5
            },
            "pulse": {
                "enabled": emotion in ["ANXIOUS", "FEAR"],
                "speed": 1.0
            },
            "float": {
                "enabled": True,
                "amplitude": 10,
                "frequency": 0.001
            }
        }

        return effects

    def _rgb_to_hex(self, r: float, g: float, b: float) -> str:
        """RGB 转 Hex 颜色"""
        return "#{:02x}{:02x}{:02x}".format(
            int(r * 255),
            int(g * 255),
            int(b * 255)
        )

    def generate_star_positions(self, dream_id: int, count: int = 100) -> List[Dict]:
        """
        为 3D 星空生成星星位置

        Args:
            dream_id: 梦境 ID（作为种子）
            count: 星星数量

        Returns:
            星星位置列表
        """
        random.seed(dream_id)
        stars = []

        for i in range(count):
            stars.append({
                "id": i,
                "position": {
                    "x": random.uniform(-50, 50),
                    "y": random.uniform(-50, 50),
                    "z": random.uniform(-50, 50)
                },
                "size": random.uniform(0.1, 0.5),
                "color": self._random_star_color(),
                "twinkle_speed": random.uniform(0.5, 2.0)
            })

        return stars

    def _random_star_color(self) -> str:
        """生成随机星星颜色"""
        # 星星颜色主要是白色、淡蓝、淡黄
        colors = ["#FFFFFF", "#F0F8FF", "#FFFACD", "#E6E6FA", "#F5F5DC"]
        return random.choice(colors)


# 全局实例
nebula_generator = NebulaGenerator()


def generate_nebula_params(dream_content: str, emotion: str = "CALM") -> Dict:
    """生成星云参数的便捷函数"""
    return nebula_generator.generate_from_dream(dream_content, emotion)


def generate_star_positions(dream_id: int, count: int = 100) -> List[Dict]:
    """生成星星位置的便捷函数"""
    return nebula_generator.generate_star_positions(dream_id, count)
