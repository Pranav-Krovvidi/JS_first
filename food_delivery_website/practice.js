// let count = 0;
// let btn = document.getElementById("inc")

// btn.addEventListener("click", ()=>{
//     count++;
//     document.getElementById("count").textContent = count;
// })

const nums = [1,2,3,4,5]
console.log(nums.reduce((accumulator,curr)=>{
    return accumulator+curr
},0));
