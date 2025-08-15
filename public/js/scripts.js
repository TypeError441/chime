import { set, get } from "/js/idb-helper.js";

// Register sw
fetch(`/manifest.json`).then(response => response.json())
.then(data => {
    $(".version").text(`version ` + data.ver);
    navigator.serviceWorker.register(`/sw.js?version=${data.ver}`);
    console.log("%cRegistered %csw.js.",
        "color: blue;",
        "color: black;"
    );
});

// Date variables
let now = new Date();
let currentDay = now.getDay();
let currentMonth = now.getMonth();
let currentDate = now.getDate();

// Schedule variables
let scheduleName;
let schedule;

let period;

let overrides;
let schedules;
let periods;
let calendar;

let sidebarOpened = false;

// Load settings and school data
console.log("%cLoading %csettings and school data.",
    "color: blue;",
    "color: black;"
);

// If there is no school, set it to egan by default
if (await get("settings", "school") === undefined) await set("settings", "school", "egan");
console.log(`Got %cschool %cas %c${await get("settings", "school")}.`,
    "color: blue;",
    "color: black;",
    "color: green;"
);

// Get school data
fetch(`/schools/${await get("settings", "school")}.json`).then(response => response.json())
.then(async (data) => {
    periods = data.periods;

    if (await get("settings", "theme") === undefined) await set("settings", "theme", "default-light");
    if (await get("settings", "font") === undefined) await set("settings", "font", "'Inter', sans-serif");
    let p = [];
    for (let i = 0; i < periods; i++) {
        p.push(`Period ${i + 1}`);
    }
    if (await get("settings", "periods") === undefined) await set("settings", "periods", p);
    setTheme(await get("settings", "theme"));
    setFont(await get("settings", "font"));

    schedules = data.schedules;
    calendar = data.calendar;
    
    scheduleName = calendar[currentDay]

    overrides = data.overrides;

    if (overrides[`${currentMonth + 1}-${currentDate}`]) scheduleName = overrides[`${currentMonth + 1}-${currentDate}`];
    schedule = schedules[scheduleName];

    loadAvailableSchedulesToDropdown();
    $(".select-schedule").val(scheduleName);
    updatePeriodCountInSettings(periods);
    
    tick();
});

// JQuery events
$(".right-sidebar-toggle,.mobile.right-sidebar-exit").click(function() {
    console.log("%cToggled %csidebar.",
        "color: blue;",
        "color: black;"
    );

    sidebarOpened = !sidebarOpened;
    if (sidebarOpened) displaySchedule(schedule);

    $(".radial-timer").toggleClass("toggle-effect");
    $(".time-container").toggleClass("toggle-effect");
    $(".right-sidebar").toggleClass("toggle-effect");
    $(".right-sidebar-toggle").toggleClass("toggle-effect");
    $(".settings").toggleClass("toggle-effect");
    $(".mobile.settings-mobile").toggleClass("toggle-effect");
    $(".time").toggleClass("toggle-effect");
    $(".period").toggleClass("toggle-effect");
    $(".schedule").toggleClass("toggle-effect");
});

$(".settings,.mobile.settings-mobile").click(async function() {
    console.log("%cOpened %csettings.",
        "color: blue;",
        "color: black;"
    );

    $(".container").toggleClass("toggle-effect");
    $(".settings-container").toggleClass("toggle-effect");

    let theme = await get("settings", "theme");
    $(".select-theme").val(theme);
    $("html").attr("data-theme", theme);
    $(".select-font").val(await get("settings", "font"));

    let periods = await get("settings", "periods");
    for (let i = 0; i < periods.length; i++) {
        $(".input-period#input-period-" + (i + 1)).val(periods[i] || "Period " + (i + 1));
    }
});

$(".close-settings").click(async function() {
    console.log("%cClosed %csettings.",
        "color: blue;",
        "color: black;"
    );
    $(".container").toggleClass("toggle-effect");
    $(".settings-container").toggleClass("toggle-effect");

    setTheme($(".select-theme").val());
    setFont($(".select-font").val());

    let periods = await get("settings", "periods");
    let periodNames = [];
    for (let i = 0; i < periods.length; i++) {
        periodNames.push($(".input-period#input-period-" + (i + 1)).val())
    }
    setPeriodNames(periodNames);

    runLogic();

    displaySchedule(schedule);
});

$(".select-schedule").change(function() {
    changeSchedule($(this).val());
});

async function runLogic() {
    if (sidebarOpened && isMobile()) {
        console.log("Stopped %clogic %cdue to being on %cmobile.",
            "color: blue;",
            "color: black;",
            "color: green;"
        );
        return;
    }

    let time = getTime(schedule);
    let parsedTime = parseTime(time);

    let period = getPeriod(schedule);
    let parsedPeriod = await parsePeriod(period);

    let today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    let favicon = getFaviconColor(parsedTime[1]);

    let percent = parsedTime[2];

    if (!$(".container").hasClass("toggle-effect")) updateUI(parsedTime[0], parsedPeriod, scheduleName, today, percent); // Run if not in settings
    updatePage(parsedTime[0], parsedPeriod, scheduleName, favicon)
}

function tick() {
    runLogic();

    setTimeout(tick, 1000);
}

function changeSchedule(n) {
    scheduleName = n;
    schedule = schedules[scheduleName];

    console.log(`Chose %c${scheduleName} %cas %cschedule.`,
        "color: blue;",
        "color: black;",
        "color: green;"
    );

    runLogic();

    displaySchedule(schedule);
}

// Logic functions
async function setTheme(theme) {
    $("html").attr("data-theme", theme);
    await set("settings", "theme", theme);
}

async function setFont(font) {
    $(".time, .period, .schedule, .date").css("font-family", font);
    // schedule-item handled in displaySchedule()
    await set("settings", "font", font);
}

async function setPeriodNames(p) {
    let periods = p;
    periods = periods.map(period => period.trim());

    for (let i = 0; i < periods.length; i++) { if (periods[i] === "") periods[i] = `Period ${i + 1}`; }

    await set("settings", "periods", periods);

}

function loadAvailableSchedulesToDropdown() {
    let keys = Object.keys(schedules);
    for (let i = 0; i < keys.length; i++) {
        if (schedules[keys[i]].special) { $(".select-schedule").append(`<option value="${keys[i]}" hidden>${keys[i]}</option>`) }
        else { $(".select-schedule").append(`<option value="${keys[i]}">${keys[i]}</option>`) }
    }
    
    console.log("%cLoaded %cavailable schedules to dropdown.",
        "color: blue;",
        "color: black;"
    );
}

function updatePeriodCountInSettings(periods) {
    for (let i = 0; i < periods; i++) {
        $(".settings-column.periods > .settings-item").append(`
            <label class="label-input-periods" for="input-period-${i + 1}">Period ${i + 1}</label>
            <input maxlength="16" type="text" id="input-period-${i + 1}" class="input-period" value="Period ${i + 1}" placeholder="Period ${i + 1}">
        `);
    }

    console.log("%cUpdated %cperiod count in settings.",
        "color: blue;",
        "color: black;"
    );
}

async function displaySchedule(schedule) {
    $(".schedule-list").empty();

    let periods = await get("settings", "periods");
    for (const period of schedule.periods) {
        let start = period.start;
        let end = period.end;
        let subject = period.subject;
        if (subject.startsWith("Period")) subject = periods[subject.split(" ")[1] - 1];

        let isCurrentPeriod = getPeriod(schedule) === period;

        let item = `<tr style="font-family: ${await get("settings", "font")};" class="schedule-item ${isCurrentPeriod ? 'current' : ''}${new Date().toTimeString().slice(0, 5) > end ? 'finished' : ''}">
            <td class="schedule-item-time">${start} - ${end}</td>
            <td class="schedule-item-name">${subject}</td>
        </tr>`;

        $(".schedule-list").append(item);
    };

    console.log("%cDisplayed %cschedule in sidebar.",
        "color: blue;",
        "color: black;"
    );
}

function getTime(schedule) {
    let period = getPeriod(schedule);
    if (period === null) return null;

    let now = new Date();
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.end.split(":")[0], period.end.split(":")[1], 0);
    let timeRemaining = end - now;
    let h = Math.floor(timeRemaining / (1000 * 60 * 60));
    let m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    let pStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.start.split(":")[0], period.start.split(":")[1], 0);
    let pEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.end.split(":")[0], period.end.split(":")[1], 0);
    let d = pEnd - pStart; // Total time of period in milliseconds
    let t = pEnd - now; // Total time left in the period in milliseconds
    let p = t / d;

    return [h, m, s, t, p];
}

function parseTime(time) {
    if (time === null) return ["Free", null]; // Schedule is finished, return null for favicon
    let s = "";
    if (time[0] > 0) s += `${time[0].toString()}:`;
    s += `${time[1].toString().padStart(2, '0')}:${time[2].toString().padStart(2, '0')}`;

    return [s, time[3], time[4]];
}

function getPeriod(s) {
    let now = new Date();
    let currentTime = now.toTimeString().slice(0, 5);
    let currentPeriod = s.periods.find(period => {
        return currentTime >= period.start && currentTime < period.end;
    });
    
    if (!currentPeriod) {
        let nextPeriod = s.periods.find(period => period.start > currentTime);
        if (!nextPeriod) return null; // Schedule has ended for the day
        let previousPeriod = s.periods[s.periods.indexOf(nextPeriod) - 1];

        let passingPeriod = {
            start: previousPeriod.end,
            end: nextPeriod.start,
            subject: "Passing to " + nextPeriod.subject
        };
        if (JSON.stringify(period) != JSON.stringify(passingPeriod) && sidebarOpened) {
            displaySchedule(s);
        }
        period = passingPeriod;
        return passingPeriod;
    }
    if (JSON.stringify(period) != JSON.stringify(currentPeriod) && sidebarOpened) {
        displaySchedule(s);
    }
    period = currentPeriod;
    return currentPeriod;
}

async function parsePeriod(period) {
    if (period === null) return "School is over";

    let periodName = period ? period.subject : "Free";

    let periodNames = await get("settings", "periods");
    
    if (periodName.split(" ")[0] === "Period" && !isNaN(periodName.split(" ")[1])) {
        periodName = periodNames[parseInt(periodName.split(" ")[1]) - 1];
    }

    return periodName;
}

function getFaviconColor(ms) {
    if (ms === null) return "gray";
    else if (ms >= 15 * 60 * 1000) return "green";
    else if (ms >= 5 * 60 * 1000) return "yellow";
    else if (ms >= 2 * 60 * 1000) return "orange";
    else return "red";
}

function updateUI(time, period, schedule, today, percent) {
    $(".time").text(time);
    $(".period").text(period);
    $(".schedule").text(schedule);
    $(".date").text(today);

    drawRadialTimer(percent * 100);
}

function updatePage(time, period, schedule, favicon) {
    if (!isMobile()) document.title = `${time} | ${period}, ${schedule}`;
    $(".favicon").attr("href", `/lib/favicon/${favicon}.png`);
}

function drawRadialTimer(percent) {
    let cx = 100, cy = 100, r = 100;
    let d;

    if (percent >= 100) { // Full circle (2 arcs)
        d = `
            M${cx},${cy}
            L${cx},${cy - r}
            A${r},${r} 0 1,1 ${cx},${cy + r}
            A${r},${r} 0 1,1 ${cx},${cy - r}
            Z
        `;
    } else { // 1 arc
        let angle = percent / 100 * 360;
        let radians = (270 - angle) * (Math.PI / 180);

        let x = cx + r * Math.cos(radians);
        let y = cy + r * Math.sin(radians);

        let largeArcFlag = angle > 180 ? 1 : 0;

        d = `
            M${cx},${cy}
            L${cx},${cy - r}
            A${r},${r} 0 ${largeArcFlag},0 ${x},${y}
            Z
        `;
    }

    $(".radial-timer > path").attr("d", d);
    let mainColor = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-background-color').trim();
    $(".radial-timer > path").attr("fill", mainColor);
}

function isMobile() { return window.innerWidth <= 750; }