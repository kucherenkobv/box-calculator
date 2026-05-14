const HEIGHT_TOLERANCE = 2; // допуск по высоте

const boxes = [
    {
        name: "0.5 КГ ПРЯМОКУТНА",
        code: 0.5,
        length: 17,
        width: 12,
        height: 9
    },
    {
        name: "1 КГ ПРЯМОКУТНА",
        code: 1,
        length: 24,
        width: 17,
        height: 9
    },
    {
        name: "2 КГ ПРЯМОКУТНА",
        code: 2,
        length: 34,
        width: 24,
        height: 9
    },
    {
        name: "5 КГ ПРЯМОКУТНА",
        code: 5,
        length: 40,
        width: 24,
        height: 20,
        cut: [13, 8]
    },
    {
        name: "10 КГ КВАДРАТНА",
        code: 10,
        length: 40,
        width: 34,
        height: 28.5,
        cut: [20, 14, 8.5]
    },
    {
        name: "15 КГ ПРЯМОКУТНА",
        code: 15,
        length: 60,
        width: 35,
        height: 28.5,
        cut: [19, 13, 9]
    },
    {
        name: "20 КГ КВАДРАТНА",
        code: 20,
        length: 47,
        width: 40,
        height: 42,
        cut: [31, 21, 10]
    },
    {
        name: "30 КГ ПРЯМОКУТНА",
        code: 30,
        length: 70,
        width: 40,
        height: 42,
        cut: [28, 14]
    },
    {
        name: "30 КГ КВАДРАТНА",
        code: 31,
        length: 50,
        width: 50,
        height: 48,
        cut: [32, 16]
    },
    {
        name: "30 КГ ДОВГА",
        code: 32,
        length: 100,
        width: 40,
        height: 30,
        cut: [20, 10]
    }
];

function fits(userSizes, boxSizes) {
    for (let i = 0; i < userSizes.length; i++) {
        if (userSizes[i] > boxSizes[i]) return false;
    }
    return true;
}



function findBox() {

    let userSizes = [
        Number(document.getElementById("length").value),
        Number(document.getElementById("width").value),
        Number(document.getElementById("height").value)
    ];

    userSizes = userSizes.filter(size => size > 0);

    const result = document.getElementById("result");

    if (userSizes.length === 0) {
        result.innerHTML = "Введіть хоча б один НЕ нульовий розмір";
        return;
    }

    userSizes.sort((a, b) => b - a);

    let foundBox = null;
    let altBox = null;

    let selectedHeight = null;
    let altSelectedHeight = null;

    let isCut = false;
    let isHeightExceeded = false;

    let bestAltVolume = Infinity;

    for (const box of boxes) {

        const allHeights = [...(box.cut || []), box.height]
            .sort((a, b) => a - b);

        for (const h of allHeights) {

            const boxSizes = [box.length, box.width, h]
                .sort((a, b) => b - a);

            const lengthOk = userSizes[0] <= boxSizes[0];
            const widthOk = userSizes[1] <= boxSizes[1];

            const heightOk = userSizes[2] <= boxSizes[2] + HEIGHT_TOLERANCE;
            const heightOkStrict = userSizes[2] <= boxSizes[2];

            // ✅ Альтернатива: строгое вмещение
            if (lengthOk && widthOk && heightOkStrict) {

                const volume = boxSizes[0] * boxSizes[1] * boxSizes[2];

                if (volume < bestAltVolume) {
                    altBox = box;
                    altSelectedHeight = h;
                    bestAltVolume = volume;
                }
            }

            // ✅ Основной вариант (с допуском)
            if (!foundBox && lengthOk && widthOk && heightOk) {
                foundBox = box;
                selectedHeight = h;
                isCut = h !== box.height;
                isHeightExceeded = userSizes[2] > boxSizes[2];
            }
        }
    }

    if (foundBox) {

        let cutText = "";
        let exceedText = "";
        let altText = "";

        if (isCut) {
            cutText = `
                <br>
                <span style="color: #1565c0; font-weight: bold;">
                    ✂ Підрізка: до ${selectedHeight} см
                </span>
            `;
        }

        if (isHeightExceeded && !isCut) {
            exceedText = `
                <br>
                <span style="color: red; ">
                    Висота перевищена (допуск +${HEIGHT_TOLERANCE} см)
                </span>
            `;
        }

        // 🔥 ВАЖНО: показываем альтернативу ВСЕГДА, если она есть
        
        if (
            isHeightExceeded &&
            !isCut &&
            altBox &&
            altBox.code !== foundBox.code
        ) {    
            altText = `
                <hr>
                <div style="color: #2e7d32; font-weight: bold;">
                    Альтернатива без допуску:
                </div>
                <div>
                    [${altBox.code}] ${altBox.name}<br>
                    Розміри: ${altBox.length} × ${altBox.width} × ${altBox.height} см
                    ${altSelectedHeight !== altBox.height ? `<br><span style="color: #1565c0; font-weight: bold;">✂ Підрізка: до ${altSelectedHeight} см</span>` : ""}
                </div>
            `;
        }

        result.innerHTML = `
            <div style="font-weight: bold;">
                [${foundBox.code}] ${foundBox.name}
            </div>

            <div style="margin-top: 8px;">
                Розміри коробки: ${foundBox.length} × ${foundBox.width} × ${foundBox.height} см
                ${cutText}
                ${exceedText}
                ${altText}
            </div>
        `;

    } else {
        result.innerHTML = `Підходящу коробку не знайдено`;
    }
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            findBox();
        }
    });
});
