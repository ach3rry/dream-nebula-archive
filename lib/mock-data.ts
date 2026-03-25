/**
 * Mock 数据 - 用于静态 Demo 展示
 * Mock Data for Static Demo
 */

export interface MockDream {
  id: number
  content: string
  title?: string
  emotion?: {
    type: string
    score: number
    confidence: number
  }
  keywords?: string[]
  created_at: string
  updated_at: string
}

export interface MockInterpretation {
  summary: string
  symbols: Array<{
    symbol: string
    meaning: string
    mood: string
  }>
  psychological_meaning: string
  subconscious_message: string
  life_guidance: string
  mental_weather: {
    forecast: string
    temp: string
    advice: string
  }
}

// 模拟梦境数据
export const mockDreams: MockDream[] = [
  {
    id: 1,
    title: "飞翔的梦境",
    content: `我梦见自己在一个巨大的城市上空飞翔，脚下是高楼大厦和闪烁的霓虹灯。身体轻盈得像一片羽毛，每次挥动手臂就能飞得更高。

我看到街道上的人们很小，像蚂蚁一样移动。天空中有其他的飞行者，我们互相追逐，在云端穿梭。

突然，前方出现了一座发光的金色塔楼，我向着它飞去，但越靠近越感觉沉重，最后慢慢降落...`,
    emotion: {
      type: "兴奋",
      score: 0.85,
      confidence: 0.92
    },
    keywords: ["飞翔", "城市", "自由", "金色塔楼", "追逐"],
    created_at: "2026-03-20T02:30:00",
    updated_at: "2026-03-20T02:30:00"
  },
  {
    id: 2,
    title: "迷失的森林",
    content: `我独自走在一片浓密的森林里，四周都是参天大树，阳光只能透过树叶的缝隙洒下斑驳的光影。

脚下的落叶发出沙沙的响声，我试图寻找出路，但无论走哪个方向，看到的都是相似的景色。

远处传来奇怪的声音，像是有人在呼唤我的名字，但我分辨不出方向。心中升起一种莫名的恐慌，脚步也变得沉重...`,
    emotion: {
      type: "焦虑",
      score: 0.78,
      confidence: 0.88
    },
    keywords: ["森林", "迷路", "恐慌", "呼唤", "寻找"],
    created_at: "2026-03-19T03:15:00",
    updated_at: "2026-03-19T03:15:00"
  },
  {
    id: 3,
    title: "海边日落",
    content: `我坐在一片无人的海滩上，眼前是蔚蓝的大海，远处海天相接。夕阳正在西下，把整个天空染成了橙红色。

海浪轻轻拍打着沙滩，发出有节奏的声音。我闭上眼睛，感受着海风拂过脸颊，内心异常平静。

忽然，一只海鸥落在我的身旁，它看着我，仿佛想要传递什么信息...`,
    emotion: {
      type: "平静",
      score: 0.75,
      confidence: 0.95
    },
    keywords: ["海滩", "日落", "平静", "海鸥", "放松"],
    created_at: "2026-03-18T04:00:00",
    updated_at: "2026-03-18T04:00:00"
  },
  {
    id: 4,
    title: "追逐的噩梦",
    content: `我在一条昏暗的街道上奔跑，身后有一个黑影紧紧追赶。我拼命地跑，但无论怎么努力，那个黑影始终跟在我身后不远的地方。

街道两旁是紧闭的门，我试图敲门求救，但没有回应。双腿越来越沉重，呼吸变得困难。

突然，我脚下一空，坠落进无底的深渊...在惊恐中醒来。`,
    emotion: {
      type: "恐惧",
      score: 0.92,
      confidence: 0.95
    },
    keywords: ["黑影", "追逐", "逃跑", "坠落", "恐慌"],
    created_at: "2026-03-17T05:30:00",
    updated_at: "2026-03-17T05:30:00"
  },
  {
    id: 5,
    title: "奶奶的厨房",
    content: `我回到了小时候奶奶的老房子。厨房里飘来熟悉的饭菜香味，奶奶正在灶台前忙碌。

她转过身，笑着递给我一碗热汤，还是当年的味道。厨房温暖明亮，窗外阳光明媚。

奶奶说她一切都好，让我不要担心。我想要多待一会儿，但她轻轻推着我的肩膀，说我该回去了...`,
    emotion: {
      type: "忧郁",
      score: 0.70,
      confidence: 0.89
    },
    keywords: ["奶奶", "老房子", "厨房", "温暖", "告别"],
    created_at: "2026-03-16T01:45:00",
    updated_at: "2026-03-16T01:45:00"
  },
  {
    id: 6,
    title: "空白的考卷",
    content: `我坐在一间明亮的教室里，正在参加一场重要的考试。拿到试卷的那一刻，我的心跳漏了一拍——题目全都是我不认识的符号和文字。

时间一分一秒流逝，我看着周围的同学们奋笔疾书，而我的试卷上一片空白。

我想要举手提问，但喉咙发不出声音。铃声响起，监考老师开始收卷...我惊醒了。`,
    emotion: {
      type: "焦虑",
      score: 0.88,
      confidence: 0.91
    },
    keywords: ["考试", "白卷", "时间", "焦虑", "压力"],
    created_at: "2026-03-15T04:20:00",
    updated_at: "2026-03-15T04:20:00"
  },
  {
    id: 7,
    title: "星空对话",
    content: `我躺在一片广阔的草地上，仰望满天繁星。星空异常清晰，银河像一条光带横跨天际。

一个不知名的人来到我身边，我们开始谈论人生的意义。对话的内容我现在记不清了，但当时那种心灵相通的感觉非常强烈，仿佛所有疑问都有了答案。

醒来后，那种通透感和顿悟的感觉还持续了很久。`,
    emotion: {
      type: "愉悦",
      score: 0.80,
      confidence: 0.86
    },
    keywords: ["星空", "对话", "顿悟", "平静", "意义"],
    created_at: "2026-03-14T03:20:00",
    updated_at: "2026-03-14T03:20:00"
  },
  {
    id: 8,
    title: "无尽的楼梯",
    content: `我在一个螺旋形的楼梯上不断向上攀登，楼梯似乎没有尽头。每上一层，楼道就变得更窄更暗。

我数着台阶，但数到一百多就乱了。我想停下来，但感觉身后有什么东西在推着我继续向上。

终于，我到达了一个平台，推开门，发现外面是一片白茫茫的世界，什么都没有...`,
    emotion: {
      type: "焦虑",
      score: 0.76,
      confidence: 0.83
    },
    keywords: ["楼梯", "攀登", "迷茫", "未知", "探索"],
    created_at: "2026-03-13T02:50:00",
    updated_at: "2026-03-13T02:50:00"
  }
]

// 模拟解读数据
export const mockInterpretations: Record<number, MockInterpretation> = {
  1: {
    summary: "你在梦中体验到了极致的自由和掌控感，但金色塔楼带来的沉重感暗示：你对正在追求的目标既充满向往，又隐隐担忧。",
    symbols: [
      { symbol: "飞翔", meaning: "你渴望突破现状，掌控自己的人生方向", mood: "兴奋" },
      { symbol: "金色塔楼", meaning: "你心中有一个闪闪发光但感觉遥不可及的目标", mood: "愉悦" },
      { symbol: "降落", meaning: "你担心理想与现实的差距", mood: "焦虑" },
      { symbol: "霓虹城市", meaning: "你身处繁华环境却感觉自己是旁观者", mood: "平静" }
    ],
    psychological_meaning: "飞翔梦通常发生在你感到充满力量、想要突破某种限制的时候。梦中你在城市上空俯瞰，说明你希望站在更高视角看待当前生活。金色塔楼象征你的核心目标，但靠近时变沉重，反映了你对实现目标过程中的现实压力有所顾虑。这种矛盾很正常——说明你的既充满理想又有现实考量。",
    subconscious_message: "你的潜意识在说：你有能力飞翔，有能力超越现状。但也要接受，追求目标的过程中会有沉重时刻。降落不是失败，而是蓄力。",
    life_guidance: `你在梦境中体验的自由和掌控感是真实存在的力量。建议：

1. 明确那座"金色塔楼"具体是什么——把模糊的目标具体化
2. 接纳"沉重感"是追求目标过程的一部分，不是退缩的信号
3. 日常中给自己创造一些"飞翔时刻"——做让你感到自由和掌控的事情
4. 梦中你与其他飞行者互相追逐，说明你不是孤军奋战`,
    mental_weather: {
      forecast: "晴朗",
      temp: "25°C",
      advice: "你内心充满向上生长的力量。现在是设定目标、开始行动的好时机。相信自己有能力实现目标，也要允许自己有累了就降落休息的时刻。"
    }
  },
  2: {
    summary: "迷失森林的梦境反映了你当前在某些选择或问题上感到困惑，那个呼唤的声音其实是你内在的直觉在指引方向。",
    symbols: [
      { symbol: "浓密森林", meaning: "当前问题复杂，你看不清全貌", mood: "焦虑" },
      { symbol: "相似景色", meaning: "你觉得做了很多努力却像在原地打转", mood: "忧郁" },
      { symbol: "呼唤声", meaning: "你内在的声音、直觉在试图引导你", mood: "平静" },
      { symbol: "落叶声", meaning: "细微的变化正在发生，需要你去感知", mood: "平静" }
    ],
    psychological_meaning: "森林迷宫梦发生在你面临选择或陷入困境时。梦中的恐慌不仅来自迷路本身，更来自担心找不到出路的无力感。但关键线索是那个呼唤声——它是梦境中唯一指向性的元素，象征着你内在其实知道答案，只是被焦虑干扰了听觉。树木遮挡阳光意味着你需要拨开情绪的迷雾，才能看清方向。",
    subconscious_message: "你感觉找不到路，但呼唤的声音说明你的内在智慧其实知道方向。静下来，你能听见。",
    life_guidance: `森林迷宫梦提示你在某个方面需要停下来重新评估方向。建议：

1. 列出让你感觉"相似景色"的事情——哪些努力让你感觉在打转
2. 每天花10分钟静坐，倾听内心的声音，不急于做决定
3. 找信任的朋友聊聊你的困惑，旁观者往往能看清森林的路
4. 不要因为恐慌而匆忙选择方向，慢慢走反而能找到出口`,
    mental_weather: {
      forecast: "雾转多云",
      temp: "20°C",
      advice: "当前能见度较低，适合观察和思考，不适合做重大决定。给自己一些时间，雾会散的。记住森林再大也有边界，没有走不出去的迷宫。"
    }
  },
  3: {
    summary: "海滩日落的梦境展现了你内心深层的平静状态。海鸥的出现传递了一个信息：好消息或新的可能性正在靠近。",
    symbols: [
      { symbol: "无人海滩", meaning: "你享受独处，这是你的充电方式", mood: "平静" },
      { symbol: "橙红夕阳", meaning: "你正在经历一个阶段的美好收尾", mood: "愉悦" },
      { symbol: "有节奏的海浪", meaning: "你的生活正在找到自然的韵律", mood: "平静" },
      { symbol: "海鸥", meaning: "自由、好消息即将到来", mood: "愉悦" }
    ],
    psychological_meaning: "这是一个治愈系梦境，发生在你内在状态比较平衡的时候。海滩是意识与潜意识的交界地带，象征你正在整合内在的不同面向。夕阳不代表结束，而是过渡——日落后还有星空和日出。海鸥在梦境最后出现，作为信使角色，预示着新的可能性正在向你靠近。你的平静不是停滞，而是蓄势待发。",
    subconscious_message: "你的平静状态是真实的、可持续的。海鸥告诉你：准备好迎接即将到来的好消息。",
    life_guidance: `你梦中的平静是你真实心境的反映，也是你随身携带的内在资源。建议：

1. 记住那个闭上眼感受海风的时刻——这是你可以随时调用的内在状态
2. 保护和珍惜你的独处时间，这是你充电和恢复平衡的方式
3. 海鸥带来的消息可能与你正在等待的某个结果有关，保持耐心
4. 日落后的黑暗不可怕，星空会更美，每个结束都是新的开始`,
    mental_weather: {
      forecast: "晴朗舒适",
      temp: "24°C",
      advice: "你的内在状态非常适合处理事情。保持这种节奏，你正在正确的轨道上。好消息在路上。"
    }
  },
  4: {
    summary: "被追逐的噩梦映射了现实中某件你试图逃避的事情。梦境在提醒你：越逃避，压力会越大。",
    symbols: [
      { symbol: "黑影", meaning: "你害怕面对的具体人或事（可能是责任、冲突或压力源）", mood: "恐惧" },
      { symbol: "始终跟在身后", meaning: "问题没有因为逃避而消失，反而如影随形", mood: "焦虑" },
      { symbol: "紧闭的门", meaning: "你感觉孤立无援，不知道向谁求助", mood: "悲伤" },
      { symbol: "坠落深渊", meaning: "逃避的终极后果是失去控制", mood: "恐惧" }
    ],
    psychological_meaning: "追逐梦是典型的压力投射梦，发生在你对某个问题采取回避态度时。梦境中的恐惧不是抽象的，而是你潜意识对逃避后果的具象化。黑影始终在你身后不远不近，这很关键——说明你逃避的问题其实是有可能解决的，只要你转身面对。紧闭的门代表你感觉缺乏支持系统，但这可能是你因压力而孤立自己的结果。坠落是梦境的警告：逃避下去，你会失去对局面的控制。",
    subconscious_message: "你在逃跑，但黑影追不上你——说明你有能力面对。转身直面它，你会发现黑影没有你想象的那么可怕。",
    life_guidance: `这个噩梦是你的内在保护机制在发出警示。建议：

1. 明确那个"黑影"具体是什么——把模糊的恐惧具体化为可处理的问题
2. 列出你逃避这件事的代价，权衡逃避的收益与成本
3. 找到至少一个可以信任的人，向ta敞开你的困境——门会从里面打开
4. 哪怕每天只做一件小事来面对这个问题，也比逃跑强`,
    mental_weather: {
      forecast: "雷暴预警",
      temp: "17°C",
      advice: "你的压力水平已接近临界点。必须立即采取行动，不能继续逃避。越早面对，雷暴越小。你不是无助的，你有能力处理这个问题。"
    }
  },
  5: {
    summary: "奶奶托梦的这个场景，是她给你的安慰，也是你在处理思念的情感。她让你放心，也让你继续好好生活。",
    symbols: [
      { symbol: "老房子厨房", meaning: "你珍视的过去回忆和安全感来源", mood: "平静" },
      { symbol: "熟悉的饭菜香", meaning: "奶奶的爱一直都在，以记忆的形式延续", mood: "愉悦" },
      { symbol: "奶奶说她很好", meaning: "她希望你放下担心，相信她在那边安好", mood: "平静" },
      { symbol: "轻轻推你回去", meaning: "她希望你带着爱继续前行，而不是沉湎过去", mood: "忧郁" }
    ],
    psychological_meaning: "梦见已故亲人是哀伤处理的自然过程。这个梦境的特殊之处在于它的温暖和安慰性质——厨房、饭菜香、奶奶的笑脸，这些都是安全和爱的符号。奶奶说她很好，很可能是你潜意识中对"她在天之灵安好"的愿望投射，但更重要的是，这也是她会对你说的话。最后的轻轻一推，是梦境的核心信息：她希望你好好活着，带着她的爱继续前行。",
    subconscious_message: "奶奶通过梦境告诉你：她很好，你也应该好好的。她的爱没有消失，只是换了一种形式存在。",
    life_guidance: `这个充满温度的梦是奶奶给你的礼物。建议：

1. 允许自己思念她，但不要让思念阻碍你好好生活——这违背了她的愿望
2. 可以用某种方式纪念她：做她爱吃的菜，过她希望你过的生活
3. 当你想起她时，与其难过，不如选择感恩——感谢你们曾有过的时光
4. 梦中她推你回去，说明她希望你在现实中积极生活，这是对她最好的纪念`,
    mental_weather: {
      forecast: "雨过天晴",
      temp: "21°C",
      advice: "思念还在，但悲伤正在转化。这个梦境带来了疗愈。带着奶奶的爱好好生活，就是对她最好的告慰。"
    }
  },
  6: {
    summary: "考试焦虑梦反映了你对某个表现场景的担忧。梦中你看不懂题目，说明你对准备程度或能力缺乏信心。",
    symbols: [
      { symbol: "不认识的考题", meaning: "你感觉自己对某个挑战准备不足", mood: "恐惧" },
      { symbol: "时间流逝", meaning: "你担心错过机会或来不及行动", mood: "焦虑" },
      { symbol: "他人奋笔疾书", meaning: "社会比较让你倍感压力", mood: "焦虑" },
      { symbol: "喉咙发不出声", meaning: "你感觉无法表达困境或寻求帮助", mood: "悲伤" }
    ],
    psychological_meaning: "考试梦即使离开学校多年仍会出现，因为"考试"已经内化为各种评价、考核、表现的象征。你看不懂题目，很可能反映了你对某个即将到来的挑战（可能是工作项目、重要谈话、人生选择等）感觉准备不足或缺乏信心。周围的考生都在答题而你的卷子空白，这种对比放大了你的不安全感。梦境的最后——收卷时你还没开始——是焦虑梦的典型高潮，表明你担心错过机会。",
    subconscious_message: "你的不安全感在放大困难。你其实比想象中更有能力，不要被自我怀疑限制住。",
    life_guidance: `考试梦提示你在某个方面感到能力不足或准备不够。建议：

1. 具体化那场"考试"——你现实中即将面对的是什么？
2. 如果真的是准备不足，现在就开始准备，焦虑会随行动减少
3. 停止与他人比较，每个人的考题都不同，没有可比性
4. 识别你的"喉咙为什么发不出声"——是什么阻碍你寻求帮助？`,
    mental_weather: {
      forecast: "乌云渐散",
      temp: "22°C",
      advice: "焦虑是真实的，但不是不可逾越的。面对让你不安的"考试"，认真准备会给你底气。相信自己的能力，你以前通过过很多考试，这次也可以。"
    }
  },
  7: {
    summary: "星空对话梦境罕见而珍贵。你体验到的顿悟感是真实的——你的潜意识正在整合某些重要的人生议题。",
    symbols: [
      { symbol: "璀璨星空", meaning: "你的视野正在超越日常，触及更宏大的层面", mood: "愉悦" },
      { symbol: "不知名的对话者", meaning: "你内在智慧的投射，深层自我在表达", mood: "平静" },
      { symbol: "心灵相通", meaning: "你正在与自己建立更深的连接", mood: "愉悦" },
      { symbol: "遗忘内容但记住感觉", meaning: "重要的不是具体答案，而是通透的状态", mood: "平静" }
    ],
    psychological_meaning: "这是一个灵性梦境，发生在你正在进行深层内在工作时。星空是无限、永恒、超越的象征，意味着你的意识正在突破日常层面，触碰更深层的存在。对话的细节记不清但那种通透感持续很久，这很关键——说明梦境的价值不在于具体信息，而在于唤醒的内在状态。你体验到的"所有疑问都有了答案"的感觉，是你的深层自我在告诉你：你有能力找到答案。",
    subconscious_message: "你触碰到了自己内在的智慧源头。那种通透状态是你可以随时进入的，不只是在梦里。",
    life_guidance: `星空对话梦是你心灵成长的里程碑。建议：

1. 信任你在梦中体验到的那种"知道"的感觉——那是你的直觉
2. 当现实中遇到困惑时，尝试回到梦中的通透状态，答案会浮现
3. 继续你的内在探索——阅读、冥想、写日记都是好方法
4. 与能激发你深层思考的人交流，他们会像梦境中的对话者一样带来启发`,
    mental_weather: {
      forecast: "星夜晴空",
      temp: "23°C",
      advice: "你的内在状态非常通透，适合做重要决策、进行创造性思考或深度工作。相信你的直觉，现在你的判断力特别准确。"
    }
  },
  8: {
    summary: "无尽楼梯梦境反映了你对成长路径的迷茫——你在攀登，但不清楚目标是什么，也不确定是否走在正确的路上。",
    symbols: [
      { symbol: "螺旋楼梯", meaning: "你感觉自己在不断前进，但似乎在原地打转", mood: "焦虑" },
      { symbol: "越走越窄", meaning: "你对当前道路的前景感到担忧", mood: "恐惧" },
      { symbol: "身后推着你", meaning: "外部压力在驱使你前进，而非内在动力", mood: "焦虑" },
      { symbol: "白茫茫世界", meaning: "你对目的地完全没有概念，未知带来不安", mood: "平静" }
    ],
    psychological_meaning: "楼梯是成长、进步、追求的典型象征。但这个梦境的特殊之处在于：没有尽头的楼梯、越走越窄、身后推力、白茫茫的终点——这些元素组合在一起，反映出你对当前的人生方向感到迷茫。你在攀登（努力、进步），但不知道要去哪里（目标缺失）。楼梯变窄暗示你对这条路的前景感到担忧。身后的推力很关键——说明你可能被外界期望或压力驱动，而非内在热情。最终的白茫茫世界既是终点也是起点，意味着当你完成这段攀登，会面对一个全新的、未知的阶段。",
    subconscious_message: "你在努力攀登，但这是你自己选择的方向吗？白茫茫的世界等待你去定义，想清楚你要去哪里。",
    life_guidance: `无尽楼梯梦提示你需要重新审视人生方向。建议：

1. 问自己：如果没有任何外部压力，我还会走这条路吗？
2. 明确那扇门后面的"白茫茫世界"具体是什么——你追求的终点到底是什么？
3. 注意节奏：持续攀登重要，但不是以精疲力竭为代价
4. 给自己设置一些中间目标，让无尽楼梯变成有里程碑的旅程
5. 偶尔停下来审视方向，确认这是你真正想走的路`,
    mental_weather: {
      forecast: "多云渐晴",
      temp: "21°C",
      advice: "你正在从迷茫走向清晰。当前的困惑是探索过程的一部分，不要因为不确定就停滞。继续前行，视野会随着高度变得更加开阔。"
    }
  }
}

// 模拟情感分析结果
export async function mockAnalyzeEmotion(content: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 简单的关键词匹配来返回不同的情绪
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes("害怕") || lowerContent.includes("恐惧") || lowerContent.includes("逃跑")) {
    return {
      emotion_type: "恐惧",
      emotion_score: 0.85,
      confidence: 0.88,
      keywords: ["恐惧", "逃跑", "威胁"]
    }
  }

  if (lowerContent.includes("飞翔") || lowerContent.includes("自由")) {
    return {
      emotion_type: "兴奋",
      emotion_score: 0.82,
      confidence: 0.90,
      keywords: ["自由", "飞翔", "兴奋"]
    }
  }

  if (lowerContent.includes("难过") || lowerContent.includes("哭泣") || lowerContent.includes("失去")) {
    return {
      emotion_type: "忧郁",
      emotion_score: 0.75,
      confidence: 0.85,
      keywords: ["忧伤", "回忆", "思念"]
    }
  }

  if (lowerContent.includes("生气") || lowerContent.includes("愤怒")) {
    return {
      emotion_type: "愤怒",
      emotion_score: 0.78,
      confidence: 0.82,
      keywords: ["愤怒", "不公", "压力"]
    }
  }

  // 默认返回平静
  return {
    emotion_type: "平静",
    emotion_score: 0.65,
    confidence: 0.75,
    keywords: ["平静", "日常", "普通"]
  }
}

// 模拟星云图谱分析
export async function mockAnalyzeNebula(content: string, emotionType: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 基于内容和情绪生成星云数据
  const keywords = content.split(/[，。！？、\n]/).filter(w => w.length > 1 && w.length < 5).slice(0, 8)

  return {
    nodes: keywords.map((keyword, i) => ({
      id: `node-${i}`,
      label: keyword,
      value: Math.floor(Math.random() * 50) + 20,
      emotion: emotionType,
      x: Math.random() * 800 - 400,
      y: Math.random() * 600 - 300
    })),
    links: keywords.slice(0, -1).map((_, i) => ({
      source: `node-${i}`,
      target: `node-${i + 1}`,
      value: Math.floor(Math.random() * 30) + 10
    }))
  }
}

// 模拟梦境解读
export async function mockAnalyzeDream(
  content: string,
  emotionType: string,
  emotionScore: number
): Promise<MockInterpretation> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 2500))

  // 基于梦境内容的关键词匹配，返回最相似的 mock 解读
  const lowerContent = content.toLowerCase()

  // 简单的关键词匹配逻辑
  if (lowerContent.includes("飞翔") || lowerContent.includes("飞")) {
    return mockInterpretations[1]
  }
  if (lowerContent.includes("森林") || lowerContent.includes("迷路")) {
    return mockInterpretations[2]
  }
  if (lowerContent.includes("海") || lowerContent.includes("海滩") || lowerContent.includes("日落")) {
    return mockInterpretations[3]
  }
  if (lowerContent.includes("追逐") || lowerContent.includes("逃跑") || lowerContent.includes("黑影")) {
    return mockInterpretations[4]
  }
  if (lowerContent.includes("奶奶") || lowerContent.includes("爷爷") || lowerContent.includes("亲人")) {
    return mockInterpretations[5]
  }
  if (lowerContent.includes("考试") || lowerContent.includes("试卷") || lowerContent.includes("题目")) {
    return mockInterpretations[6]
  }
  if (lowerContent.includes("星空") || lowerContent.includes("对话") || lowerContent.includes("星星")) {
    return mockInterpretations[7]
  }
  if (lowerContent.includes("楼梯") || lowerContent.includes("攀登") || lowerContent.includes("台阶")) {
    return mockInterpretations[8]
  }

  // 默认返回第一个解读
  return mockInterpretations[1]
}
