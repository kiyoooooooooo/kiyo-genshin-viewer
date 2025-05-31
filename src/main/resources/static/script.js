// C:\Users\Public\genweb\src\main\resources\static\script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (既存のコードは省略) ...

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


        // キャラクター詳細グリッド
        htmlContent += `<div class="character-grid">`;
        if (playerData.avatarInfoList && playerData.avatarInfoList.length > 0) {
            playerData.avatarInfoList.forEach(character => {
                const charId = character.avatarId;
                // character.propMap?.[20002]?.val はJSのプロパティアクセスとして不正なため、
                // 通常はtextMapHashなどから名前を解決しますが、characterNameMapを優先します。
                // Enka APIのcharacterオブジェクトに直接nameフィールドがある場合も考慮。
                let charName = characterNameMap[charId] || character.name || '不明なキャラクター';

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

                htmlContent += `
                    <div class="character-card">
                        <img src="${iconUrl}" alt="${charName}アイコン" class="character-icon">
                        <h3 class="character-name">${charName}</h3>
                        <p>Lv: ${charLevel} / 信頼度: ${charFriendship}</p>
                        <p>武器: ${weaponName} (Lv${weaponLevel} 精錬${weaponRefinement})</p>
                        <div class="artifacts">
                            <p>聖遺物セット:</p>
                            ${artifactSetDisplay}
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

    // ... (既存のコードは省略) ...
});