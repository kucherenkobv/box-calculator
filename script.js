const boxes = [

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

function findBox() {

    let userSizes = [
        Number(document.getElementById("length").value),
        Number(document.getElementById("width").value),
        Number(document.getElementById("height").value)
    ];

    userSizes = userSizes.filter(size => size > 0);

    const result = document.getElementById("result");

    if (userSizes.length === 0) {
        result.innerHTML = "Введіть хоча б один розмір";
        return;
    }

    userSizes.sort((a, b) => b - a);

    let foundBox = null;
    let selectedHeight = null;
    let isCut = false;

    for (const box of boxes) {

        const allHeights = [...box.cut, box.height]
            .sort((a, b) => a - b);

        for (const h of allHeights) {

            const boxSizes = [box.length, box.width, h]
                .sort((a, b) => b - a);

            let fits = true;

            for (let i = 0; i < userSizes.length; i++) {
                if (userSizes[i] > boxSizes[i]) {
                    fits = false;
                    break;
                }
            }

            if (fits) {
                foundBox = box;
                selectedHeight = h;
                isCut = h !== box.height;
                break;
            }
        }

        if (foundBox) break;
    }

    if (foundBox) {

        let cutText = "";

        if (isCut) {
            cutText = `<br>Підрізка: до ${selectedHeight} см`;
        }

        result.innerHTML = `
            <div style="font-weight: bold;">
                [${foundBox.code}] ${foundBox.name}
            </div>

            <div style="margin-top: 8px;">
                Розміри: ${foundBox.length} × ${foundBox.width} × ${foundBox.height} см
                ${cutText}
            </div>
        `;

    } else {

        result.innerHTML = `
            Підходящу коробку не знайдено
        `;
    }
}
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            findBox();
        }
    });
});