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
            localStorage.removeItem('lastSearchedUid');
            localStorage.removeItem('lastSearchedData');
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
                } else {
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
            const displayUid = currentSearchedUid || '不明'; // 検索したUIDを使う
            
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
                const characterNameMap = {
                    10000046: '胡桃',
                    10000025: 'エウルア',
                    10000021: 'リサ',
                    10000107: 'フレミネ',
                    10000098: '放浪者',
                    10000031: 'ジン',
                    10000103: 'ヌヴィレット',
                    10000005: '旅人(風)', // 旅人は属性によってIDが変わる
                    10000112: 'フリーナ',
                    10000041: 'ベネット',
                    10000089: 'ニィロウ',
                    10000037: '雷電将軍', // 例を追加
                    10000062: '夜蘭', // 例を追加
                    10000072: 'ナヒーダ', // 例を追加
                    10000080: '神里綾華', // 例を追加
                    // 必要に応じて他のキャラクターIDと名前を追加
                };
                const artifactSetNameMap = {
                    15006: '燃え盛る炎の魔女',
                    15031: '剣闘士のフィナーレ', // 聖遺物セットIDから名称取得
                    15020: '蒼白の炎',
                    15032: '水仙の夢',
                    10007: '狂戦士',
                    15037: '黄金の夢',
                    15035: '砂上の楼閣の史話',
                    15001: '亡命者',
                    15014: '氷風を彷徨う勇士',
                    15015: '悠久の磐岩',
                    15018: '千岩牢固',
                    15027: '来歆の余響',
                    15028: '深林の記憶',
                    15029: '金メッキの夢',
                    15030: '森の記憶', // 同一セットだが異なるIDで存在することもある
                    // 必要に応じて他の聖遺物セットIDと名前を追加
                };
                const weaponNameMap = {
                    13424: '死の纏い', // 武器IDと名称
                    11403: '西風剣',
                    15503: '終焉を嘆く詩',
                    14403: '金珀・試作',
                    11425: '斬岩・試作',
                    15402: '祭礼の弓',
                    13501: '護摩の杖',
                    12501: '終末嗟嘆歌',
                    13410: '和璞鳶',
                    14415: '白辰の輪',
                    11417: '霧切の廻光',
                    // 必要に応じて他の武器IDと名前を追加
                };


                data.avatarInfoList.forEach(char => {
                    const characterId = char.avatarId;
                    const characterName = characterNameMap[characterId] || `キャラクターID:${characterId}`;
                    const characterImageSrc = `https://enka.network/ui/UI_AvatarIcon_${characterId}.png`;
                    
                    const charLevel = char.propMap && char.propMap['4001'] ? char.propMap['4001'].val : '不明';
                    
                    // 天賦レベルの抽出
                    let talentLevels = [];
                    if (char.skillLevelMap) {
                        // 固有天賦によるレベル上昇を考慮
                        const proudSkillExtraLevelMap = char.proudSkillExtraLevelMap || {};
                        
                        // 戦闘天賦（通常攻撃、元素スキル、元素爆発）のスキルDepotIdはキャラクターごとに決まっている
                        // Enka.Networkのデータから直接戦闘天賦のIDを特定するのは難しい場合があるので、
                        // ここではskillLevelMapの全ての値を表示する簡易的な方法を取ります。
                        // より正確には、キャラクターごとの天賦IDのマッピングが必要になります。
                        Object.keys(char.skillLevelMap).forEach(skillId => {
                            let level = char.skillLevelMap[skillId];
                            // 固有天賦による追加レベルがあれば加算
                            if (proudSkillExtraLevelMap[skillId]) {
                                level += proudSkillExtraLevelMap[skillId];
                            }
                            talentLevels.push(level);
                        });
                        // ソートして見やすくする（例: 8/10/5 ではなく 5/8/10）
                        talentLevels.sort((a, b) => a - b);
                    }
                    const skillLevelsDisplay = talentLevels.length > 0 ? talentLevels.join('/') : '情報なし';

                    // 命の星座の表示 (talentIdListは固有天賦のアンロックを示すため、命の星座の数とは異なる)
                    // Enka.Networkの最新のデータ構造では constellationNum が提供される場合がある
                    const constellation = char.constellationNum !== undefined ? char.constellationNum : 
                                            (char.fetterInfo && char.fetterInfo.talentLevelMap && char.fetterInfo.talentLevelMap['10000000']) ? Object.keys(char.fetterInfo.talentLevelMap).length : '不明'; // 暫定
                    // talentIdListは固有天賦のアンロック状況を示すので、命の星座の数とは別物です。
                    // 命の星座の正確な数は、Enka.NetworkのAPIのキャラクター詳細データ（avatarInfoListの各charオブジェクト内）
                    // に `constellationNum` のようなプロパティがあるか、または
                    // `talentIdList` が命の星座の各段階に対応する特別なIDを含む場合にのみ利用可能です。
                    // 現状では、`constellationNum` が最も確実ですが、古いAPIレスポンスにはないかもしれません。
                    // ここでは一旦、`constellationNum` がない場合は「不明」としています。

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
                        artifactsDisplay = artifactEquips.map(art => {
                            const setNameId = art.flat.setId;
                            const setName = artifactSetNameMap[setNameId] || `聖遺物ID:${setNameId}`;
                            return `<span class="artifact-name">${setName}</span>`;
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
    const lastSearchedUid = localStorage.getItem('lastSearchedUid');
    const lastSearchedData = localStorage.getItem('lastSearchedData');

    if (lastSearchedUid && lastSearchedData) {
        uidInput.value = lastSearchedUid;
        try {
            const parsedData = JSON.parse(lastSearchedData);
            displayCharacterData(parsedData);
            currentSearchedUid = lastSearchedUid;

            let savedUids = getSavedUids();
            if (!savedUids.includes(lastSearchedUid)) {
                savedUids.push(lastSearchedUid);
                localStorage.setItem('savedGenshinUids', JSON.stringify(savedUids));
            }
            tabButtons[0].click();
        } catch (e) {
            console.error("Failed to parse last searched data from localStorage", e);
            localStorage.removeItem('lastSearchedData');
            localStorage.removeItem('lastSearchedUid');
            tabButtons[0].click(); // パース失敗時はデフォルトで最初のタブを表示
        }
    } else {
        tabButtons[0].click();
    }
});