let classrooms = [];


// 讀取 JSON
fetch("./data/classrooms.json")
    .then(response => response.json())
    .then(data => {

        classrooms = data;

        console.log("教室資料載入完成");

    })
    .catch(error => {

        console.error("讀取資料失敗", error);

    });



function searchClassroom() {

    const input =
        document
        .getElementById("searchInput")
        .value
        .trim()
        .toUpperCase();


    const resultBox =
        document.getElementById("result");


    if (input === "") {

        resultBox.innerHTML =
            "⚠️ 請輸入教室名稱";

        return;

    }


    const classroom =
        classrooms.find(item =>
            item.room.toUpperCase() === input
        );


    if (classroom) {
resultBox.innerHTML = `

    <div class="search-success">

        <div class="success-icon">
            📍
        </div>

        <div>

            <h2>
                ${classroom.room}
            </h2>

            <p>
                <span>校區</span>
                ${classroom.campus}
            </p>

            <p>
                <span>大樓</span>
                ${classroom.building}
            </p>

            <p>
                <span>樓層</span>
                ${classroom.floor}
            </p>

        </div>

    </div>
`;

    }

    else {

        resultBox.innerHTML = `
            ❌ 找不到教室：${input}
        `;

    }

}

function openMenu() {

    document
        .getElementById("sideMenu")
        .classList.add("open");


    document
        .getElementById("menuOverlay")
        .classList.add("show");

}


function closeMenu() {

    document
        .getElementById("sideMenu")
        .classList.remove("open");


    document
        .getElementById("menuOverlay")
        .classList.remove("show");

}

const commonPlaces = {

    president: {

        name: "校長室",

        campus: "第一校區",

        building: "行政大樓",

        floor: "2樓",

    },


    academic: {

        name: "教務處",

        campus: "第一校區",

        building: "行政大樓",


    },


    student: {

        name: "學務處",

        campus: "第一校區",

        building: "行政大樓",

        floor: "1樓",


    },


    library: {

        name: "圖書館",

        campus: "第一校區",

        building: "圖書館",

        floor: "1樓",

    },


    information: {

        name: "資訊大樓",

        campus: "第一校區",

        building: "資訊大樓",

        floor: "-",


    },

    management: {

        name: "管理學院",

        campus: "第三校區",

        building: "文理暨管理大樓",

        floor: "6樓(CAM0604)"

    }

};

function showPlace(placeId) {

    const place = commonPlaces[placeId];

    const resultBox =
        document.getElementById("result");


    resultBox.innerHTML = `

        <div class="search-success">

            <div class="success-icon">
                📍
            </div>


            <div>

                <h2>
                    ${place.name}
                </h2>


                <p>
                    <span>校區</span>
                    ${place.campus}
                </p>


                <p>
                    <span>大樓</span>
                    ${place.building}
                </p>


                <p>
                    <span>樓層</span>
                    ${place.floor}
                </p>


            </div>

        </div>
    `;


    /* 選完之後自動關閉選單 */

    closeMenu();


    /* 自動移動到搜尋結果 */

    resultBox.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}

function showSuggestions() {

    const input = document
        .getElementById("searchInput")
        .value
        .trim()
        .toUpperCase();

    const suggestionBox =
        document.getElementById("suggestions");


    // 沒有輸入就不顯示
    if (input === "") {

        suggestionBox.innerHTML = "";

        suggestionBox.style.display = "none";

        return;
    }


    const matches = classrooms.filter(item => {

    return (

        fuzzyMatch(item.room || "", input) ||

        fuzzyMatch(item.building || "", input) ||

        fuzzyMatch(item.name || "", input)

    );

    });


    if (matches.length === 0) {

        suggestionBox.innerHTML = "";

        suggestionBox.style.display = "none";

        return;
    }


    suggestionBox.innerHTML = "";


    // 最多先顯示 6 筆
    matches.slice(0, 6).forEach(item => {

        const option =
            document.createElement("div");

        option.className = "suggestion-item";


        option.innerHTML = `
            <strong>
                ${item.name || item.room}
            </strong>

            <span>
                ${item.building}
            </span>
        `;


        option.onclick = function () {

            selectSuggestion(item);

        };


        suggestionBox.appendChild(option);

    });


    suggestionBox.style.display = "block";

}

function selectSuggestion(item) {

    const searchInput =
        document.getElementById("searchInput");


    searchInput.value =
        item.name || item.room;


    document
        .getElementById("suggestions")
        .style.display = "none";


    showSearchResult(item);

}

function showSearchResult(item) {

    const resultBox =
        document.getElementById("result");


    resultBox.innerHTML = `

        <div class="search-success">

            <div class="success-icon">
                📍
            </div>


            <div>

                <h2>
                    ${item.name || item.room}
                </h2>

                <p>
                    <span>校區</span>
                    ${item.campus}
                </p>

                <p>
                    <span>大樓</span>
                    ${item.building}
                </p>

                <p>
                    <span>樓層</span>
                    ${item.floor}
                </p>

            </div>

        </div>

    `;

}

let mapZoom = 90;


function openMap() {

    document
        .getElementById("mapModal")
        .classList.add("show");

    document.body.style.overflow = "hidden";

}


function closeMap() {

    document
        .getElementById("mapModal")
        .classList.remove("show");

    document.body.style.overflow = "";

}


/* 放大 */

function zoomIn() {

    if (mapZoom < 300) {

        mapZoom += 20;

        updateMapZoom();

    }

}


/* 縮小 */

function zoomOut() {

    if (mapZoom > 40) {

        mapZoom -= 20;

        updateMapZoom();

    }

}


/* 回到原本 */

function resetZoom() {

    mapZoom = 90;

    updateMapZoom();

}


function updateMapZoom() {

    document
        .getElementById("zoomMap")
        .style.width = mapZoom + "%";

}

function fuzzyMatch(text, input) {

    text = text.toUpperCase();
    input = input.toUpperCase();

    let index = 0;

    for (let char of text) {

        if (char === input[index]) {
            index++;
        }

        if (index === input.length) {
            return true;
        }
    }

    return false;
}