document.addEventListener('DOMContentLoaded', () => {
    const uidInput = document.getElementById('uidInput');
    const searchButton = document.getElementById('searchButton');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    const characterInfoDisplayArea = document.getElementById('characterInfo');
    const characterDetailsDiv = document.getElementById('characterDetails');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const currentResultTabContent = document.getElementById('currentResult');
    const savedUidsTabContent = document.getElementById('savedUids');

    const savedUidList = document.getElementById('savedUidList');
    const clearSavedUidsButton = document.getElementById('clearSavedUids');

    let currentSearchedUid = null;

    // --- タブ切り替え機能 ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'savedUids') {
                loadSavedUids();
            }
        });
    });

    // --- UID検索機能 ---
    searchButton.addEventListener('click', () => {
        const uid = uidInput.value.trim();
        if (uid) {
            const uidRegex = /^\d{9,10}$/; // 9桁または10桁のUIDを許可
            if (uidRegex.test(uid)) {
                fetchCharacterData(uid);
            } else {
                showError('UIDは9桁または10桁の数字で入力してください。');
            }
        } else {
            showError('UIDを入力してください。');
        }
    });

    // --- 保存UIDクリア機能 ---
    clearSavedUidsButton.addEventListener('click', () => {
        if (confirm('保存された全てのUIDを削除しますか？')) {
            localStorage.removeItem('savedGenshinUids');
            localStorage.removeItem('lastSearchedUid'); // 検索履歴クリア
            localStorage.removeItem('lastSearchedData'); // 検索データクリア
            loadSavedUids();
            clearSavedUidsButton.classList.add('hidden');
            characterInfoDisplayArea.classList.add('hidden');
            uidInput.value = '';
            currentSearchedUid = null;
            hideError(); // クリア時にもエラーメッセージを非表示にする
        }
    });

    // --- キャラクターデータ取得と表示 ---
    async function fetchCharacterData(uid) {
        showLoading();
        hideError();
        characterInfoDisplayArea.classList.add('hidden'); // 新しい検索の前に非表示にする

        try {
            const response = await fetch(`/api/genshin/character/${uid}`);

            if (response.ok) {
                const data = await response.json();
                // console.log('Received data:', data); // デバッグ用に受信データを確認
                displayCharacterData(data);
                currentSearchedUid = uid;

                // 検索履歴の復元機能を無効化するため、lastSearchedUid/Dataの保存は不要だが
                // 将来的な再開のために残しておくことも可能 (今回はコメントアウトせず残す)
                localStorage.setItem('lastSearchedUid', uid);
                localStorage.setItem('lastSearchedData', JSON.stringify(data));

                let savedUids = getSavedUids();
                if (!savedUids.includes(uid)) {
                    savedUids.push(uid);
                    localStorage.setItem('savedGenshinUids', JSON.stringify(savedUids));
                }

                tabButtons[0].click(); // 検索後、結果タブに切り替える
            } else {
                const errorText = await response.text();
                // Enka.Networkからの特定のエラーメッセージを解析
                if (errorText.includes("The UID doesn't seem to be correct")) {
                    showError(`エラー: UID「${uid}」はEnka.Networkで無効と判断されました。入力ミスか、公開設定を確認してください。`);
                } else if (errorText.includes("Enka.Network API returned error: Player is not found")) {
                    showError(`エラー: UID「${uid}」のプレイヤーはEnka.Networkで見つかりませんでした。`);
                }
                 else {
                    showError(`エラーが発生しました: ${errorText}`);
                }
                currentSearchedUid = null;
                characterInfoDisplayArea.classList.add('hidden');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showError('通信エラーが発生しました。サーバーが起動しているか、ネットワーク接続を確認してください。');
            currentSearchedUid = null;
            characterInfoDisplayArea.classList.add('hidden');
        } finally {
            hideLoading();
        }
    }

    function displayCharacterData(data) {
        characterDetailsDiv.innerHTML = '';

        if (data && data.playerInfo && data.playerInfo.nickname) {
            // Enka.NetworkのAPIから返されたUIDを優先して表示
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
                const characterNameMap = {
                    10000005: '旅人(風)',
                    10000007: '旅人(岩)',
                    10000039: '旅人(雷)',
                    10000073: '旅人(草)',
                    10000096: '旅人(水)',
                    10000121: '旅人(炎)',

                    // よく使われる/表示されるキャラクター (一部、網羅的ではない)
                    10000002: 'ウェンティ',
                    10000003: 'ジン',
                    10000006: 'ディルック',
                    10000008: 'モナ', // (重複注意: IDによって別キャラクター扱いされる場合も)
                    10000009: '七七',
                    10000010: '刻晴',
                    10000011: 'アンバー',
                    10000012: 'ベネット',
                    10000013: '香菱',
                    10000014: 'ガイア',
                    10000015: '重雲',
                    10000016: '行秋',
                    10000017: 'バーバラ',
                    10000018: 'レザー',
                    10000019: 'リサ',
                    10000020: 'フィッシュル',
                    10000021: 'ノエル',
                    10000022: '凝光',
                    10000023: '北斗',
                    10000024: 'スクロース',
                    10000025: 'クレー',
                    10000026: 'タルタリヤ',
                    10000027: 'ディオナ',
                    10000028: '鍾離',
                    10000029: '辛炎',
                    10000030: 'アルベド',
                    10000031: '甘雨',
                    10000032: '魈',
                    10000033: '胡桃',
                    10000034: 'ロサリア',
                    10000035: '煙緋',
                    10000036: 'エウルア',
                    10000038: '楓原万葉',
                    10000040: 'ゴロー',
                    10000041: '荒瀧一斗',
                    10000042: '申鶴',
                    10000043: '雲菫',
                    10000044: '八重神子',
                    10000045: '神里綾人',
                    10000046: '夜蘭',
                    10000047: '久岐忍',
                    10000048: '鹿野院平蔵',
                    10000049: 'ティナリ',
                    10000050: 'コレイ',
                    10000051: 'ドリー',
                    10000052: 'セノ',
                    10000053: 'キャンディス',
                    10000054: 'ニィロウ',
                    10000055: 'ナヒーダ',
                    10000056: 'レイラ',
                    10000057: 'ファルザン',
                    10000058: '放浪者',
                    10000059: 'アルハイゼン',
                    10000060: 'ヨォーヨ',
                    10000061: 'ディシア',
                    10000062: 'ミカ',
                    10000063: '白朮',
                    10000064: 'カーヴェ',
                    10000065: '綺良々',
                    10000066: 'リネ',
                    10000067: 'リネット',
                    10000068: 'フレミネ',
                    10000069: 'ヌヴィレット',
                    10000070: 'リオセスリ',
                    10000071: 'フリーナ',
                    10000072: 'シャルロット',
                    10000073: 'ナヴィア',
                    10000074: 'シュヴルーズ',
                    10000075: '閑雲',
                    10000076: '嘉明',
                    10000077: '千織',
                    10000078: 'アルレッキーノ',
                    10000079: 'セトス',
                    10000080: 'ダリア',
                    10000081: 'クロリンデ',
                    10000082: 'エミリエ',
                    10000083: 'シグウィン',
                    10000084: 'セトス',
                    10000085: 'クロリンデ',
                    10000086: 'エミリエ',
                    10000087: '神里綾華',
                    10000088: '宵宮',
                    10000089: '早柚',
                    10000090: 'アーロイ',
                    10000091: '雷電将軍',
                    10000092: '九条裟羅',
                    10000093: '珊瑚宮心海',
                    10000094: 'トーマ',
                    10000095: 'ムアラ二',
                    10000097: 'カチーナ',
                    10000098: 'キィニチ',
                    10000099: 'シロネン',
                    10000100: 'チャスカ',
                    10000101: 'オロルン',
                    10000102: 'マーヴィカ',
                    10000103: 'シトラリ',
                    10000104: '夢見月瑞希',
                    10000105: 'ヴァレサ',
                    10000106: 'イアンサ',
                    10000107: 'エスコフィエ',
                    10000108: 'イファ',
                    10000109: 'スカーク',
                };

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
                    15034: '遂げられなかった想い',
                    15035: '黒曜の秘典',
                    15036: '灰燼の都に立つ英雄の絵巻',
                    15037: '深廊の終曲',
                    15038: '長き夜の誓い',
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

                const weaponNameMap = {
                    100000: '風鷹剣',
                    100001: '天空の刃',
                    100002: '斬山の刃',
                    100003: '磐岩結緑',
                    100004: '蒼古なる自由への誓い',
                    100005: '霧切の廻光',
                    100006: '波乱月白経津',
                    100007: '聖顕の鍵',
                    100008: '萃光の裁葉',
                    100009: '静水流転の輝き',
                    100010: '有楽御簾切',
                    100011: '赦罪',
                    100012: '岩峰を巡る歌',
                    100013: '西風剣',
                    100014: '笛の剣',
                    100015: '祭礼の剣',
                    100016: '旧貴族長剣',
                    100017: '匣中龍吟',
                    100018: '斬岩・試作',
                    100019: '鉄蜂の刺し',
                    100020: '黒岩の長剣',
                    100021: '黒剣',
                    100022: '降臨の剣',
                    100023: '腐植の剣',
                    100024: 'ダークアレイの閃光',
                    100025: '天目影打',
                    100026: 'シナバースピンドル',
                    100027: '籠釣瓶一心',
                    100028: '原木刀',
                    100029: 'サイフォスの月明かり',
                    100030: '東花坊時雨',
                    100031: '狼牙',
                    100032: '海淵のフィナーレ',
                    100033: 'サーンドルの渡し守',
                    100034: '船渠剣',
                    100035: '水仙十字の剣',
                    100036: 'エズピツァルの笛',
                    100037: 'ストロング・ボーン',
                    100038: '厄水の災い',
                    100039: '冷刃',
                    100040: '黎明の神剣',
                    100041: '旅道の剣',
                    100042: 'チ虎魚の刀',
                    100043: '飛天御剣',
                    100044: '暗鉄剣',
                    100045: '天空の傲',
                    100046: '狼の末路',
                    100047: '無工の剣',
                    100048: '松韻の響く頃',
                    100049: '赤角石塵滅砕',
                    100050: '葦海の標',
                    100051: '裁断',
                    100052: '山の王の長牙',
                    100053: '千烈の日輪',
                    100054: '西風大剣',
                    100055: '鐘の剣',
                    100056: '祭礼の大剣',
                    100057: '旧貴族大剣',
                    100058: '雨裁',
                    100059: '古華・試作',
                    100060: '白影の剣',
                    100061: '黒岩の斬刀',
                    100062: '螭龍の剣',
                    100063: '雪葬の星銀',
                    100064: '千岩古剣',
                    100065: '桂木斬長正',
                    100066: '銜玉の海皇',
                    100067: '惡王丸',
                    100068: '森林のレガリア',
                    100069: 'マカイラの水色',
                    100070: '鉄彩の花',
                    100071: '話死合い棒',
                    100072: 'タイダル・シャドー',
                    100073: '携帯型チェーンソー',
                    100074: 'スーパーアルティメット覇王魔剣',
                    100075: 'アースシェイカー',
                    100076: '実りの鉤鉈',
                    100077: '鉄影段平',
                    100078: '龍血を浴びた剣',
                    100079: '白鉄の大剣',
                    100080: '理屈責め',
                    100081: '飛天大御剣',
                    100082: '和璞鳶',
                    100083: '天空の脊',
                    100084: '破天の槍',
                    100085: '護摩の杖',
                    100086: '草薙の稲光',
                    100087: '息災',
                    100088: '赤砂の杖',
                    100089: '赤月のシルエット',
                    100090: 'ルミドゥースの挽歌',
                    100091: '香りのシンフォニスト',
                    100092: '匣中滅龍',
                    100093: '星鎌・試作',
                    100094: '流月の針',
                    100095: '黒岩の突槍',
                    100096: '死闘の槍',
                    100097: '西風長槍',
                    100098: '旧貴族猟槍',
                    100099: 'ドラゴンスピア',
                    100100: '千岩長槍',
                    100101: '喜多院十文字槍',
                    100102: '漁獲',
                    100103: '斬波のひれ長',
                    100104: 'ムーンピアサー',
                    100105: '風信の矛',
                    100106: 'フィヨルドの歌',
                    100107: '正義の報酬',
                    100108: 'プロスペクタードリル',
                    100109: '砂中の賢者達の問答',
                    100110: '虹の行方',
                    100111: '鎮山の釘',
                    100112: '玉響停の御噺',
                    100113: '白纓槍',
                    100114: '鉾槍',
                    100115: '黒纓槍',
                    100116: '天空の巻',
                    100117: '四風原典',
                    100118: '浮世の錠',
                    100119: '不滅の月華',
                    100120: '神楽の真意',
                    100121: '千夜に浮かぶ夢',
                    100122: 'トゥライトゥーラの記憶',
                    100123: '碧落の瓏',
                    100124: '久遠流転の大典',
                    100125: '凛流の監視者',
                    100126: '鶴鳴の余韻',
                    100127: 'サーフィンタイム',
                    100128: '祭星者の眺め',
                    100129: '寝正月の初晴',
                    100130: 'ヴィヴィッド・ハート',
                    100131: '西風秘典',
                    100132: '流浪楽章',
                    100133: '祭礼の断片',
                    100134: '旧貴族秘法録',
                    100135: '匣中日月',
                    100136: '金珀・試作',
                    100137: '万国諸海の図譜',
                    100138: '黒岩の緋玉',
                    100139: '昭心',
                    100140: '冬忍びの実',
                    100141: 'ダークアレイの酒と詩',
                    100142: 'ドドコの物語',
                    100143: '白辰の輪',
                    100144: '誓いの明瞳',
                    100145: '満悦の実',
                    100146: '彷徨える星',
                    100147: '古祠の瓏',
                    100148: '純水流華',
                    100149: '果てなき紺碧の唄',
                    100150: 'ヤシュチェの環',
                    100151: '蒼紋の角杯',
                    100152: '波乗りの旋回',
                    100153: '魔導緒論',
                    100154: '龍殺しの英傑譚',
                    100155: '異世界旅行記',
                    100156: '翡玉法珠',
                    100157: '特級の宝玉',
                    100158: '天空の翼',
                    100159: 'アモスの弓',
                    100160: '終焉を嘆く詩',
                    100161: '飛雷の鳴弦',
                    100162: '冬極の白星',
                    100163: '若水',
                    100164: '狩人の道',
                    100165: '始まりの大魔術',
                    100166: '白雨心弦',
                    100167: '星鷲の紅き羽',
                    100168: '西風猟弓',
                    100169: '絶弦',
                    100170: '祭礼の弓',
                    100171: '旧貴族長弓',
                    100172: '弓蔵',
                    100173: '澹月・試作',
                    100174: 'リングボウ',
                    100175: '黒岩の戦弓',
                    100176: '蒼翠の狩猟弓',
                    100177: 'ダークアレイの狩人',
                    100178: '風花の頌歌',
                    100179: '幽夜のワルツ',
                    100180: '破魔の弓',
                    100181: 'プレデター',
                    100182: '曚雲の月',
                    100183: '落霞',
                    100184: '王の近侍',
                    100185: '竭沢',
                    100186: 'トキの嘴',
                    100187: '烈日の後嗣',
                    100188: '静寂の唄',
                    100189: 'レンジゲージ',
                    100190: '築雲',
                    100191: 'チェーンブレイカー',
                    100192: '花飾りの羽',
                    100193: '冷寂の音',
                    100194: '鴉羽の弓',
                    100195: 'シャープシューターの誓い',
                    100196: 'リカーブボウ',
                    100197: '弾弓',
                    100198: '文使い',
                };


                data.avatarInfoList.forEach(char => {
                    const characterId = char.avatarId;
                    const characterName = characterNameMap[characterId] || `キャラクターID:${characterId}`;
                    // Enka.Networkのアイコン画像URL
                    const characterImageSrc = `https://enka.network/ui/UI_AvatarIcon_${characterId}.png`;
                    
                    const charLevel = char.propMap && char.propMap['4001'] ? char.propMap['4001'].val : '不明';
                    
                    // 天賦レベルの抽出
                    let talentLevels = [];
                    if (char.skillLevelMap) {
                        const proudSkillExtraLevelMap = char.proudSkillExtraLevelMap || {};
                        
                        Object.keys(char.skillLevelMap).forEach(skillId => {
                            let level = char.skillLevelMap[skillId];
                            if (proudSkillExtraLevelMap[skillId]) {
                                level += proudSkillExtraLevelMap[skillId];
                            }
                            talentLevels.push(level);
                        });
                        talentLevels.sort((a, b) => a - b);
                    }
                    const skillLevelsDisplay = talentLevels.length > 0 ? talentLevels.join('/') : '情報なし';

                    // 命の星座の表示
                    const constellation = char.constellationNum !== undefined ? char.constellationNum : '不明';

                    // 武器情報の抽出
                    let weaponDisplay = '武器情報なし';
                    const weaponEquip = char.equipList ? char.equipList.find(eq => eq.weapon) : null;
                    if (weaponEquip && weaponEquip.flat && weaponEquip.weapon) {
                        const weaponId = weaponEquip.itemId;
                        const weaponLevel = weaponEquip.weapon.level;
                        const weaponName = weaponNameMap[weaponId] || `武器ID:${weaponId}`;
                        weaponDisplay = `${weaponName} (Lv.${weaponLevel || '不明'})`;
                    }

                    // 聖遺物情報の抽出
                    let artifactsDisplay = '聖遺物情報なし';
                    const artifactEquips = char.equipList ? char.equipList.filter(eq => eq.reliquary) : [];
                    if (artifactEquips.length > 0) {
                        // セット効果を考慮した聖遺物名のリスト化
                        // 例: 燃え盛る炎の魔女 (4) / 剣闘士のフィナーレ (2) のように表示したい場合
                        const artifactSets = {};
                        artifactEquips.forEach(art => {
                            const setNameId = art.flat.setId;
                            const setName = artifactSetNameMap[setNameId] || `聖遺物ID:${setNameId}`;
                            artifactSets[setName] = (artifactSets[setName] || 0) + 1;
                        });

                        artifactsDisplay = Object.keys(artifactSets).map(setName => {
                            const count = artifactSets[setName];
                            return `<span class="artifact-name">${setName} (${count})</span>`;
                        }).join(''); // 各セットを新しい行で表示
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
                        </div>
                    `;
                });
            } else {
                html += '<p>キャラクター展示情報が見つかりませんでした。プレイヤーが展示を公開しているか確認してください。</p>';
            }
            html += '</div>';

            characterDetailsDiv.innerHTML = html;
            characterInfoDisplayArea.classList.remove('hidden');
        } else {
            showError('このUIDのキャラクター展示情報が見つかりませんでした。プレイヤーが展示を公開しているか確認してください。');
            characterInfoDisplayArea.classList.add('hidden');
        }
    }

    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }

    function getSavedUids() {
        const savedUidsJson = localStorage.getItem('savedGenshinUids');
        return savedUidsJson ? JSON.parse(savedUidsJson) : [];
    }

    function saveUid(uid) {
        let uids = getSavedUids();
        if (!uids.includes(uid)) {
            uids.push(uid);
            localStorage.setItem('savedGenshinUids', JSON.stringify(uids));
            loadSavedUids();
        }
    }

    function removeUid(uidToRemove) {
        let uids = getSavedUids();
        uids = uids.filter(uid => uid !== uidToRemove);
        localStorage.setItem('savedGenshinUids', JSON.stringify(uids));
        loadSavedUids();

        if (uids.length === 0) {
            clearSavedUidsButton.classList.add('hidden');
        }

        if (uidToRemove === currentSearchedUid) {
            localStorage.removeItem('lastSearchedUid');
            localStorage.removeItem('lastSearchedData');
            characterInfoDisplayArea.classList.add('hidden');
            uidInput.value = '';
            currentSearchedUid = null;
        }
    }

    function loadSavedUids() {
        const uids = getSavedUids();
        savedUidList.innerHTML = '';

        if (uids.length > 0) {
            uids.forEach(uid => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = uid;
                span.title = 'クリックして検索';
                span.addEventListener('click', () => {
                    fetchCharacterData(uid);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.addEventListener('click', () => removeUid(uid));

                li.appendChild(span);
                li.appendChild(deleteButton);
                savedUidList.appendChild(li);
            });
            clearSavedUidsButton.classList.remove('hidden');
        } else {
            savedUidList.innerHTML = '<p>保存されたUIDはありません。</p>';
            clearSavedUidsButton.classList.add('hidden');
        }
    }

    // --- 初期化処理 ---
    // サイトを開いたときに検索欄を空白にするため、前回の検索履歴の復元を無効化
    // もし後で復元機能が必要になった場合は、以下のコメントアウトを解除し、uidInput.value = '' を削除してください。
    // const lastSearchedUid = localStorage.getItem('lastSearchedUid');
    // const lastSearchedData = localStorage.getItem('lastSearchedData');

    // if (lastSearchedUid && lastSearchedData) {
    //     uidInput.value = lastSearchedUid;
    //     try {
    //         const parsedData = JSON.parse(lastSearchedData);
    //         displayCharacterData(parsedData);
    //         currentSearchedUid = lastSearchedUid;

    //         let savedUids = getSavedUids();
    //         if (!savedUids.includes(lastSearchedUid)) {
    //             savedUids.push(lastSearchedUid);
    //             localStorage.setItem('savedGenshinUids', JSON.stringify(savedUids));
    //         }
    //         tabButtons[0].click();
    //     } catch (e) {
    //         console.error("Failed to parse last searched data from localStorage", e);
    //         localStorage.removeItem('lastSearchedData');
    //         localStorage.removeItem('lastSearchedUid');
    //         tabButtons[0].click(); // パース失敗時はデフォルトで最初のタブを表示
    //     }
    // } else {
    //     tabButtons[0].click();
    // }

    // 常に検索欄を空白にする
    uidInput.value = '';
    tabButtons[0].click(); // 初期表示で「キャラ」タブをアクティブにする
    // ここでキャラクター情報は表示されないので、characterInfoDisplayAreaも隠しておく
    characterInfoDisplayArea.classList.add('hidden');
    hideError(); // エラーメッセージも初期状態では非表示にする
});