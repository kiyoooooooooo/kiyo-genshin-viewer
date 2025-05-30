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

    // --- マッピングデータ (ゲーム内のデータに対応するIDと名前の確実な組み合わせ) ---
    // 最新のキャラクターIDと名前のマップ
    // （Enka.Networkの公式データに基づき、一般的なIDを採用）
    const characterNameMap = {
        10000002: 'ウェンティ',
        10000003: 'ジン',
        10000005: '旅人(風)',
        10000006: 'ディルック',
        10000007: '旅人(岩)',
        10000008: 'モナ',
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
        10000037: '雷電将軍', // 一般的なIDを採用し、重複は解消済み
        10000038: '楓原万葉',
        10000039: '旅人(雷)',
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
        10000083: 'エミリエ',
        10000085: '神里綾華',
        10000086: '宵宮',
        10000087: '早柚',
        10000088: 'アーロイ',
        10000089: '九条裟羅',
        10000090: '珊瑚宮心海',
        10000091: 'トーマ',
        10000096: '旅人(水)',
        10000121: '旅人(炎)',
    };

    // 最新の聖遺物セットIDと名前のマップ
    // （Enka.Networkの公式データに基づき、一般的なIDを採用）
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
        15034: '遂げられなかった想い', // 4.7で追加された新聖遺物
        15035: '黒曜の秘典', // 4.7で追加された新聖遺物
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

    // 最新の武器IDと名前のマップ
    // （Enka.Networkの公式データに基づき、一般的なIDを採用）
    // ★ここが以前のあなたのコードから大きく変更された部分です★
    const weaponNameMap = {
        // 片手剣 (Sword)
        11501: '風鷹剣',
        11502: '天空の刃',
        11503: '斬山の刃',
        11504: '磐岩結緑',
        11505: '蒼古なる自由への誓い',
        11506: '霧切の廻光', // 神里綾華のモチーフ
        11507: '波乱月白経津', // 神里綾人のモチーフ
        11508: '聖顕の鍵',
        11509: '萃光の裁葉',
        11510: '静水流転の輝き', // フリーナのモチーフ
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
        12502: '狼の末路', // ディルックのモチーフ
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
        13504: '護摩の杖', // 胡桃のモチーフ
        13505: '草薙の稲光', // 雷電将軍のモチーフ
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
        14502: '四風原典', // ウェンティのモチーフ
        14503: '浮世の錠',
        14504: '不滅の月華',
        14505: '神楽の真意',
        14506: '千夜に浮かぶ夢',
        14507: 'トゥライトゥーラの記憶',
        14508: '碧落の瓏',
        14509: '久遠流転の大典', // ヌヴィレットのモチーフ
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
        15504: '飛雷の鳴弦', // 宵宮のモチーフ
        15505: '冬極の白星',
        15506: '若水', // 夜蘭のモチーフ
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
            const uidRegex = /^\d{9}$/; // 9桁のUIDを許可 (10桁のUIDは存在しません。アジアサーバーのUIDは8か9桁です)
            if (uidRegex.test(uid)) {
                fetchCharacterData(uid);
            } else {
                showError('UIDは9桁の数字で入力してください。（アジアサーバーの場合）');
            }
        } else {
            showError('UIDを入力してください。');
        }
    });

    // --- 保存UIDクリア機能 ---
    clearSavedUidsButton.addEventListener('click', () => {
        if (confirm('保存された全てのUIDを削除しますか？')) {
            localStorage.removeItem('savedGenshinUids');
            localStorage.removeItem('lastSearchedUid');
            localStorage.removeItem('lastSearchedData');
            loadSavedUids();
            clearSavedUidsButton.classList.add('hidden');
            characterInfoDisplayArea.classList.add('hidden');
            uidInput.value = '';
            currentSearchedUid = null;
            hideError();
        }
    });

    // --- キャラクターデータ取得と表示 ---
    async function fetchCharacterData(uid) {
        showLoading();
        hideError();
        characterInfoDisplayArea.classList.add('hidden');

        try {
            const response = await fetch(`/api/genshin/character/${uid}`);

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data); // デバッグ用に受信データを確認
                displayCharacterData(data);
                currentSearchedUid = uid;

                localStorage.setItem('lastSearchedUid', uid);
                localStorage.setItem('lastSearchedData', JSON.stringify(data));

                let savedUids = getSavedUids();
                if (!savedUids.includes(uid)) {
                    savedUids.push(uid);
                    localStorage.setItem('savedGenshinUids', JSON.stringify(savedUids));
                }

                tabButtons[0].click();
            } else {
                const errorText = await response.text();
                if (errorText.includes("The UID doesn't seem to be correct") || errorText.includes("Player is not found")) {
                    showError(`エラー: UID「${uid}」はEnka.Networkで見つからないか、公開設定がされていません。入力ミスか、ゲーム内で「キャラクター詳細表示」をONにしているか確認してください。`);
                } else if (errorText.includes("Error: Rate limit exceeded")) {
                    showError('エラー: APIリクエストが多すぎます。しばらく時間を置いてから再度お試しください。');
                } else if (errorText.includes("Enka.Network API returned error")) {
                    showError(`Enka.Networkからのエラー: ${errorText.replace('Enka.Network API returned error: ', '')}`);
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
                    const characterName = characterNameMap[characterId] || `キャラクターID:${characterId}`;
                    const characterImageSrc = `https://enka.network/ui/UI_AvatarIcon_${characterId}.png`;
                    
                    const charLevel = char.propMap && char.propMap['4001'] ? char.propMap['4001'].val : '不明';
                    
                    let talentLevels = [];
                    if (char.skillLevelMap) {
                        const proudSkillExtraLevelMap = char.proudSkillExtraLevelMap || {};
                        
                        const skillIds = Object.keys(char.skillLevelMap).sort(); 
                        if (skillIds.length >= 3) {
                            for(let i = 0; i < 3; i++) {
                                const skillId = skillIds[i];
                                let level = char.skillLevelMap[skillId];
                                if (proudSkillExtraLevelMap[skillId]) {
                                    level += proudSkillExtraLevelMap[skillId];
                                }
                                talentLevels.push(level);
                            }
                        } else {
                            skillIds.forEach(skillId => {
                                let level = char.skillLevelMap[skillId];
                                if (proudSkillExtraLevelMap[skillId]) {
                                    level += proudSkillExtraLevelMap[skillId];
                                }
                                talentLevels.push(level);
                            });
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
                            const setNameId = art.flat.setId;
                            const setName = artifactSetNameMap[setNameId] || `聖遺物ID:${setNameId}`;
                            artifactSets[setName] = (artifactSets[setName] || 0) + 1;
                        });

                        artifactsDisplay = Object.keys(artifactSets).map(setName => {
                            const count = artifactSets[setName];
                            return `<span class="artifact-name">${setName} (${count})</span>`;
                        }).join('<br>');
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
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeUid(uid);
                });

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
    uidInput.value = '';
    tabButtons[0].click();
    characterInfoDisplayArea.classList.add('hidden');
    hideError();
});