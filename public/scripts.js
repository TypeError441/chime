import { set, get } from '/lib/js/idb-helper.js';

/* -------------------------------
------------VARIABLES-------------
------------------------------- */
let now = new Date();

// Setting variables
let theme;
let font;
let periods;
let version;

// Schedule variables
let scheduleName;
let schedule;
let currentPeriod = { subject: '' };

let overrides;
let schedules;
let periodCount;
let calendar;

let schools;
let school;

let sidebarOpened = false;
let settingsOpened = false;

/* -------------------------------
-------------LOADING--------------
------------------------------- */
console.log('Loading settings, school, and sw data.');

// Register sw
fetch('/manifest.json').then(response => response.json())
.then(data => {
    version = data.ver;
    $('.version').text('version ' + version);
    navigator.serviceWorker.register(`/sw.js?version=${version}`);
    console.log('Registered sw.js.');

    setTimeout(pollForVersion, document.hidden ? 20 * 60000 : 30 * 1000);
});

// If there is no school, set it to egan by default
if (await get('settings', 'school') === undefined) {
    await set('settings', 'school', 'egan');
}
school = await get('settings', 'school');

console.log(`Got school as ${school}.`);

// Get schools.json list
fetch('/schools/schools.json').then(response => response.json())
.then(async (data) => {
    schools = data.schools;
    loadAvailableSchoolsToDropdown();
    $('.select-school').val(school);
});

// Get school data
fetch(`/schools/${school}.json`).then(response => response.json())
.then(async (data) => {
    periodCount = data.periods;

    let p = [];
    for (let i = 0; i < periodCount; i++) {
        p.push(`Period ${i + 1}`);
    }
    if (await get('settings', 'periods').length < periodCount || await get('settings', 'periods') === undefined) {
        await set('settings', 'periods', p);
    }

    periods = await get('settings', 'periods');
    if (periods.length < periodCount) {
        for (let i = periods.length; i < periodCount; i++) {
            periods.push(`Period ${i + 1}`);
        }
    }

    if (await get('settings', 'theme') === undefined) {
        await set('settings', 'theme', 'default-light')
    };
    if (await get('settings', 'font') === undefined) {
        await set('settings', 'font', '"Inter", sans-serif')
    };
    setTheme(await get('settings', 'theme'));
    setFont(await get('settings', 'font'));

    schedules = data.schedules;
    calendar = data.calendar;
    
    scheduleName = calendar[now.getDay()];

    overrides = data.overrides;

    let overrideKey = `${now.getMonth() + 1}-${now.getDate()}`;
    if (overrides[overrideKey]) {
        scheduleName = overrides[overrideKey];
    }
    schedule = schedules[scheduleName];

    loadAvailableSchedulesToDropdown();
    $('.select-schedule').val(scheduleName);

    loadPeriodsInSettings(periodCount);

    tick();
});

/* -------------------------------
----------JQuery Events-----------
------------------------------- */
$('.right-sidebar-toggle,.right-sidebar-exit').click(function () {
    console.log('Toggled sidebar.');

    sidebarOpened = !sidebarOpened;
    if (sidebarOpened) {
        displaySchedule(schedule);
    }

    if (sidebarOpened) {
        $('.right-sidebar').show();
        console.log('Opened sidebar.');
    }
    else {
        setTimeout(function () {
            $('.right-sidebar').hide();
        }, 300);
        console.log('Closed sidebar.');
    }

    $('.time-container').toggleClass('toggle-effect');
    $('.right-sidebar-container').toggleClass('toggle-effect');
    $('.settings').toggleClass('toggle-effect');
});

$('.settings').click(function () {
    console.log('Opened settings.');

    $('.settings-container').show();
    setTimeout(function () {
        $('.container').hide();
    }, 600);
    
    settingsOpened = true;
    $('.container').addClass('toggle-effect');
    $('.settings-container').addClass('toggle-effect');

    $('.select-theme').val(theme);
    $('html').attr('data-theme', theme);
    $('.select-font').val(font);

    for (let i = 0; i < periodCount; i++) {
        $('.input-period#input-period-' + (i + 1)).val(periods[i] || 'Period ' + (i + 1));
    }
});

$('.close-settings').click(function () {
    console.log('Closed settings.');

    $('.container').show();
    setTimeout(function () {
        $('.settings-container').hide();
    }, 600);

    settingsOpened = false;
    $('.container').removeClass('toggle-effect');
    $('.settings-container').removeClass('toggle-effect');

    setTheme($('.select-theme').val());
    setFont($('.select-font').val());

    for (let i = 0; i < periodCount; i++) {
        periods[i] = $('.input-period#input-period-' + (i + 1)).val();
    }
    setPeriodNames(periods);

    runLogic();

    displaySchedule(schedule);
});

$('.select-schedule').change(function () {
    changeSchedule($(this).val());
});

$('.select-school').change(function () {
    changeSchool($(this).val());
});

function loadPeriodsInSettings(periods) {
    $('.settings-column.periods > .settings-item').empty();

    for (let i = 0; i < periods; i++) {
        $('.settings-column.periods > .settings-item').append(`
            <label class="label-input-periods" for="input-period-${i + 1}">Period ${i + 1}</label>
            <input maxlength="16" type="text" id="input-period-${i + 1}" class="input-period" value="Period ${i + 1}" placeholder="Period ${i + 1}">
        `);
    }

    console.log('Updated period count in settings.');
}

function loadAvailableSchedulesToDropdown() {
    $('.select-schedule').empty();

    let keys = Object.keys(schedules);
    for (let i = 0; i < keys.length; i++) {
        if (schedules[keys[i]].special) {
            $('.select-schedule').append(`<option value="${keys[i]}" hidden>${keys[i]}</option>`);
        }
        else {
            $('.select-schedule').append(`<option value="${keys[i]}">${keys[i]}</option>`);
        }
    }
    
    console.log('Loaded available schedules to dropdown.');
}

function loadAvailableSchoolsToDropdown() {
    $('.select-school').empty();

    let keys = Object.keys(schools);
    for (let i = 0; i < keys.length; i++) {
        $('.select-school').append(`<option value="${keys[i]}">${schools[keys[i]]}</option>`);
    }
    
    console.log('Loaded available schedules to dropdown.');
}

function changeSchedule(n) {
    scheduleName = n;
    schedule = schedules[scheduleName];

    console.log(`Chose ${scheduleName} as schedule.`);

    displaySchedule(schedule);

    runLogic();
}

async function changeSchool(n) {
    school = n;

    console.log(`Chose ${school} as school.`);

    await set('settings', 'school', school);
    fetch(`/schools/${school}.json`).then(response => response.json())
    .then(async (data) => {
        periodCount = data.periods;

        let p = [];
        for (let i = 0; i < periodCount; i++) {
            p.push(`Period ${i + 1}`);
        }
        if (await get('settings', 'periods').length < periodCount || await get('settings', 'periods') === undefined) {
            await set('settings', 'periods', p);
        }

        periods = await get('settings', 'periods');
        if (periods.length < periodCount) {
            for (let i = periods.length; i < periodCount; i++) {
                periods.push(`Period ${i + 1}`);
            }
        }

        schedules = data.schedules;
        calendar = data.calendar;
        
        scheduleName = calendar[now.getDay()];

        overrides = data.overrides;

        let overrideKey = `${now.getMonth() + 1}-${now.getDate()}`;
        if (overrides[overrideKey]) {
            scheduleName = overrides[overrideKey];
        }
        schedule = schedules[scheduleName];

        loadAvailableSchedulesToDropdown();
        $('.select-schedule').val(scheduleName);

        loadPeriodsInSettings(periodCount);

    });
}

async function runLogic() {
    if (sidebarOpened && isMobile()) {
        console.log('Stopped logic because sidebar on mobile.');
        return;
    }

    now = new Date();

    let time = getTime(schedule);
    let parsedTime = parseTime(time);
    let p = getPeriod(schedule);
    let parsedPeriod = await parsePeriod(p);

    let today = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    let favicon = getFaviconColor(parsedTime[1]);

    let percent = parsedTime[2];

    if (!settingsOpened) {
        updateUI(parsedTime[0], parsedPeriod, scheduleName, today, percent);
    }
    updatePage(parsedTime[0], parsedPeriod, scheduleName, favicon);
}

function pollForVersion() {
    fetch('/manifest.json').then(response => response.json())
    .then(data => {
        if (data.ver !== version) {
            window.location.reload(true);
        }
    });
    
    setTimeout(pollForVersion, document.hidden ? 20 * 60000 : 30 * 1000);
}

function tick() {
    runLogic();

    setTimeout(tick, 1000);
}

/* -------------------------------
---------Logic Functions----------
------------------------------- */
async function setTheme(t) {
    theme = t;
    $('html').attr('data-theme', t);
    await set('settings', 'theme', t);
}

async function setFont(f) {
    font = f;
    $('.time, .period, .schedule, .date').css('font-family', f);
    // schedule-item handled in displaySchedule()
    await set('settings', 'font', f);
}

async function setPeriodNames(p) {
    let periods = p;
    periods = periods.map(period => period.trim());

    for (let i = 0; i < periodCount; i++) {
        if (periods[i] === '') {
            periods[i] = `Period ${i + 1}`;
        }
    }

    await set('settings', 'periods', periods);

}

async function displaySchedule(schedule) {
    $('.schedule-list').empty();
    for (let p of schedule.periods) {
        let start = p.start;
        let end = p.end;
        let subject = p.subject;
        if (subject.startsWith('Period')) {
            subject = periods[subject.split(' ')[1] - 1];
        }

        let sh = String(start[0]).padStart(2, '0');
        let sm = String(start[1]).padStart(2, '0');
        let eh = String(end[0]).padStart(2, '0');
        let em = String(end[1]).padStart(2, '0');

        let item = `<tr style="font-family: ${font};" class="schedule-item">
            <td class="schedule-item-time">${sh}:${sm} - ${eh}:${em}</td>
            <td class="schedule-item-name">${subject}</td>
        </tr>`;

        $('.schedule-list').append(item);
    };

    console.log('Displayed schedule in sidebar.');
}

function getTime(schedule) {
    let period = getPeriod(schedule);
    if (period === null) {
        return null;
    }

    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.end[0], period.end[1], 0);
    let timeRemaining = end - now;
    let h = Math.floor(timeRemaining / (1000 * 60 * 60));
    let m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    let pStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.start[0], period.start[1], 0);
    let pEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.end[0], period.end[1], 0);
    let d = pEnd - pStart; // Total time of period in milliseconds
    let t = pEnd - now; // Total time left in the period in milliseconds
    let p = t / d;

    return [h, m, s, t, p];
}

function parseTime(time) {
    if (time === null) { // Schedule is finished, return null for favicon
        return ['Free', null];
    }
    let s = '';
    if (time[0] > 0) {
        s += `${time[0]}:`;
    }
    s += `${time[1].toString().padStart(2, '0')}:${time[2].toString().padStart(2, '0')}`;

    return [s, time[3], time[4]];
}

function getPeriod(s) {
    let current = now.getHours() * 60 + now.getMinutes();
    let currentPeriod = s.periods.find(period => current >= period.start[0] * 60 + period.start[1] && current < period.end[0] * 60 + period.end[1]);
    
    if (!currentPeriod) {
        let nextPeriod = s.periods.find(period => period.start[0] * 60 + period.start[1] > current);
        if (!nextPeriod) { // Schedule has ended for the day
            return null;
        }

        let prevIndex = s.periods.indexOf(nextPeriod) - 1;
        let previousPeriod = s.periods[prevIndex];

        currentPeriod = {
            start: previousPeriod.end,
            end: nextPeriod.start,
            subject: 'Passing to ' + nextPeriod.subject
        };
    }

    if (sidebarOpened && currentPeriod.subject !== period.subject) {
        displaySchedule(s);
        period = currentPeriod;
    }

    return currentPeriod;
}

async function parsePeriod(period) {
    if (period === null) {
        return 'School is over';
    }

    let periodName = period.subject || 'Free';
    
    const parts = periodName.split(' ');
    if (parts[0] === 'Period' && !isNaN(parts[1])) {
        periodName = periods[parseInt(parts[1]) - 1];
    }

    return periodName;
}

function getFaviconColor(ms) {
    if (ms === null) {
        return 'gray';
    }
    if (ms >= 15 * 60 * 1000) {
        return 'green';
    }
    if (ms >= 5 * 60 * 1000) {
        return 'yellow';
    }
    if (ms >= 2 * 60 * 1000) {
        return 'orange';
    }
    if (ms < 2 * 60 * 1000) {
        return 'red';
    }
}

function updateUI(time, period, schedule, today, percent) {
    $('.time').text(time);
    $('.period').text(period);
    $('.schedule').text(schedule);
    $('.date').text(today);

    drawRadialTimer(percent * 100);
}

function updatePage(time, period, schedule, favicon) {
    if (!isMobile()) {
        document.title = `${time} | ${period}, ${schedule}`;
    }
    $('.favicon').attr('href', `/lib/favicon/${favicon}.png`);
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
    }
    else { // 1 arc
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

    $('.radial-timer > path').attr('d', d);
    let mainColor = getComputedStyle(document.documentElement).getPropertyValue('--radial-background-color').trim();
    $('.radial-timer > path').attr('fill', mainColor);
}

function isMobile() {
    return window.innerWidth <= 750;
}