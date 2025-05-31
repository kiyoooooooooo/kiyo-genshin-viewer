// C:\Users\Public\genweb\src\main\resources\static\script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (既存のコードは省略) ...

<<<<<<< HEAD
    // キャラクターIDと表示名のマッピング
    // ここに新しいキャラクターを追加してください
    const characterNameMap = {
        // 通常のキャラクター
        "10000002": "神里綾華",
        "10000003": "ジン",
        "10000007": "アンバー",
        "10000014": "リサ",
        "10000015": "ガイア",
        "10000016": "バーバラ",
        "10000020": "ディルック",
        "10000021": "七七",
        "10000022": "刻晴",
        "10000023": "ウェンティ",
        "10000026": "クレー",
        "10000027": "香菱",
        "10000029": "モナ",
        "10000031": "タルタリヤ",
        "10000032": "ディオナ",
        "10000033": "鍾離",
        "10000034": "辛炎",
        "10000035": "甘雨",
        "10000036": "アルベド",
        "10000037": "魈",
        "10000038": "胡桃",
        "10000039": "エウルア",
        "10000041": "楓原万葉",
        "10000042": "神里綾人",
        "10000043": "宵宮",
        "10000044": "早柚",
        "10000045": "雷電将軍",
        "10000046": "珊瑚宮心海",
        "10000047": "トーマ",
        "10000048": "ゴロー",
        "10000049": "荒瀧一斗",
        "10000050": "申鶴",
        "10000051": "雲菫",
        "10000052": "八重神子",
        "10000053": "夜蘭",
        "10000054": "久岐忍",
        "10000055": "鹿野院平蔵",
        "10000056": "ティナリ",
        "10000057": "コレイ",
        "10000058": "ドリー",
        "10000059": "セノ",
        "10000060": "ニィロウ",
        "10000061": "ナヒーダ",
        "10000062": "レイラ",
        "10000063": "ファルザン",
        "10000064": "放浪者",
        "10000065": "アルハイゼン",
        "10000066": "ヨォーヨ",
        "10000067": "ディシア",
        "10000068": "ミカ",
        "10000069": "白朮",
        "10000070": "カーヴェ",
        "10000071": "綺良々",
        "10000072": "リネ",
        "10000073": "リネット",
        "10000074": "フレミネ",
        "10000075": "ヌヴィレット",
        "10000076": "リオセスリ",
        "10000077": "シャルロット",
        "10000078": "フリーナ",
        "10000079": "ナヴィア",
        "10000080": "シュヴルーズ",
        "10000081": "閑雲",
        "10000082": "嘉明",
        "10000083": "千織",
        "10000084": "アルレッキーノ",
        "10000085": "セトス",
        "10000086": "シグウィン",
        "10000087": "クロリンデ",

        // 主人公の元素別ID (APIからのIDが来る可能性のあるもの)
        // Enka APIではavatarIdとしてこれらの値が返される可能性があります。
        // 表示は汎用的に「主人公」とし、名前で「空（主人公）」「蛍（主人公）」を補足します。
        "10000005": "主人公（空）", // 風/岩/雷/草/水
        "10000006": "主人公（蛍）", // 風/岩/雷/草/水
        "10000030": "主人公（岩）", // 古いデータ形式の名残か、特定状況でこのIDが来る可能性
        // 以下のIDはEnka APIではキャラクター展示枠のIDとして直接返されない可能性が高いですが、念のため保持。
        // "10000066": "主人公（草）",
        // "10000080": "主人公（水）",

        // Enka APIが返す可能性のある主人公の 'name' フィールドの値
        "Aether": "空（主人公）",
        "Lumine": "蛍（主人公）",
    };

    // 武器IDと表示名のマッピング
    // このリストは完全ではありません。必要に応じてEnka.Networkのデータやコミュニティ情報を参照し、適宜追加してください。
    const weaponNameMap = {
        // 例:
        "15501": "風鷹剣",
        "13306": "斬岩・試作",
        // ... (省略) ...
        "12515": "浮世の錠",
        // ここに新しい武器を追加してください
    };

    // 聖遺物セットIDと表示名のマッピング
    // このリストは完全ではありません。必要に応じてEnka.Networkのデータやコミュニティ情報を参照し、適宜追加してください。
    const artifactSetNameMap = {
        "15001": "大地を流浪する楽団",
        "15002": "剣闘士のフィナーレ",
        // ... (省略) ...
        "15038": "未完成なコントラ", // 重複するIDは、おそらくEnkaの内部IDのバリエーション
        // ここに新しい聖遺物セットを追加してください
    };

    // ... (既存のコードは省略) ...
=======
    const characterInfoDisplayArea = document.getElementById('characterInfo');
    const characterDetailsDiv = document.getElementById('characterDetails');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const currentResultTabContent = document.getElementById('currentResult');
    const savedUidsTabContent = document.getElementById('savedUids');

    const savedUidList = document.getElementById('savedUidList');
    const clearSavedUidsButton = document.getElementById('clearSavedUids');

    let currentSearchedUid = null;

    // --- マッピングデータ (あなたのデータと一般的なEnka.NetworkのIDを統合) ---
    // あなたが提供したデータに基づき、キャラクターIDと名前のマップを再構築
    const characterNameMap = {
        10000002: '神里綾華', // UI_AvatarIcon_Side_Ayaka
        10000003: 'ジン',     // UI_AvatarIcon_Side_Qin
        10000005: '旅人(男)', // UI_AvatarIcon_Side_PlayerBoy (風/岩の区別は動的に行うか、汎用名とする)
        10000006: 'リサ',     // UI_AvatarIcon_Side_Lisa
        10000007: '旅人(女)', // UI_AvatarIcon_Side_PlayerGirl
        10000014: 'バーバラ',   // UI_AvatarIcon_Side_Barbara
        10000015: 'ガイア',    // UI_AvatarIcon_Side_Kaeya
        10000016: 'ディルック',  // UI_AvatarIcon_Side_Diluc
        10000020: 'レザー',    // UI_AvatarIcon_Side_Razor
        10000021: 'アンバー',   // UI_AvatarIcon_Side_Ambor
        10000022: 'ウェンティ',  // UI_AvatarIcon_Side_Venti
        10000023: '香菱',     // UI_AvatarIcon_Side_Xiangling
        10000024: '北斗',     // UI_AvatarIcon_Side_Beidou
        10000025: '行秋',     // UI_AvatarIcon_Side_Xingqiu
        10000026: '魈',      // UI_AvatarIcon_Side_Xiao
        10000027: '凝光',     // UI_AvatarIcon_Side_Ningguang
        10000029: 'クレー',    // UI_AvatarIcon_Side_Klee
        10000030: '鍾離',     // UI_AvatarIcon_Side_Zhongli
        10000031: 'フィッシュル', // UI_AvatarIcon_Side_Fischl
        10000032: 'ベネット',   // UI_AvatarIcon_Side_Bennett
        10000033: 'タルタリヤ',  // UI_AvatarIcon_Side_Tartaglia (注意: 以前胡桃だったが、提供データではタルタリヤ)
        10000034: 'ノエル',    // UI_AvatarIcon_Side_Noel
        10000035: '七七',     // UI_AvatarIcon_Side_Qiqi
        10000036: '重雲',     // UI_AvatarIcon_Side_Chongyun
        10000037: '甘雨',     // UI_AvatarIcon_Side_Ganyu
        10000038: 'アルベド',   // UI_AvatarIcon_Side_Albedo
        10000039: 'ディオナ',   // UI_AvatarIcon_Side_Diona
        10000041: 'モナ',     // UI_AvatarIcon_Side_Mona
        10000042: '刻晴',     // UI_AvatarIcon_Side_Keqing
        10000043: 'スクロース', // UI_AvatarIcon_Side_Sucrose
        10000044: '辛炎',     // UI_AvatarIcon_Side_Xinyan
        10000045: 'ロサリア',   // UI_AvatarIcon_Side_Rosaria
        10000046: '胡桃',     // ★★★ 確定: 提供データから10000046は胡桃 ★★★
        10000047: '楓原万葉',   // UI_AvatarIcon_Side_Kazuha
        10000048: '煙緋',     // UI_AvatarIcon_Side_Feiyan
        10000049: '宵宮',     // UI_AvatarIcon_Side_Yoimiya
        10000050: 'トーマ',    // UI_AvatarIcon_Side_Tohma
        10000051: 'エウルア',   // UI_AvatarIcon_Side_Eula
        10000052: '雷電将軍',   // UI_AvatarIcon_Side_Shougun
        10000053: '早柚',     // UI_AvatarIcon_Side_Sayu
        10000054: '珊瑚宮心海', // UI_AvatarIcon_Side_Kokomi
        10000055: 'ゴロー',    // UI_AvatarIcon_Side_Gorou
        10000056: '九条裟羅',   // UI_AvatarIcon_Side_Sara
        10000057: '荒瀧一斗',   // UI_AvatarIcon_Side_Itto
        10000058: '八重神子',   // UI_AvatarIcon_Side_Yae
        10000059: '鹿野院平蔵', // UI_AvatarIcon_Side_Heizo
        10000060: '夜蘭',     // UI_AvatarIcon_Side_Yelan (提供データでは60が夜蘭のようだが、59の後に夜蘭と表示されることが多い)
        10000061: '綺良々',    // UI_AvatarIcon_Side_Momoka (Ver 3.7)
        10000062: 'アーロイ',   // UI_AvatarIcon_Side_Aloy
        10000063: '申鶴',     // UI_AvatarIcon_Side_Shenhe
        10000064: '雲菫',     // UI_AvatarIcon_Side_Yunjin
        10000065: '久岐忍',    // UI_AvatarIcon_Side_Shinobu
        10000066: '神里綾人',   // UI_AvatarIcon_Side_Ayato
        10000067: 'コレイ',    // UI_AvatarIcon_Side_Collei
        10000068: 'ドリー',    // UI_AvatarIcon_Side_Dori
        10000069: 'ティナリ',   // UI_AvatarIcon_Side_Tighnari
        10000070: 'ニィロウ',   // UI_AvatarIcon_Side_Nilou
        10000071: 'セノ',     // UI_AvatarIcon_Side_Cyno
        // ここから先は、あなたが提供したデータに直接の記載がないため、
        // 以前のマップに基づき、一般的なIDと名前を引き続き使用します。
        // もしこれらのIDに対応するデータが提供されたら、再修正します。
        10000072: 'シャルロット',
        10000073: '旅人(草)',
        10000074: 'ナヴィア',
        10000075: 'シュヴルーズ',
        10000076: '閑雲',
        10000077: '嘉明',
        10000078: '千織',
        10000079: 'アルレッキーノ',
        10000080: 'セトス',
        10000081: 'クロリンデ',
        10000082: 'シグウィン',
        10000083: 'エミリエ', // 4.8で実装予定のキャラクター
        10000096: '旅人(水)',
        10000121: '旅人(炎)', // 最新の旅人形態

        // 旅人（性別と元素でIDが異なる可能性あり）
        // 旅人はUI_AvatarIcon_Side_PlayerBoy / Girl で区別され、元素はElementプロパティで判断される
        // Enka.Networkは性別＋元素で別のavatarIdを返すことがあるが、
        // ここでは一般的なものを保持し、必要に応じてUI_AvatarIcon_SideNameで動的に判断も可能
    };

    // 最新の聖遺物セットIDと名前のマップ (変更なし、最新データに更新済み)
    const artifactSetNameMap = {
        15001: '雷を鎮める尊者',
        15002: '烈火を渡る賢者',
        15003: '愛される少女',
        15004: '剣闘士のフィナーレ',
        15005: '翠緑の影',
        15006: '大地を流浪する楽団',
        15007: '雷のような怒り',
        15008: '燃え盛る炎の魔女',
        15009: '旧貴族のしつけ',
        15010: '血染めの騎士道',
        15011: '悠久の磐岩',
        15012: '逆飛びの流星',
        15013: '氷風を彷徨う勇士',
        15014: '沈淪の心',
        15015: '千岩牢固',
        15016: '蒼白の炎',
        15017: '絶縁の旗印',
        15018: '追憶のしめ縄',
        15019: '華館夢醒形骸記',
        15020: '海染硨磲',
        15021: '来歆の余響',
        15022: '辰砂往生録',
        15023: '深林の記憶',
        15024: '金メッキの夢',
        15025: '砂上の楼閣の史話',
        15026: '楽園の絶花',
        15027: '水仙の夢',
        15028: '花海甘露の光',
        15029: 'ファントムハンター',
        15030: '黄金の劇団',
        15031: '在りし日の歌',
        15032: '残響の森で囁かれる夜話',
        15033: '諧律奇想の断章',
        15034: '遂げられなかった想い', // Ver. 4.7 新聖遺物
        15035: '黒曜の秘典', // Ver. 4.7 新聖遺物
        15039: '旅人の心',
        15040: '勇士の心',
        15041: '守護の心',
        15042: '奇跡',
        15043: '狂戦士',
        15044: '武人',
        15045: '教官',
        15046: '博徒',
        15047: '亡命者',
        15048: '学者',
        15049: '火祭りの人',
        15050: '水祭りの人',
        15051: '雷祭りの人',
        15052: '氷祭りの人',
        15053: '冒険者',
        15054: '医者',
        15055: '幸運',
    };

    // 最新の武器IDと名前のマップ (変更なし、最新データに更新済み)
    const weaponNameMap = {
        // 片手剣 (Sword)
        11501: '風鷹剣',
        11502: '天空の刃',
        11503: '斬山の刃',
        11504: '磐岩結緑',
        11505: '蒼古なる自由への誓い',
        11506: '霧切の廻光',
        11507: '波乱月白経津',
        11508: '聖顕の鍵',
        11509: '萃光の裁葉',
        11510: '静水流転の輝き',
        11511: '有楽御簾切',
        11512: '赦罪',
        11401: '西風剣',
        11402: '笛の剣',
        11403: '祭礼の剣',
        11404: '旧貴族長剣',
        11405: '匣中龍吟',
        11406: '斬岩・試作',
        11407: '鉄蜂の刺し',
        11408: '黒岩の長剣',
        11409: '黒剣',
        11410: '降臨の剣',
        11411: '腐植の剣',
        11412: 'ダークアレイの閃光',
        11413: '天目影打',
        11414: 'シナバースピンドル',
        11415: '籠釣瓶一心',
        11416: '原木刀',
        11417: 'サイフォスの月明かり',
        11418: '東花坊時雨',
        11419: '狼牙',
        11420: '海淵のフィナーレ',
        11421: 'サーンドルの渡し守',
        11422: '船渠剣',
        11423: '水仙十字の剣',
        11301: '冷刃',
        11302: '黎明の神剣',
        11303: '旅道の剣',
        11304: 'チ虎魚の刀',
        11305: '飛天御剣',
        11306: '暗鉄剣',

        // 両手剣 (Claymore)
        12501: '天空の傲',
        12502: '狼の末路',
        12503: '無工の剣',
        12504: '松韻の響く頃',
        12505: '赤角石塵滅砕',
        12506: '葦海の標',
        12507: '裁断',
        12401: '西風大剣',
        12402: '鐘の剣',
        12403: '祭礼の大剣',
        12404: '雨裁',
        12405: '古華・試作',
        12406: '白影の剣',
        12407: '黒岩の斬刀',
        12408: '螭龍の剣',
        12409: '雪葬の星銀',
        12410: '千岩古剣',
        12411: '桂木斬長正',
        12412: '銜玉の海皇',
        12413: '惡王丸',
        12414: '森林のレガリア',
        12415: 'マカイラの水色',
        12416: '鉄彩の花',
        12417: '話死合い棒',
        12418: 'タイダル・シャドー',
        12419: '携帯型チェーンソー',
        12420: 'スーパーアルティメット覇王魔剣',
        12301: '鉄影段平',
        12302: '龍血を浴びた剣',
        12303: '白鉄の大剣',
        12304: '理屈責め',
        12305: '飛天大御剣',

        // 長柄武器 (Polearm)
        13501: '和璞鳶',
        13502: '天空の脊',
        13503: '破天の槍',
        13504: '護摩の杖',
        13505: '草薙の稲光',
        13506: '息災',
        13507: '赤砂の杖',
        13508: '赤月のシルエット',
        13509: 'ルミドゥースの挽歌',
        13401: '匣中滅龍',
        13402: '星鎌・試作',
        13403: '流月の針',
        13404: '黒岩の突槍',
        13405: '死闘の槍',
        13406: '西風長槍', // 武器ID 13424 がもしこれだったら対応
        13407: 'ドラゴンスピア',
        13408: '千岩長槍',
        13409: '喜多院十文字槍',
        13410: '漁獲',
        13411: '斬波のひれ長',
        13412: 'ムーンピアサー',
        13413: '風信の矛',
        13414: 'フィヨルドの歌',
        13415: '正義の報酬',
        13416: 'プロスペクタードリル',
        13417: '砂中の賢者達の問答',
        13418: '虹の行方',
        13301: '白纓槍',
        13302: '鉾槍',
        13303: '黒纓槍',

        // 法器 (Catalyst)
        14501: '天空の巻',
        14502: '四風原典',
        14503: '浮世の錠',
        14504: '不滅の月華',
        14505: '神楽の真意',
        14506: '千夜に浮かぶ夢',
        14507: 'トゥライトゥーラの記憶',
        14508: '碧落の瓏',
        14509: '久遠流転の大典',
        14510: '凛流の監視者',
        14511: '鶴鳴の余韻',
        14401: '西風秘典',
        14402: '流浪楽章',
        14403: '祭礼の断片',
        14404: '匣中日月',
        14405: '金珀・試作',
        14406: '万国諸海の図譜',
        14407: '黒岩の緋玉',
        14408: '昭心',
        14409: '冬忍びの実',
        14410: 'ダークアレイの酒と詩',
        14411: 'ドドコの物語',
        14412: '白辰の輪',
        14413: '誓いの明瞳',
        14414: '満悦の実',
        14415: '彷徨える星',
        14416: '古祠の瓏',
        14417: '純水流華',
        14418: '果てなき紺碧の唄',
        14419: 'ヤシュチェの環',
        14420: '蒼紋の角杯',
        14421: '波乗りの旋回',
        14301: '魔導緒論',
        14302: '龍殺しの英傑譚',
        14303: '異世界旅行記',
        14304: '翡玉法珠',
        14305: '特級の宝玉',

        // 弓 (Bow)
        15501: '天空の翼',
        15502: 'アモスの弓',
        15503: '終焉を嘆く詩',
        15504: '飛雷の鳴弦',
        15505: '冬極の白星',
        15506: '若水',
        15507: '狩人の道',
        15508: '始まりの大魔術',
        15509: '白雨心弦',
        15401: '西風猟弓', // 西風弓の一般的なID
        15402: '絶弦',
        15403: '祭礼の弓',
        15404: '旧貴族長弓',
        15405: '弓蔵',
        15406: '澹月・試作',
        15407: 'リングボウ',
        15408: '黒岩の戦弓',
        15409: '蒼翠の狩猟弓',
        15410: 'ダークアレイの狩人',
        15411: '風花の頌歌',
        15412: '幽夜のワルツ',
        15413: '破魔の弓',
        15414: 'プレデター',
        15415: '曚雲の月',
        15416: '落霞',
        15417: '王の近侍',
        15418: '竭沢',
        15419: 'トキの嘴',
        15420: '烈日の後嗣',
        15421: '静寂の唄',
        15422: 'レンジゲージ',
        15423: '築雲',
        15301: '鴉羽の弓',
        15302: 'シャープシューターの誓い',
        15303: 'リカーブボウ',
        15304: '弾弓',
        15305: '文使い',
    };

    // --- タブ切り替え機能 ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
>>>>>>> d8a584a6af93175796e230545285750a9b8f33f8

    // キャラクター情報表示関数
    function displayCharacterInfo(playerData) {
        characterDetailsDiv.innerHTML = ''; // クリア
        hideErrorMessage(); // エラーメッセージを隠す
        characterInfoDiv.classList.remove('hidden'); // キャラクター情報表示エリアを表示

        const profile = playerData.playerInfo;
        let htmlContent = `<h2>${profile.nickname} (冒険ランク: ${profile.level})</h2>`;
        htmlContent += `<p>世界ランク: ${profile.worldLevel || 'N/A'}</p>`;
        htmlContent += `<p>シグネチャ: ${profile.signature || 'N/A'}</p>`;
        htmlContent += `<p>アチーブメント数: ${profile.finishAchievementNum || 'N/A'}</p>`;
        htmlContent += `<p>深境螺旋のクリア回数: ${profile.towerFloorIndex || 'N/A'}層-${profile.towerLevelIndex || 'N/A'}間</p>`;
        htmlContent += `<p>表示キャラクター数: ${profile.showAvatarNumList?.length || 0}</p>`;


<<<<<<< HEAD
        // キャラクター詳細グリッド
        htmlContent += `<div class="character-grid">`;
        if (playerData.avatarInfoList && playerData.avatarInfoList.length > 0) {
            playerData.avatarInfoList.forEach(character => {
                const charId = character.avatarId;
                // character.propMap?.[20002]?.val はJSのプロパティアクセスとして不正なため、
                // 通常はtextMapHashなどから名前を解決しますが、characterNameMapを優先します。
                // Enka APIのcharacterオブジェクトに直接nameフィールドがある場合も考慮。
                let charName = characterNameMap[charId] || character.name || '不明なキャラクター';
=======
    // --- UID検索機能 ---
    searchButton.addEventListener('click', () => {
        const uid = uidInput.value.trim();
        if (uid) {
            const uidRegex = /^\d{9}$/; // 9桁のUIDを許可
            if (uidRegex.test(uid)) {
                fetchCharacterData(uid);
            } else {
                showError('UIDは9桁の数字で入力してください。（アジアサーバーの場合）');
            }
        } else {
            showError('UIDを入力してください。');
        }
    });
>>>>>>> d8a584a6af93175796e230545285750a9b8f33f8

                // 主人公の場合の特殊処理
                // Enka.NetworkはavatarIdを返すが、内部的にAether/Lumineの名前を持つことがある
                if (charId === 10000005) { // 空
                    charName = characterNameMap["Aether"]; // 明示的に空に
                } else if (charId === 10000006) { // 蛍
                    charName = characterNameMap["Lumine"]; // 明示的に蛍に
                } else if (charId === 10000030 || charId === 10000066 || charId === 10000080) {
                     // その他の主人公IDが来た場合、汎用的に「主人公」と表示
                    charName = '主人公';
                }

                const charLevel = character.propMap?.[4001]?.val || 'N/A'; // キャラクターレベルのプロパティID
                const charFriendship = character.fetterInfo?.expLevel || 'N/A'; // 信頼度

                const weapon = character.equipList?.find(item => item.flat?.itemType === 'ITEM_WEAPON');
                // weapon.flat.nameTextMapHash は生のハッシュ値なので、weaponNameMapで解決
                const weaponName = weapon ? (weaponNameMap[weapon.flat.itemReliquaryMainPropId] || weapon.flat.nameTextMapHash || '不明な武器') : 'なし'; // itemReliquaryMainPropIdではなくweaponStats.weaponIdを使うべきだが、データ構造による
                const weaponLevel = weapon ? (weapon.weapon?.level || 'N/A') : 'N/A';
                // 精錬ランクはaffixMapの最初のキーの値+1で取得
                const weaponRefinement = weapon && weapon.weapon?.affixMap && Object.keys(weapon.weapon.affixMap).length > 0
                                         ? (weapon.weapon.affixMap[Object.keys(weapon.weapon.affixMap)[0]] + 1)
                                         : 'N/A';


                const artifacts = character.equipList?.filter(item => item.flat?.itemType === 'ITEM_RELIQUARY');
                const artifactSets = {};
                artifacts.forEach(art => {
                    // flat.setNameTextMapHash は聖遺物セットのIDなので、artifactSetNameMapで解決
                    const setName = artifactSetNameMap[art.flat.setNameTextMapHash] || '不明な聖遺物';
                    artifactSets[setName] = (artifactSets[setName] || 0) + 1;
                });

                let artifactSetDisplay = '';
                for (const [setName, count] of Object.entries(artifactSets)) {
                    if (count >= 2) { // 2セット効果以上の場合のみ表示
                        artifactSetDisplay += `<span class="artifact-name">${setName} (${count})</span>`;
                    }
                }
                if (!artifactSetDisplay) {
                    artifactSetDisplay = '<span class="artifact-name">聖遺物セット効果なし</span>';
                }

                // アイコンのURL（Enka.NetworkのUI_AvatarIconを使用）
                // costumeIdが存在し0でない場合は衣装IDを優先
                const iconId = character.costumeId !== 0 ? character.costumeId : charId;
                const iconUrl = `https://enka.network/ui/UI_AvatarIcon_${iconId}.png`;

<<<<<<< HEAD
                htmlContent += `
                    <div class="character-card">
                        <img src="${iconUrl}" alt="${charName}アイコン" class="character-icon">
                        <h3 class="character-name">${charName}</h3>
                        <p>Lv: ${charLevel} / 信頼度: ${charFriendship}</p>
                        <p>武器: ${weaponName} (Lv${weaponLevel} 精錬${weaponRefinement})</p>
                        <div class="artifacts">
                            <p>聖遺物セット:</p>
                            ${artifactSetDisplay}
=======
        if (data && data.playerInfo && data.playerInfo.nickname) {
            const displayUid = data.playerInfo.uid || currentSearchedUid || '不明'; 
            
            let html = `
                <h3>${data.playerInfo.nickname} (UID: ${displayUid})</h3>
                <p>冒険ランク: ${data.playerInfo.level || '不明'}</p>
                <p>世界ランク: ${data.playerInfo.worldLevel || '不明'}</p>
                <p>アチーブメント: ${data.playerInfo.finishAchievementNum || '不明'}</p>
                <p>深境螺旋: ${data.playerInfo.towerFloorIndex !== undefined && data.playerInfo.towerLevelIndex !== undefined ? `${data.playerInfo.towerFloorIndex}-${data.playerInfo.towerLevelIndex}` : '挑戦履歴なし'}</p>
                <hr>
                <h4>展示キャラクター:</h4>
                <div class="character-grid">
            `;

            if (data.avatarInfoList && data.avatarInfoList.length > 0) {
                data.avatarInfoList.forEach(char => {
                    const characterId = char.avatarId;
                    // characterNameMap を使用して名前を解決
                    const characterName = characterNameMap[characterId] || `キャラクターID:${characterId}`;
                    const characterImageSrc = `https://enka.network/ui/UI_AvatarIcon_${characterId}.png`; // Enka.Networkの画像パスはIDを使用

                    const charLevel = char.propMap && char.propMap['4001'] ? char.propMap['4001'].val : '不明';
                    
                    let talentLevels = [];
                    if (char.skillLevelMap) {
                        const proudSkillExtraLevelMap = char.proudSkillExtraLevelMap || {};
                        
                        // 天賦レベルを攻撃>元素スキル>元素爆発の順で取得（最大3つ）
                        // ここはSkillDepotIdではなく、各キャラクターのproudSkillExtraLevelMapに紐づくキーでソートする方が正確
                        // 今回提供されたデータにはSkillDepotIdも含まれているので、それを活用する
                        const skillDepotId = char.skillDepotId; // キャラクターのスキルデポIDを取得

                        // ProudMapから対応するProudSkillIdを取得し、それに対応するスキルレベルを抽出
                        // これは非常に複雑なので、一旦、スキルレベルマップのキーをそのまま使う簡単な方法を継続
                        // もし天賦の表示がおかしい場合は、この部分のロジックを再検討します。
                        const skillIds = Object.keys(char.skillLevelMap).sort((a, b) => {
                            // シンプルに数字順にソートする
                            return parseInt(a) - parseInt(b);
                        }); 
                        
                        // 最大3つの天賦レベルを表示
                        for(let i = 0; i < Math.min(skillIds.length, 3); i++) {
                            const skillId = skillIds[i];
                            let level = char.skillLevelMap[skillId];
                            if (proudSkillExtraLevelMap[skillId]) {
                                level += proudSkillExtraLevelMap[skillId]; // 凸による天賦レベルアップ
                            }
                            talentLevels.push(level);
                        }
                    }
                    const skillLevelsDisplay = talentLevels.length > 0 ? talentLevels.join('/') : '情報なし';

                    const constellation = char.constellationNum !== undefined ? char.constellationNum : '不明';

                    let weaponDisplay = '武器情報なし';
                    const weaponEquip = char.equipList ? char.equipList.find(eq => eq.weapon) : null;
                    if (weaponEquip && weaponEquip.flat && weaponEquip.weapon) {
                        const weaponId = weaponEquip.itemId;
                        const weaponLevel = weaponEquip.weapon.level;
                        const weaponName = weaponNameMap[weaponId] || `武器ID:${weaponId}`;
                        weaponDisplay = `${weaponName} (Lv.${weaponLevel || '不明'})`;
                    }

                    let artifactsDisplay = '聖遺物情報なし';
                    const artifactEquips = char.equipList ? char.equipList.filter(eq => eq.reliquary) : [];
                    if (artifactEquips.length > 0) {
                        const artifactSets = {};
                        artifactEquips.forEach(art => {
                            // setId が存在し、かつ flat プロパティ内に定義されていることを厳密に確認
                            if (art.flat && art.flat.setId !== undefined) {
                                const setNameId = art.flat.setId;
                                const setName = artifactSetNameMap[setNameId] || `聖遺物ID:${setNameId}`;
                                artifactSets[setName] = (artifactSets[setName] || 0) + 1;
                            } else {
                                console.warn('聖遺物setIdが見つからないか、データが不完全です:', art);
                            }
                        });

                        const setNamesList = Object.keys(artifactSets);
                        if (setNamesList.length > 0) {
                            artifactsDisplay = setNamesList.map(setName => {
                                const count = artifactSets[setName];
                                return `<span class="artifact-name">${setName} (${count})</span>`;
                            }).join('<br>');
                        } else {
                            artifactsDisplay = '聖遺物セット情報取得エラー'; // 全てsetIdが見つからない場合
                        }
                    }


                    html += `
                        <div class="character-card">
                            <img src="${characterImageSrc}" alt="${characterName}" class="character-icon">
                            <p class="character-name">${characterName}</p>
                            <p>Lv.${charLevel} C${constellation}</p>
                            <p>天賦: ${skillLevelsDisplay}</p>
                            <p>武器: ${weaponDisplay}</p>
                            <div class="artifacts">
                                <p>聖遺物:</p>
                                ${artifactsDisplay}
                            </div>
>>>>>>> d8a584a6af93175796e230545285750a9b8f33f8
                        </div>
                        <div class="talents">
                            <p>天賦レベル:</p>
                            <p>通常攻撃: Lv.${character.skillLevelMap?.["10002"] || 'N/A'}</p>
                            <p>元素スキル: Lv.${character.skillLevelMap?.["10003"] || 'N/A'}</p>
                            <p>元素爆発: Lv.${character.skillLevelMap?.["10001"] || 'N/A'}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            htmlContent += '<p>表示可能なキャラクターがいません。</p>';
        }
        htmlContent += `</div>`; // .character-grid 閉じタグ

        characterDetailsDiv.innerHTML = htmlContent;
    }

<<<<<<< HEAD
    // ... (既存のコードは省略) ...
});
=======
    // --- 初期化処理 ---
    uidInput.value = '';
    tabButtons[0].click();
    characterInfoDisplayArea.classList.add('hidden');
    hideError();
});
>>>>>>> d8a584a6af93175796e230545285750a9b8f33f8
