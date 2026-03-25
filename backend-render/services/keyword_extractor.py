"""
关键词提取服务
从梦境内容中提取关键元素、人物、地点等
"""
import re
from typing import List, Dict
from collections import Counter


class KeywordExtractor:
    """梦境关键词提取器"""

    # 常见梦境元素分类
    DREAM_ELEMENTS = {
        "自然": ["星星", "月亮", "太阳", "天空", "云", "雨", "雪", "风", "海洋", "山", "河", "森林"],
        "人物": ["妈妈", "爸爸", "家人", "朋友", "陌生人", "孩子", "老人", "同学", "同事"],
        "动物": ["猫", "狗", "鸟", "鱼", "蛇", "马", "蝴蝶"],
        "动作": ["飞行", "坠落", "追逐", "逃跑", "游泳", "跑步", "跳跃", "战斗"],
        "物品": ["房子", "车", "飞机", "船", "手机", "钥匙", "钱", "书"],
        "情绪": ["害怕", "开心", "难过", "焦虑", "愤怒", "惊讶", "平静"],
        "场景": ["家", "学校", "公司", "医院", "机场", "火车站", "公园", "商场"]
    }

    # 高频梦境符号
    COMMON_SYMBOLS = {
        "飞行": "自由、解脱、渴望逃离现实",
        "坠落": "不安全感、失控、焦虑",
        "追逐": "逃避问题、压力、威胁感",
        "牙齿脱落": "焦虑、失去力量、外貌焦虑",
        "水": "情感、潜意识、生命力",
        "火": "激情、愤怒、 transformation",
        "蛇": " transformation、智慧、恐惧",
        "房子": "自我、身体、心态"
    }

    def extract(self, dream_content: str) -> Dict[str, List[Dict]]:
        """
        从梦境内容中提取关键词

        Args:
            dream_content: 梦境文本

        Returns:
            分类后的关键词字典：
            {
                "elements": [{"word": "星星", "category": "自然"}],
                "symbols": [{"word": "飞行", "meaning": "..."}],
                "emotions": ["害怕", "焦虑"],
                "entities": ["妈妈", "朋友"]
            }
        """
        result = {
            "elements": [],
            "symbols": [],
            "emotions": [],
            "entities": []
        }

        # 提取元素
        for category, items in self.DREAM_ELEMENTS.items():
            for item in items:
                if item in dream_content:
                    result["elements"].append({
                        "word": item,
                        "category": category
                    })

        # 提取符号
        for symbol, meaning in self.COMMON_SYMBOLS.items():
            if symbol in dream_content:
                result["symbols"].append({
                    "word": symbol,
                    "meaning": meaning
                })

        # 提取情绪词
        emotion_words = ["害怕", "恐惧", "开心", "快乐", "难过", "悲伤", "焦虑", "担心",
                        "愤怒", "生气", "惊讶", "震惊", "平静", "安静", "兴奋"]
        for emotion in emotion_words:
            if emotion in dream_content:
                result["emotions"].append(emotion)

        # 提取实体（人名、地名等）- 简单版本
        # 提取2-4个字的词组作为潜在实体
        entities = re.findall(r'[\u4e00-\u9fa5]{2,4}', dream_content)
        entity_counter = Counter(entities)
        # 过滤掉常见词
        stop_words = {"这个", "那个", "什么", "怎么", "因为", "所以", "然后", "之后"}
        for entity, count in entity_counter.most_common(10):
            if entity not in stop_words and count >= 1:
                result["entities"].append(entity)

        return result

    def get_tags(self, dream_content: str) -> List[str]:
        """
        生成梦境标签

        Args:
            dream_content: 梦境文本

        Returns:
            标签列表
        """
        keywords = self.extract(dream_content)
        tags = []

        # 从元素中生成标签
        for element in keywords["elements"][:5]:
            tags.append(f"{element['category']}:{element['word']}")

        # 从情感中生成标签
        for emotion in keywords["emotions"][:3]:
            tags.append(f"情绪:{emotion}")

        return tags[:10]  # 最多返回10个标签


# 全局实例
keyword_extractor = KeywordExtractor()


def extract_keywords(dream_content: str) -> Dict[str, List[Dict]]:
    """提取关键词的便捷函数"""
    return keyword_extractor.extract(dream_content)


def generate_tags(dream_content: str) -> List[str]:
    """生成标签的便捷函数"""
    return keyword_extractor.get_tags(dream_content)
