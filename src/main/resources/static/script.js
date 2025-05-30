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
                // Enka.NetworkのIDと名称のマッピングデータ（ユーザー自身で拡張が必要）
                // ★★★ この部分が非常に長いです ★★★
                const characterNameMap = {
                    // 旅人(風/岩/雷/草/水/炎) - 属性によってIDが変わるため、代表的なもののみ
                    10000005: '旅人(風)',
                    10000007: '旅人(岩)',
                    10000039: '旅人(雷)',
                    10000073: '旅人(草)',
                    10000096: '旅人(水)',
                    10000121: '旅人(炎)', // 例: 炎旅人

                    // よく使われる/表示されるキャラクター (一部、網羅的ではない)
                    10000002: '神里綾華',
                    10000003: 'アンバー',
                    10000006: 'ガイア',
                    10000008: 'リサ', // (重複注意: IDによって別キャラクター扱いされる場合も)
                    10000009: 'バーバラ',
                    10000010: 'ディルック',
                    10000011: '七七',
                    10000012: 'モナ',
                    10000013: 'クレー',
                    10000014: 'ウェンティ',
                    10000015: '刻晴',
                    10000016: 'ジン',
                    10000017: 'フィッシュル',
                    10000018: '香菱',
                    10000019: 'スクロース',
                    10000020: '重雲',
                    10000021: 'ディオナ',
                    10000022: '凝光',
                    10000023: '行秋',
                    10000024: '北斗',
                    10000025: '辛炎',
                    10000026: '鍾離',
                    10000027: 'アルベド',
                    10000028: '甘雨',
                    10000029: '魈',
                    10000030: '胡桃',
                    10000031: 'エウルア',
                    10000032: '楓原万葉',
                    10000033: '宵宮',
                    10000034: '早柚',
                    10000035: '雷電将軍',
                    10000036: '珊瑚宮心海',
                    10000038: 'トーマ',
                    10000040: 'ゴロー',
                    10000041: '荒瀧一斗',
                    10000042: '申鶴',
                    10000043: '雲菫',
                    10000044: '八重神子',
                    10000045: '神里綾人',
                    10000046: 'イェラン',
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
                    10000080: 'シグウィン',
                    10000081: 'クロリンデ',
                    10000082: 'エミリエ',
                    10000083: 'シグウィン', //重複IDの可能性
                    10000084: 'セトス',   //重複IDの可能性
                    10000085: 'クロリンデ', //重複IDの可能性
                    10000086: 'エミリエ', //重複IDの可能性
                    // 新規キャラクターは公式発表後にIDを確認して追加してください
                };

                const artifactSetNameMap = {
                    // スクリーンショットに表示されていた聖遺物
                    15006: '燃え盛る炎の魔女',
                    15031: '剣闘士のフィナーレ',
                    15020: '蒼白の炎',
                    15032: '水仙の夢',
                    10007: '狂戦士',
                    15037: '黄金の夢',

                    // 一般的に良く使われる/表示される聖遺物セット (一部、網羅的ではない)
                    15001: '亡命者',
                    15002: '旅人の心',
                    15003: '勇士の心',
                    15004: '幸運',
                    15005: '医者',
                    15007: '雷のような怒り',
                    15008: '雷のようになだめる怒り',
                    15009: '翠緑の影',
                    15010: '愛される少女',
                    15011: '旧貴族のしつけ',
                    15012: '血染めの騎士道',
                    15013: '旧貴族のしつけ', // 重複注意: IDが異なるが同じセット名
                    15014: '氷風を彷徨う勇士',
                    15015: '悠久の磐岩',
                    15016: '炎の魔女', // 重複注意: IDが異なるが同じセット名
                    15017: '絶縁の旗印', // 非常によく使う
                    15018: '千岩牢固', // 非常によく使う
                    15019: '追憶のしめ縄', // 非常によく使う
                    15021: '来歆の余響',
                    15022: '辰砂往生録',
                    15023: '深林の記憶',
                    15024: '金メッキの夢',
                    15025: '砂上の楼閣の史話',
                    15026: '水仙の夢', // 重複注意
                    15028: '楽園の絶花',
                    15029: '水仙の夢', // 重複注意
                    15030: 'ファントムハンター', // よく使う
                    15033: '黄金の劇団', // よく使う
                    15034: '調停の翼',
                    15035: '在りし日の歌',
                    15036: '諧律を紡ぐ楽章',
                    15038: '未完成なコメディ',
                    // 新規聖遺物セットは公式発表後にIDを確認して追加してください
                };

                const weaponNameMap = {
                    // スクリーンショットに表示されていた武器
                    13424: '死の纏い',
                    11403: '西風剣',
                    15503: '終焉を嘆く詩',
                    14403: '金珀・試作',

                    // よく使われる/表示される武器 (一部、網羅的ではない)
                    // 剣
                    11401: '斬岩・試作', 11402: '暗鉄剣', 11404: '飛天御剣',
                    11405: '片手剣・試作', 11406: '西風剣',
                    11417: '霧切の廻光', 11418: '天目影打', 11419: '匣中龍吟',
                    11420: '斬岩・試作', 11421: '東花坊時雨', 11422: '聖顕の鍵',
                    11423: '盤岩結緑', 11424: '蒼古なる自由の誓い', 11425: '波乱月白経津',
                    11426: 'サイフォスの月明かり', 11427: '萃光の裁葉', 11428: '狼牙',
                    11429: 'サーンドルの渡し守', 11430: '静水流転の輝き', 11431: '有楽御伽',
                    11501: '天空の刃', 11502: '風鷹剣', 11503: '磐岩結緑',
                    11504: '蒼古なる自由の誓い', 11505: '波乱月白経津', 11506: '裁断',
                    11507: '静水流転の輝き',

                    // 両手剣
                    12401: '鉄影段平', 12402: '飛天大御剣', 12403: '大剣・試作',
                    12404: '西風大剣', 12405: '螭龍の剣', 12406: '黒岩の斬刀',
                    12407: '古華・試作', 12408: '桂木斬長正', 12409: '悪王丸',
                    12410: '白影の剣', 12411: '千岩古剣', 12412: '祭礼の大剣',
                    12413: '赤角石塵滅砕', 12414: '葦海の標', 12415: '斬山の刃',
                    12416: '鉄彩の花', 12417: 'タイダル・アックス', 12418: 'ムーンピアサー',
                    12501: '狼の末路', 12502: '天空の傲', 12503: '松韻の響く頃',
                    12504: '赤角石塵滅砕', 12505: '葦海の標', 12506: '斬山の刃',

                    // 弓
                    15401: '旅人の弓', 15402: 'シャープシューターの誓い', 15403: '鴉羽の弓',
                    15404: '西風猟弓', 15405: '弓・試作', 15406: '絶弦',
                    15407: 'アモスの弓', 15408: '若水', 15409: '飛雷の鳴弦',
                    15410: '冬極の白星', 15411: '終焉を嘆く詩', 15412: '狩人の道',
                    15413: '弾弓', 15414: '破魔の弓', 15415: '落霞',
                    15416: '風花の頌歌', 15417: '竭沢', 15418: '烈日の船弓',
                    15419: '王の側近', 15420: '幽夜のワルツ', 15421: '安全距離',
                    15501: '天空の翼', 15502: '飛雷の鳴弦', 15503: '終焉を嘆く詩',
                    15504: '冬極の白星', 15505: '若水', 15506: '狩人の道',

                    // 法器
                    14401: '浮世の錠', 14402: '龍殺しの英傑譚', 14403: '琥珀',
                    14404: '西風秘典', 14405: '法器・試作', 14406: '祭礼の断片',
                    14407: '黒岩の長剣', 14408: '万国諸海の図譜', 14409: '流浪楽章',
                    14410: '白辰の輪', 14411: '昭心', 14412: '白辰の輪', // 重複
                    14413: '彷徨える星', 14414: 'ドドコの物語', 14415: '法器・試作',
                    14416: '彼岸花', 14417: 'トゥライトゥーラのリフレイン', 14418: '純水流華',
                    14419: '金珀・試作', 14420: '琉月', 14421: '果てなき紺碧の唄',
                    14501: '天空の巻', 14502: '四風原典', 14503: '不滅の月華',
                    14504: '神楽の真意', 14505: '千夜に浮かぶ夢', 14506: '碧落の瓏',
                    14507: '静水流転の輝き',

                    // 長柄武器
                    13401: '千岩長槍', 13402: '星鎌・試作', 13403: '西風長槍',
                    13404: '黒纓槍', 13405: '紀行・槍', 13406: '黒岩の長槍',
                    13407: '死の纏い', 13408: '匣中滅龍', 13409: '斬波争乱',
                    13410: '喜多院十文字槍', 13411: '漁獲', 13412: '風信の矛',
                    13413: 'ムーンピアサー', 13414: '満月の針', 13415: '風信の矛',
                    13416: '渓流の竿', 13417: 'グッドフェローズ',
                    13501: '護摩の杖', 13502: '天空の脊', 13503: '和璞鳶',
                    13504: '破天の槍', 13505: '草薙の稲光', 13506: '死の纏い',
                    13507: '赤砂の杖', 13508: '息災', 13509: '聖顕の鍵',
                    13510: '貫虹の槊', // 一部重複IDを修正
                    13511: '厄災',
                    13512: '薙草の稲光',
                    13513: '和璞鳶',


                    // 新規武器は公式発表後にIDを確認して追加してください
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