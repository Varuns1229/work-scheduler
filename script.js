let addbtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let gridcontainer = document.querySelector(".grid-container");
let deleteicon = document.querySelector(".deleteicon");
let colors = ["#ff264c", "blue", "green", "black"];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let deletebtn = document.querySelector(".delete");
let colordiv = document.querySelectorAll(".filter div");
let filterdiv = document.querySelectorAll(".filter");
let deletemode = false;
let color = undefined;

for (let i = 0; i < colordiv.length; i++) {
  colordiv[i].addEventListener("click", function (e) {
    if (filterdiv[i].classList.contains("delete-selected-bg")) {
      filterdiv[i].classList.remove("delete-selected-bg");
      color = undefined;
      loadui(color);
    } else {
      for (let j = 0; j < filterdiv.length; j++) {
        filterdiv[j].classList.remove("delete-selected-bg");
      }
      filterdiv[i].classList.add("delete-selected-bg");
      color = colordiv[i].classList[0];
      loadui(color);
    }
  });
}

if (localStorage.getItem("alltickets") == undefined) {
  let alltickets = {};
  alltickets = JSON.stringify(alltickets);
  localStorage.setItem("alltickets", alltickets);
}

loadui();

deletebtn.addEventListener("click", function (e) {
  if (
    deleteicon.classList.contains("delete-selected") ||
    e.currentTarget.classList.contains("delete-selected-bg")
  ) {
    deleteicon.classList.remove("delete-selected");
    e.currentTarget.classList.remove("delete-selected-bg");
    deletemode = false;
  } else {
    deleteicon.classList.add("delete-selected");
    e.currentTarget.classList.add("delete-selected-bg");
    deletemode = true;
  }
});

addbtn.addEventListener("click", function () {
  for (let j = 0; j < filterdiv.length; j++) {
    filterdiv[j].classList.remove("delete-selected-bg");
  }
  color = undefined;
  loadui(color);
  deleteicon.classList.remove("delete-selected");
  deletebtn.classList.remove("delete-selected-bg");
  deletemode = false;

  let premodal = document.querySelector(".modal");
  if (premodal != null) return;

  let div = document.createElement("div");
  div.classList.add("modal");
  div.innerHTML = `
    <div class="task">
        <div class="task-inner" contenteditable="true"></div>
    </div>
    <div class="prioty">
        <div class="prioty-inner">
            <div class="box pink"></div>
            <div class="box blue"></div>
            <div class="box green"></div>
            <div class="box black selected"></div>
        </div>
    </div>
 `;

  let ticketcolor = "black";

  let allbox = div.querySelectorAll(".box");

  for (let i = 0; i < allbox.length; i++) {
    allbox[i].addEventListener("click", function (e) {
      for (let j = 0; j < allbox.length; j++) {
        allbox[j].classList.remove("selected");
      }
      allbox[i].classList.add("selected");
      ticketcolor = e.currentTarget.classList[1];
      // console.log(ticketcolor);
    });
  }

  let task = div.querySelector(".task-inner");
  task.addEventListener("keydown", function (e) {
    //    console.log(e.key)
    if (e.key == "Enter") {
      let d = new Date();
      let day = days[d.getDay()];
      let month =
        d.getMonth() + 1 < 10 ? "0" + d.getMonth() + 1 : d.getMonth() + 1;
      let year = d.getFullYear();
      let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let id = new ShortUniqueId().randomUUID();
      let task = e.currentTarget.innerText;
      let alltickets = JSON.parse(localStorage.getItem("alltickets"));
      let ticketobj = {
        color: ticketcolor,
        taskvalue: task,
        day: day,
        month: month,
        year: year,
        date: date,
        hour: hour,
        min: min,
      };

      alltickets[id] = ticketobj;
      localStorage.setItem("alltickets", JSON.stringify(alltickets)); //localstorage

      let ticketdiv = document.createElement("div");

      //    console.log(date);
      ticketdiv.setAttribute("id", id);
      ticketdiv.classList.add("ticket");
      ticketdiv.innerHTML = `
           <div class="ticket-color ${ticketcolor}" id="${id}"></div>
           <div class="ticket-date">
           <div class="date">
               <div class="time">
                   <p>${hour}:${min}</p>
               </div>
               <div class="year">
                   <p>${date}/${month}/${year}</p>
               </div>
           </div>
           <div class="day">
               <p>${day}</p>
           </div>
           </div>
           <div class="ticket-task" contenteditable="true" id="${id}">
           ${task}
           </div>
           <div class="ticket-id">#${id}</div>
       `;

      let tickettask = ticketdiv.querySelector(".ticket-task");
      tickettask.addEventListener("input", function (e) {
        let id = tickettask.getAttribute("id");
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        // console.log(e.currentTarget.innerText)
        alltickets[id].taskvalue = e.currentTarget.innerText;
        localStorage.setItem("alltickets", JSON.stringify(alltickets));
      });

      ticketdiv.addEventListener("click", function (e) {
        let id = e.currentTarget.getAttribute("id");
        if (deletemode) {
          let alltickets = JSON.parse(localStorage.getItem("alltickets"));
          delete alltickets[id];
          localStorage.setItem("alltickets", JSON.stringify(alltickets));

          e.currentTarget.remove();
        }
      });

      let ticketcolordiv = ticketdiv.querySelector(".ticket-color");
      ticketcolordiv.addEventListener("click", function (e) {
        let id = ticketcolordiv.getAttribute("id");
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        // console.log(id);

        let currcolor = e.currentTarget.classList[1];
        let index = -1;
        for (let i = 0; i < colors.length; i++) {
          if (currcolor == colors[i]) {
            index = i;
          }
        }

        index++;
        index = index % 4;
        let newcolor = colors[index];
        // console.log(alltickets);
        alltickets[id].color = newcolor;
        localStorage.setItem("alltickets", JSON.stringify(alltickets));
        ticketcolordiv.classList.remove(currcolor);
        ticketcolordiv.classList.add(newcolor);
      });

      gridcontainer.append(ticketdiv);
      div.remove();
    } else if (e.key == "Escape") {
      div.remove();
    }
  });

  body.append(div);
});

function loadui(color) {
  //delete already print ticket
  let ticketonui = document.querySelectorAll(".ticket");
  for (let i = 0; i < ticketonui.length; i++) {
    ticketonui[i].remove();
  }

  let alltickets = JSON.parse(localStorage.getItem("alltickets"));

  for (x in alltickets) {
    let currid = x;
    let obj = alltickets[x];

    if (color && color != obj.color) continue;

    let ticketdiv = document.createElement("div");

    // let ticketdiv = document.createElement("div");
    ticketdiv.setAttribute("id", currid);
    ticketdiv.classList.add("ticket");
    ticketdiv.innerHTML = `
        <div class="ticket-color ${obj.color}" id="${currid}"></div>
           <div class="ticket-date">
           <div class="date">
               <div class="time">
                   <p>${obj.hour}:${obj.min}</p>
               </div>
               <div class="year">
                   <p>${obj.date}/${obj.month}/${obj.year}</p>
               </div>
           </div>
           <div class="day">
               <p>${obj.day}</p>
           </div>
           </div>
           <div class="ticket-task" contenteditable="true" id="${currid}">
           ${obj.taskvalue}
           </div>
           <div class="ticket-id">#${currid}</div>
        `;

    let tickettask = ticketdiv.querySelector(".ticket-task");
    let ticketcolordiv = ticketdiv.querySelector(".ticket-color");

    tickettask.addEventListener("input", function (e) {
      let id = tickettask.getAttribute("id");
      let alltickets = JSON.parse(localStorage.getItem("alltickets"));
      // console.log(e.currentTarget.innerText)
      alltickets[id].taskvalue = e.currentTarget.innerText;
      localStorage.setItem("alltickets", JSON.stringify(alltickets));
    });

    ticketcolordiv.addEventListener("click", function (e) {
      let id = ticketcolordiv.getAttribute("id");
      let alltickets = JSON.parse(localStorage.getItem("alltickets"));
      // console.log(id);

      let currcolor = e.currentTarget.classList[1];
      let index = -1;
      for (let i = 0; i < colors.length; i++) {
        if (currcolor == colors[i]) {
          index = i;
        }
      }

      index++;
      index = index % 4;
      let newcolor = colors[index];
      // console.log(alltickets);
      alltickets[id].color = newcolor;
      localStorage.setItem("alltickets", JSON.stringify(alltickets));
      ticketcolordiv.classList.remove(currcolor);
      ticketcolordiv.classList.add(newcolor);
    });

    ticketdiv.addEventListener("click", function (e) {
      let id = e.currentTarget.getAttribute("id");
      if (deletemode) {
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        delete alltickets[id];
        localStorage.setItem("alltickets", JSON.stringify(alltickets));

        e.currentTarget.remove();
      }
    });
    gridcontainer.append(ticketdiv);
  }
}

// update value function
// function updatevalue(e){
//     let id = tickettask.getAttribute("id");
//     let alltickets = JSON.parse(localStorage.getItem("alltickets"));
//     // console.log(e.currentTarget.innerText)
//     alltickets[id].taskvalue = e.currentTarget.innerText;
//     localStorage.setItem("alltickets",JSON.stringify(alltickets));

//    }

// delete
//    function deleteticket(e){
//     let id = e.currentTarget.getAttribute("id");
//     if(deletemode){
//      let alltickets = JSON.parse(localStorage.getItem("alltickets"));
//      delete alltickets[id];
//      localStorage.setItem("alltickets",JSON.stringify(alltickets));

//         e.currentTarget.remove();
//     }
// }

//update color
// function updatecolor(e){
//     let id = ticketcolordiv.getAttribute("id");
//     let alltickets = JSON.parse(localStorage.getItem("alltickets"));
//  // console.log(id);

//  let currcolor = e.currentTarget.classList[1];
//  let index = -1;
//  for(let i=0;i<colors.length;i++){
//      if(currcolor==colors[i]){
//          index = i;
//      }
//  }

//  index++;
//  index = index%4;
//  let newcolor = colors[index];
//  // console.log(alltickets);
//  alltickets[id].color = newcolor;
//     localStorage.setItem("alltickets",JSON.stringify(alltickets));
//     ticketcolordiv.classList.remove(currcolor);
//     ticketcolordiv.classList.add(newcolor);
// };
