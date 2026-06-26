# iGraSpore — 技术规格

## 概要
受Spore启发的浏览器游戏（细胞阶段）。Canvas 2D，纯JS，单个HTML文件。
使用 `file://` 无需服务器即可运行。目标：从细菌进化到大型原生动物。

## 100种真实物种（5个类别）

### 生产者（25）— 光合生物
蓝藻：Synechocystis sp., Anabaena variabilis, Spirulina platensis, Nostoc punctiforme, Oscillatoria limnetica, Microcystis aeruginosa, Gleocapsa sp., Lyngbya majuscula
绿藻：Chlamydomonas reinhardtii, Chlorella vulgaris, Volvox globator, Euglena gracilis, Scenedesmus quadricauda, Haematococcus pluvialis, Dunaliella salina, Micrasterias rotata
硅藻：Navicula sp., Pinnularia viridis, Cyclotella meneghiniana, Diatoma vulgare
其他：Rhodospirillum rubrum, Chromatium vinosum, Porphyridium cruentum, Prochlorococcus marinus

### 一级消费者（20）— 捕食性细菌 + 鞭毛虫
Bdellovibrio bacteriovorus, Vampirococcus sp., Daptobacter sp., Myxococcus xanthus
Bacteriovorax stolpii, Halobacteriovorax sp., Peredibacter starrii
鞭毛虫：Monas guttula, Oikomonas termo, Anthophysa vegetans, Chilomonas paramecium
Cercomonas longicauda, Heteromita globosa, Bodonas saltans, Procryptobia sorokini
Trypanosoma brucei（微小形态）, Leishmania donovani（无鞭毛体）
领鞭毛虫：Monosiga brevicollis, Salpingoeca rosetta, Codonosiga botrytis

### 二级消费者（25）— 纤毛虫 + 变形虫
纤毛虫：Paramecium caudatum, Paramecium bursaria, Stentor coeruleus, Stentor polymorphus, Vorticella campanula, Vorticella microstoma, Didinium nasutum, Spirostomum ambiguum, Blepharisma americanum, Euplotes patella, Stylonychia pustulata, Oxytricha trifallax, Tetrahymena thermophila, Coleps hirtus, Litonotus lamella, Dileptus anser, Urocentrum turbo, Zoothamnium arbuscula, Opercularia coarctata
变形虫：Amoeba proteus, Arcella vulgaris, Difflugia oblonga, Euglypha alveolata, Nebela collaris, Centropyxis aculeata

### 三级消费者（15）— 大型原生动物 + 轮虫
太阳虫：Actinophrys sol, Actinosphaerium eichhorni, Raphidiophrys pallida
轮虫：Rotaria rotatoria, Philodina roseola, Brachionus plicatilis, Keratella cochlearis, Asplanchna priodonta
腹毛虫：Chaetonotus maximus, Lepidodermella squamata
涡虫：Macrostomum lignano, Stenostomum leucops, Microstomum lineare
纽虫：Prostoma graecense

### 分解者（15）— 真菌 + 分解细菌
真菌：Saccharomyces cerevisiae, Candida albicans, Mucor mucedo, Rhizopus stolonifer, Penicillium chrysogenum, Aspergillus niger
壶菌：Batrachochytrium dendrobatidis, Chytriomyces aureus, Allomyces macrogynus
细菌：Bacillus subtilis, Pseudomonas putida, Streptomyces coelicolor, Cellulomonas fimi, Thermus aquaticus, Deinococcus radiodurans

## 世界引擎
- 无限2D地图，基于区块（512×512）
- LRU缓存 9×9 区块
- 环境：光照（昼夜）、温度、pH值（5.0-9.0）、O₂、营养物质

## 有机体AI
- 生产者：光合作用 → 生长 → 分裂
- 捕食者：趋化性 → 追逐 → 吞噬
- 猎物：逃离捕食者
- 分解者：向死亡有机物移动
- 状态：空闲、移动、进食、分裂、孢囊、死亡
- 分裂：能量 >80%，年龄 > 最低值
- 孢囊：恶劣条件下
- 死亡：能量=0 → 有机物

## 玩家操控
- WASD — 移动，鼠标 — 方向
- 空格 — 冲刺（x3能量消耗）
- E — 吞噬（体型大20%以上可吃）
- Q — 分裂（能量 >80%）
- R — 形成孢囊
- 滚轮 — 缩放（0.5x–5x）
- Tab — 物种表
- 手机：触摸按钮

## 渲染
- Canvas 2D，摄像机跟随玩家
- 形状：圆形、杆状、螺旋、拖鞋形、钟形、星形、不规则、丝状
- 背景：蓝绿色，随深度变暗
- 粒子：营养物质、有机物、光线
- HUD：能量、大小、物种、年龄、温度、pH、O₂、FPS
- 小地图

## 平衡
- 屏幕上约500个有机体（空间哈希）
- 种群下降时生成
- 洛特卡-沃尔泰拉循环

## 平台
- Web（file://、GitHub Pages）
- Android（PWA / WebView）
- Desktop（Electron 或纯HTML）

## 交付格式
- 单个 `index.html`，所有JS/CSS内联
- 无import，无CDN
