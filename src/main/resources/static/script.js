// C:\Users\Public\genweb\src\main\resources\static\script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (既存のコードは省略, conflict markerより上の部分はそのまま) ...

    const uidInput = document.getElementById('uidInput'); // Assuming these elements exist in the HTML
    const searchButton = document.getElementById('searchButton');
    const errorMessageDiv = document.getElementById('errorMessage');
    const characterInfoDisplayArea = document.getElementById('characterInfo'); // Renamed for clarity vs. characterDetailsDiv
    const characterDetailsDiv = document.getElementById('characterDetails'); // Holds character cards

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const currentResultTabContent = document.getElementById('currentResult');
    const savedUidsTabContent = document.getElementById('savedUids');

    const savedUidList = document.getElementById('savedUidList');
    const clearSavedUidsButton = document.getElementById('clearSavedUids');

    let currentSearchedUid = null;

    // Helper to show error messages
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
        characterInfoDisplayArea.classList.add('hidden'); // Hide character info on error
    }

    // Helper to hide error messages
    function hideErrorMessage() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.classList.add('hidden');
    }

    // --- マッピングデータ (統合された最新のデータ) ---
    const characterNameMap = {
        // 通常のキャラクター (優先: HEADの最新かつ網羅的なリスト)
        "10000002": "神里綾華",
        "10000003": "ジン",
        // 主人公のIDはHEADのものを優先し、補足名を付与
        "10000005": "主人公（空）", // UI_AvatarIcon_Side_PlayerBoy
        "10000006": "主人公（蛍）", // UI_AvatarIcon_Side_PlayerGirl
        "10000007": "アンバー",
        "10000014": "リサ",
        "10000015": "ガイア",
        "10000016": "バーバラ",
        "10000020": "ディルック",
        "10000021": "七七",
        "10000022": "刻晴",
        "10000023": "ウェンティ",
        "10000024": "香菱", // d8a584aのIDは香菱だが、HEADでは27。HEADの27を優先し、d8a584aの24はレザーだったので修正
        "10000025": "行秋", // d8a584aからの追加
        "10000026": "クレー", // HEADとd8a584aで異なるため、HEADを優先
        "10000027": "香菱", // HEADの香菱
        "10000029": "モナ",
        "10000030": "鍾離", // HEADとd8a584aで異なるため、HEADを優先
        "10000031": "タルタリヤ", // HEADとd8a584aで異なるため、HEADを優先
        "10000032": "ディオナ", // HEADとd8a584aで異なるため、HEADを優先
        "10000033": "鍾離", // d8a584aのタルタリヤはHEADでは鍾離。HEAD優先
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
        "10000066": "ヨォーヨ", // HEADのヨォーヨ
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
        "10000080": "シュヴルーズ", // HEADのシュヴルーズ
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
        // d8a584aの古いマッピングと統合しつつ、HEADの情報を優先
        "10000030": "主人公（岩）", // 古いデータ形式の名残か、特定状況でこのIDが来る可能性 (HEAD)
        "10000096": "主人公（水）", // d8a584aからの追加
        "10000121": "主人公（炎）", // d8a584aからの追加

        // Enka APIが返す可能性のある主人公の 'name' フィールドの値 (HEAD)
        "Aether": "空（主人公）",
        "Lumine": "蛍（主人公）",
    };

    // 武器IDと表示名のマッピング (d8a584aを優先)
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
        13406: '西風長槍',
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
        15401: '西風猟弓',
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

    // 聖遺物セットIDと表示名のマッピング (d8a584aを優先)
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

    // キャラクター情報表示関数 (HEADの構造とd8a584aのロジックを統合)
    function displayCharacterInfo(playerData) {
        characterDetailsDiv.innerHTML = ''; // クリア
        hideErrorMessage(); // エラーメッセージを隠す
        characterInfoDisplayArea.classList.remove('hidden'); // キャラクター情報表示エリアを表示

        const profile = playerData.playerInfo;
        const displayUid = profile.uid || currentSearchedUid || '不明'; // UIDを確実に表示
        let htmlContent = `<h2>${profile.nickname} (UID: ${displayUid})</h2>`;
        htmlContent += `<p>冒険ランク: ${profile.level || 'N/A'}</p>`;
        htmlContent += `<p>世界ランク: ${profile.worldLevel || 'N/A'}</p>`;
        htmlContent += `<p>シグネチャ: ${profile.signature || 'N/A'}</p>`;
        htmlContent += `<p>アチーブメント数: ${profile.finishAchievementNum || 'N/A'}</p>`;
        htmlContent += `<p>深境螺旋のクリア回数: ${profile.towerFloorIndex !== undefined && profile.towerLevelIndex !== undefined ? `${profile.towerFloorIndex}層-${profile.towerLevelIndex}間` : '挑戦履歴なし'}</p>`;
        htmlContent += `<p>表示キャラクター数: ${profile.showAvatarNumList?.length || 0}</p>`;
        htmlContent += `<hr>`;
        htmlContent += `<h4>展示キャラクター:</h4>`;


        // キャラクター詳細グリッド
        htmlContent += `<div class="character-grid">`;
        if (playerData.avatarInfoList && playerData.avatarInfoList.length > 0) {
            playerData.avatarInfoList.forEach(character => {
                const charId = character.avatarId;

                let charName = characterNameMap[charId] || character.name || `不明なキャラクター (ID: ${charId})`;

                // 主人公の場合の特殊処理 (HEADのロジック)
                if (charId === 10000005) { // 空
                    charName = characterNameMap["Aether"];
                } else if (charId === 10000006) { // 蛍
                    charName = characterNameMap["Lumine"];
                } else if (charId === 10000030 || charId === 10000066 || charId === 10000080 || charId === 10000096 || charId === 10000121) {
                    // その他の主人公IDが来た場合、汎用的に「主人公」と表示
                    // より具体的な名前がある場合はそちらを優先 (例: characterNameMap[10000096] = "主人公（水）")
                    charName = characterNameMap[charId] || '主人公';
                }

                const charLevel = character.propMap?.[4001]?.val || 'N/A'; // キャラクターレベルのプロパティID
                const charFriendship = character.fetterInfo?.expLevel || 'N/A'; // 信頼度
                const constellation = character.constellationNum !== undefined ? character.constellationNum : 'N/A';

                // 武器情報 (d8a584aのロジック: itemIdを使用)
                const weapon = character.equipList?.find(item => item.flat?.itemType === 'ITEM_WEAPON');
                const weaponName = weapon ? (weaponNameMap[weapon.itemId] || weapon.flat.nameTextMapHash || '不明な武器') : 'なし';
                const weaponLevel = weapon ? (weapon.weapon?.level || 'N/A') : 'N/A';
                const weaponRefinement = weapon && weapon.weapon?.affixMap && Object.keys(weapon.weapon.affixMap).length > 0 ?
                    (weapon.weapon.affixMap[Object.keys(weapon.weapon.affixMap)[0]] + 1) : 'N/A';

                // 聖遺物情報 (d8a584aのロジック: setIdを使用)
                const artifacts = character.equipList?.filter(item => item.flat?.itemType === 'ITEM_RELIQUARY');
                const artifactSets = {};
                artifacts.forEach(art => {
                    if (art.flat && art.flat.setId !== undefined) {
                        const setName = artifactSetNameMap[art.flat.setId] || `聖遺物ID:${art.flat.setId}`;
                        artifactSets[setName] = (artifactSets[setName] || 0) + 1;
                    }
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

                // 天賦レベル (HEADの明確なキーとd8a584aの動的な補正を結合)
                let normalAttackLevel = character.skillLevelMap?.["10002"] || 0;
                let elementalSkillLevel = character.skillLevelMap?.["10003"] || 0;
                let elementalBurstLevel = character.skillLevelMap?.["10001"] || 0;

                // 凸による天賦レベルアップ (d8a584aのproudSkillExtraLevelMapロジック)
                const proudSkillExtraLevelMap = character.proudSkillExtraLevelMap || {};
                // これらのキーはキャラクターによって異なるため、一般的なProudSkillIdのマッピングが必要だが、
                // 最も一般的な攻撃、スキル、爆発の対応するキーで適用を試みる。
                // Enka.networkのデータではproudSkillExtraLevelMapのキーはスキルIDに対応している場合が多い。
                for (const skillId in proudSkillExtraLevelMap) {
                    if (character.skillLevelMap?.[skillId]) { // 該当するスキルIDがある場合のみ加算
                        // ここでどのskillIdが通常攻撃、スキル、爆発に対応するかを動的に判断するのは難しい
                        // 簡潔に、最も重要な3つの天賦に適用するロジックを維持
                        // ※注意: 正確なマッピングがない場合、これは完璧ではない可能性があります
                        if (skillId === "10002") normalAttackLevel += proudSkillExtraLevelMap[skillId];
                        if (skillId === "10003") elementalSkillLevel += proudSkillExtraLevelMap[skillId];
                        if (skillId === "10001") elementalBurstLevel += proudSkillExtraLevelMap[skillId];
                    }
                }

                const talentDisplay = `
                    <p>通常攻撃: Lv.${normalAttackLevel || 'N/A'}</p>
                    <p>元素スキル: Lv.${elementalSkillLevel || 'N/A'}</p>
                    <p>元素爆発: Lv.${elementalBurstLevel || 'N/A'}</p>
                `;

                // アイコンのURL（Enka.NetworkのUI_AvatarIconを使用）
                const iconId = character.costumeId !== 0 ? character.costumeId : charId;
                const iconUrl = `https://enka.network/ui/UI_AvatarIcon_${iconId}.png`;

                htmlContent += `
                    <div class="character-card">
                        <img src="${iconUrl}" alt="${charName}アイコン" class="character-icon">
                        <h3 class="character-name">${charName}</h3>
                        <p>Lv: ${charLevel} / 信頼度: ${charFriendship} / 凸: C${constellation}</p>
                        <p>武器: ${weaponName} (Lv.${weaponLevel} 精錬${weaponRefinement})</p>
                        <div class="artifacts">
                            <p>聖遺物セット:</p>
                            ${artifactSetDisplay}
                        </div>
                        <div class="talents">
                            <p>天賦レベル:</p>
                            ${talentDisplay}
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

    // --- UID検索機能 --- (d8a584aのロジック)
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

    // Enka.Networkからデータをフェッチする関数 (d8a584aのロジック)
    async function fetchCharacterData(uid) {
        hideErrorMessage();
        characterInfoDisplayArea.classList.add('hidden'); // Fetch中は一旦非表示
        currentSearchedUid = uid; // 検索中のUIDを保存

        try {
            // プロキシ経由でEnka.Networkにアクセス
            const response = await fetch(`https://enka.network/api/uid/${uid}/`);
            if (!response.ok) {
                // HTTPエラーの場合
                if (response.status === 400) {
                    showError('無効なUIDです。UIDが正しいか、公開設定になっているか確認してください。');
                } else if (response.status === 404) {
                    showError('指定されたUIDのデータが見つかりませんでした。');
                } else if (response.status === 429) {
                    showError('リクエストが多すぎます。しばらく待ってから再度お試しください。');
                } else {
                    showError(`データの取得中にエラーが発生しました: ${response.status} ${response.statusText}`);
                }
                console.error('Enka.Network API Error:', response.status, response.statusText);
                return;
            }
            const data = await response.json();

            // 成功した場合、データを表示
            if (data) {
                displayCharacterInfo(data);
                saveUidToLocalStorage(uid); // 成功した場合のみ保存
            } else {
                showError('データの解析に失敗しました。');
            }

        } catch (error) {
            console.error('Fetch error:', error);
            showError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
        }
    }

    // UIDをローカルストレージに保存する関数 (d8a584aのロジック)
    function saveUidToLocalStorage(uid) {
        let savedUids = JSON.parse(localStorage.getItem('genshinImpactUids')) || [];
        if (!savedUids.includes(uid)) {
            savedUids.push(uid);
            localStorage.setItem('genshinImpactUids', JSON.stringify(savedUids));
            renderSavedUids(); // 保存UIDリストを更新
        }
    }

    // ローカルストレージからUIDを削除する関数 (d8a584aのロジック)
    function removeUidFromLocalStorage(uidToRemove) {
        let savedUids = JSON.parse(localStorage.getItem('genshinImpactUids')) || [];
        savedUids = savedUids.filter(uid => uid !== uidToRemove);
        localStorage.setItem('genshinImpactUids', JSON.stringify(savedUids));
        renderSavedUids(); // 保存UIDリストを更新
    }

    // 保存されたUIDをリスト表示する関数 (d8a584aのロジック)
    function renderSavedUids() {
        savedUidList.innerHTML = '';
        let savedUids = JSON.parse(localStorage.getItem('genshinImpactUids')) || [];
        if (savedUids.length === 0) {
            savedUidList.innerHTML = '<p>保存されたUIDはありません。</p>';
            return;
        }
        savedUids.forEach(uid => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${uid}</span>
                <button class="load-uid-button" data-uid="${uid}">読み込み</button>
                <button class="delete-uid-button" data-uid="${uid}">削除</button>
            `;
            savedUidList.appendChild(listItem);
        });

        // 読み込みボタンのイベントリスナー
        savedUidList.querySelectorAll('.load-uid-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const uidToLoad = event.target.dataset.uid;
                uidInput.value = uidToLoad; // 入力欄にUIDをセット
                fetchCharacterData(uidToLoad);
                tabButtons[0].click(); // 結果タブに切り替える
            });
        });

        // 削除ボタンのイベントリスナー
        savedUidList.querySelectorAll('.delete-uid-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const uidToDelete = event.target.dataset.uid;
                removeUidFromLocalStorage(uidToDelete);
            });
        });
    }

    // --- タブ切り替え機能 --- (d8a584aのロジック)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById(targetTab).classList.remove('hidden');
            button.classList.add('active');

            if (targetTab === 'savedUids') {
                renderSavedUids(); // 保存UIDタブが選択されたときにリストを更新
            }
        });
    });

    // クリアボタンのイベントリスナー (d8a584aのロジック)
    clearSavedUidsButton.addEventListener('click', () => {
        if (confirm('保存されたすべてのUIDを削除してもよろしいですか？')) {
            localStorage.removeItem('genshinImpactUids');
            renderSavedUids();
        }
    });

    // --- 初期化処理 --- (d8a584aのロジック)
    uidInput.value = '';
    tabButtons[0].click(); // 初期表示は「現在の結果」タブ
    characterInfoDisplayArea.classList.add('hidden'); // 初期状態では情報を非表示
    hideErrorMessage();
});