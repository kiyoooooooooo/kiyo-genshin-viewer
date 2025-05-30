document.addEventListener('DOMContentLoaded', () => {
    // ... (既存の変数宣言とタブ切り替え、UID検索、保存UIDクリア機能は変更なし) ...

    // --- キャラクターデータ取得と表示 ---
    async function fetchCharacterData(uid) {
        showLoading();
        hideError();
        characterInfoDisplayArea.classList.add('hidden');

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

                tabButtons[0].click();
            } else {
                const errorText = await response.text();
                showError(`エラーが発生しました: ${errorText}`);
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
            // UIDは `data` のトップレベルに直接は存在しないため、playerInfoから取得
            // Enka.Network APIの出力では `uid` はトップレベルではなく、リクエスト時に与えられたもの
            // または、playerInfo.uid があればそれを使う
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
                // Enka.NetworkのIDと名称のマッピングデータは別途用意する必要がある
                // ここでは仮の名前をIDから生成するか、よく知られた名前をハードコード
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
                    // 必要に応じて他の聖遺物セットIDと名前を追加
                };
                const weaponNameMap = {
                    13424: '死の纏い', // 武器IDと名称
                    11403: '西風剣',
                    15503: '終焉を嘆く詩',
                    14403: '金珀・試作',
                    11425: '斬岩・試作',
                    15402: '祭礼の弓',
                    // 必要に応じて他の武器IDと名前を追加
                };


                data.avatarInfoList.forEach(char => {
                    const characterId = char.avatarId;
                    const characterName = characterNameMap[characterId] || `キャラクターID:${characterId}`;
                    // Enka.NetworkのUIアイコンのパス規則
                    const characterImageSrc = `https://enka.network/ui/UI_AvatarIcon_${characterId}.png`; // 例: UI_AvatarIcon_10000046.png
                    
                    // キャラクターレベル
                    const charLevel = char.propMap && char.propMap['4001'] ? char.propMap['4001'].val : '不明';
                    
                    // 天賦レベルの抽出（skillLevelMapはオブジェクトなので変換が必要）
                    let talentLevels = [];
                    if (char.skillLevelMap) {
                        // skillLevelMapの値を配列にしてソートするか、特定のスキルIDのみ取得する
                        // 例: { "10461": 8, "10462": 10, "10463": 5 } -> [8, 10, 5]
                        Object.values(char.skillLevelMap).forEach(level => talentLevels.push(level));
                        // 固有天賦のレベル補正も考慮するならproudSkillExtraLevelMapも参照
                        if (char.proudSkillExtraLevelMap) {
                            Object.keys(char.proudSkillExtraLevelMap).forEach(skillId => {
                                // どの天賦に対応するかの情報が別途必要になるため、ここでは単純化
                                // console.log(`Extra level for skill ${skillId}: ${char.proudSkillExtraLevelMap[skillId]}`);
                            });
                        }
                    }
                    const skillLevelsDisplay = talentLevels.length > 0 ? talentLevels.join('/') : '情報なし';

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
                            // flat.setNameTextMapHash はセットIDのハッシュ値なので、直接聖遺物名ではない
                            const setNameId = art.flat.setId;
                            const setName = artifactSetNameMap[setNameId] || `聖遺物ID:${setNameId}`;
                            // flat.nameTextMapHash は個々の聖遺物の名称だが、今回はセット名を優先
                            // return `<span class="artifact-name">${art.flat.nameTextMapHash || '不明'}</span>`; // 個別名
                            return `<span class="artifact-name">${setName}</span>`; // セット名
                        }).join('<br>');
                    }


                    html += `
                        <div class="character-card">
                            <img src="${characterImageSrc}" alt="${characterName}" class="character-icon">
                            <p class="character-name">${characterName}</p>
                            <p>Lv.${charLevel} C${char.talentIdList ? char.talentIdList.length : '不明'}</p> <p>天賦: ${skillLevelsDisplay}</p>
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

    // ... (既存のshowLoading, hideLoading, showError, hideError, getSavedUids, saveUid, removeUid, loadSavedUids関数は変更なし) ...

    // --- 初期化処理 ---
    const lastSearchedUid = localStorage.getItem('lastSearchedUid');
    const lastSearchedData = localStorage.getItem('lastSearchedData');

    if (lastSearchedUid && lastSearchedData) {
        uidInput.value = lastSearchedUid;
        displayCharacterData(JSON.parse(lastSearchedData));
        currentSearchedUid = lastSearchedUid;

        let savedUids = getSavedUids();
        if (!savedUids.includes(lastSearchedUid)) {
            savedUids.push(lastSearchedUid);
            localStorage.setItem('savedGenshinUids', JSON.stringify(savedUids));
        }
        tabButtons[0].click();
    } else {
        tabButtons[0].click();
    }
});