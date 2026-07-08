// let count = 0;
// let btn = document.getElementById("inc")

// btn.addEventListener("click", ()=>{
//     count++;
//     document.getElementById("count").textContent = count;
// })

const funcs = [];

for (var i = 0; i < 3; i++) {
    funcs.push(function () {
        console.log(i);
    });
}

funcs[0]();
funcs[1]();
funcs[2]();