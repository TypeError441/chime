let periodCount;

let settings = {
    theme: null,
    font: null,
    periodNames: null,
    tune: null
};

let now = new Date(new Date().getTime() + settings.tune * 1000);

let version;

let schedule = { name: '', periods: [] };

let overrides;
let schedules;

let schoolData;

let sidebarOpened = false;
let settingsOpened = false;

$('.right-sidebar-toggle,.right-sidebar-exit').click(function () {
    sidebarOpened = !sidebarOpened;
    if (sidebarOpened) {
        displaySchedule(schedule);
    }

    $('#app-container').toggleClass('sidebar-opened');
    $('#settings.button').toggleClass('sidebar-opened');
    $('#right-sidebar-container').toggleClass('sidebar-opened');
});

$('#settings').click(function () {
    $('#settings-container').show();
    setTimeout(function () {
        $('#app-container').hide();
    }, 600);
    
    settingsOpened = true;
    $('#app-container').addClass('settings-opened');
    $('#settings').addClass('settings-opened');
    $('#popup-container').addClass('settings-opened');
    $('#right-sidebar-container').addClass('settings-opened');
    $('#settings-container').addClass('settings-opened');

    $('.select-theme').val(settings.theme);
    $('.select-font').val(settings.font);
    $('.select-tune').val(settings.tune);

    for (let i = 0; i < periodCount; i++) {
        $('.input-period#input-period-' + (i + 1)).val(periodCount[i] || 'Period ' + (i + 1));
    }
});

$('#close-settings').click(function () {
    // Set settings
    settings.theme = $('.select-theme').val();
    settings.font = $('.select-font').val();
    settings.periodNames = [];
    for (let i = 0; i < periodCount; i++) {
        settings.periodNames.push($('.input-period#input-period-' + (i + 1)).val());
    }
    settings.tune = Math.min(Math.max($('.select-tune').val(), -60), 60);

    // Update UI
    $('#app-container').show();
    setTimeout(function () {
        $('#settings-container').hide();
    }, 600);

    settingsOpened = false;
    $('#app-container').removeClass('settings-opened');
    $('#settings').removeClass('settings-opened');
    $('#popup-container').removeClass('settings-opened');
    $('#settings-container').removeClass('settings-opened');
    $('#right-sidebar-container').removeClass('settings-opened');

    applySettings();
    tick();

    displaySchedule(schedule);
});

$('.select-schedule').change(function () {
    schedule = { name: $(this).val(), periods: schedules[$(this).val()].periods };

    displaySchedule(schedule);

    tick();
});

$('.notification-close').click(function () {
    localStorage.setItem($(this).closest(".notification").attr("id"), 1);
    $(this).closest(".notification").hide();
});

function pollForVersion() {
    fetch('/manifest.json').then(response => response.json())
    .then(data => {
        if (data.ver !== version) {
            window.location.reload(true);
            if (navigator.userAgent.indexOf('Googlebot') === -1) {
                window.location.href = window.location.href;
            }
        }
    });
    
    setTimeout(pollForVersion, document.hidden ? 20 * 60000 : 30 * 1000);
}

function displaySchedule(s) {
    $('.schedule-list').empty();
    for (let p of s.periods) {
        let start = p.start;
        let end = p.end;
        let subject = p.subject;
        if (subject.startsWith('Period')) {
            subject = settings.periodNames[subject.split(' ')[1] - 1];
        }

        let sh = String(start[0]).padStart(2, '0');
        let sm = String(start[1]).padStart(2, '0');
        let eh = String(end[0]).padStart(2, '0');
        let em = String(end[1]).padStart(2, '0');

        let item = `<tr style="font-family: ${settings.font};" class="schedule-item">
            <td class="schedule-item-time">${sh}:${sm} - ${eh}:${em}</td>
            <td class="schedule-item-name">${subject}</td>
        </tr>`;

        $('.schedule-list').append(item);
    };
}

async function init() {
    /* Get data from JSON files
    ------------------------ */
    const responseSchoolData = await fetch('/schools/egan.json');
    schoolData = await responseSchoolData.json();

    const responseManifest = await fetch('/manifest.json');
    const manifest = await responseManifest.json();

    /* Version and service worker
    ------------------------ */
    version = manifest.ver;
    $('.version').text('version ' + version);
    navigator.serviceWorker.register(`/sw.js?version=${version}`);

    periodCount = schoolData.periods; 

    /* Load localStorage data
    ------------------------ */
    settings.theme = localStorage.getItem('theme') || 'default-light';
    settings.font = localStorage.getItem('font') || '"Inter", sans-serif';
    
    settings.periodNames = JSON.parse(localStorage.getItem('periods') || "[]");

    settings.periodNames = settings.periodNames.map(p => (p || ''));

    for (let i = 0; i < periodCount; i++) {
        if (!settings.periodNames[i]) {
            settings.periodNames[i] = `Period ${i + 1}`;
        }
    }

    settings.tune = Number(localStorage.getItem('tune') || '31');

    /* Get schedules and current schedule
    ------------------------ */
    schedules = schoolData.schedules;

    schedule.name = schoolData.calendar[now.getDay()];

    overrides = schoolData.overrides;

    let overrideKey = `${now.getMonth() + 1}-${now.getDate()}`;
    if (overrides[overrideKey]) {
        schedule.name = overrides[overrideKey];
    }
    schedule.periods = schedules[schedule.name].periods;


    /* Populate schedule select
    ------------------------ */
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
    $('.select-schedule').val(schedule.name);

    /* Populate period name inputs
    ------------------------ */
    $('.settings-column.periods > .settings-item').empty();
    $('.settings-column.periods > .settings-item').append('<label>Period Names</label>');

    for (let i = 0; i < periodCount; i++) {
        $('.settings-column.periods > .settings-item').append(`
            <label class="label-input-periods" for="input-period-${i + 1}">Period ${i + 1}</label>
            <input maxlength="16" type="text" id="input-period-${i + 1}" class="input-period" value="Period ${i + 1}" placeholder="Period ${i + 1}">
        `);
    }

    /* Hide all viewed notifications
    ------------------------ */
    $(".notification").each(function () {
        if (localStorage.getItem($(this).attr("id"))) {
            $(this).hide();
        }
    });

    /* On page close, save all settings to localStorage
    ------------------------ */
    window.addEventListener("beforeunload", storeSettings);

    /* Update page to have localStorage settings applied
    ------------------------ */
    applySettings();

    tick();
    setInterval(tick, 1000);
}

function tick() {
    if (sidebarOpened && window.innerWidth <= 750) {
        return;
    }

    now = new Date(new Date().getTime() + settings.tune * 1000);




    let current = now.getHours() * 60 + now.getMinutes();
    let p = schedule.periods.find(period => current >= period.start[0] * 60 + period.start[1] && current < period.end[0] * 60 + period.end[1]);
    
    if (!p) {
        let nextPeriod = schedule.periods.find(period => period.start[0] * 60 + period.start[1] > current);
        if (nextPeriod === undefined) { // Schedule has ended for the day
            p = null;
        }
        else {
            let prevIndex = schedule.periods.indexOf(nextPeriod) - 1;
            let previousPeriod = schedule.periods[prevIndex];

            currentPeriod = {
                p: previousPeriod.end,
                end: nextPeriod.start,
                subject: 'Passing to ' + nextPeriod.subject
            };
        }
    }



    let time;

    if (p === null) {
        time = null;
    }
    else {
        let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), p.end[0], p.end[1], 0);
        let timeRemaining = end - now;
        let h = Math.floor(timeRemaining / (1000 * 60 * 60));
        let m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        let pStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), p.start[0], p.start[1], 0);
        let pEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), p.end[0], p.end[1], 0);
        let d = pEnd - pStart; // Total time of period in milliseconds
        let t = pEnd - now; // Total time left in the period in milliseconds
        let per = t / d;

        time = [h, m, s, t, per];
    }



    let parsedTime;
    if (time === null) { // Schedule is finished, return null for favicon
        parsedTime = ['Free', null];
    }
    else {
        let timeStr = '';
        if (time[0] > 0) {
            timeStr += `${time[0]}:`;
        }
        timeStr += `${time[1].toString().padStart(2, '0')}:${time[2].toString().padStart(2, '0')}`;

        parsedTime = [timeStr, time[3], time[4]];
    }



    let parsedPeriod;
    if (p === null) {
        parsedPeriod = 'School is over';
    }
    else {
        parsedPeriod = p.subject || 'Free';
    
        const parts = parsedPeriod.split(' ');
        if (parts[0] === 'Period' && !isNaN(parts[1])) {
            parsedPeriod = periodCount[parseInt(parts[1]) - 1];
        }
    }



    let favicon;
    if (parsedTime[1] === null) {
        favicon = 'gray';
    }
    else if (parsedTime[1] >= 15 * 60 * 1000) {
        favicon = 'green';
    }
    else if (parsedTime[1] >= 5 * 60 * 1000) {
        favicon = 'yellow';
    }
    else if (parsedTime[1] >= 2 * 60 * 1000) {
        favicon = 'orange';
    }
    else if (parsedTime[1] < 2 * 60 * 1000) {
        favicon = 'red';
    }
    $('.favicon').attr('href', `/lib/favicon/${favicon}.png`);




    if (!settingsOpened) {
        $('#timer-time').text(parsedTime[0]);
        $('#timer-period').text(parsedPeriod);
        $('#timer-schedule').text(schedule.name);
        $('#app-date').text(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        let cx = 100, cy = 100, r = 100;
        let d;

        if (parsedTime[2] >= 1) { // Full circle (2 arcs)
            d = `
                M${cx},${cy}
                L${cx},${cy - r}
                A${r},${r} 0 1,1 ${cx},${cy + r}
                A${r},${r} 0 1,1 ${cx},${cy - r}
                Z
            `;
        }
        else { // 1 arc
            let angle = parsedTime[2] * 360;
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

        $('#timer-progress path').attr('d', d);
        $('#timer-progress path').attr('fill', getComputedStyle(document.documentElement).getPropertyValue('--radial-background-color').trim());
    }
    if (window.innerWidth > 750) {
        document.title = `${parsedTime[0]} | ${parsedPeriod}, ${schedule.name}`;
    }
}

function saveSettings() {
    /* Theme
    ------------------------ */
    settings.theme = $('.select-theme').val();

    /* Font
    ------------------------ */
    settings.font = $('.select-font').val();

    /* Periods
    ------------------------ */
    settings.periodNames = [];
    for (let i = 0; i < periodCount; i++) {
        settings.periodNames.push($('.input-period#input-period-' + (i + 1)).val());
    }

    /* Tune
    ------------------------ */
    settings.tune = $('.select-tune').val();
}

function applySettings() {
    /* Theme
    ------------------------ */
    $('html').attr('data-theme', settings.theme);

    /* Font
    ------------------------ */
    $('#timer-time, #timer-period, #timer-schedule, #app-date').css('font-family', settings.font);
    
    /* Periods
    ------------------------ */
    settings.periodNames = settings.periodNames.map(period => period.trim());
    for (let i = 0; i < periodCount; i++) {
        if (settings.periodNames[i] === '') {
            settings.periodNames[i] = `Period ${i + 1}`;
        }
        settings.periodNames[i] = $('.input-period#input-period-' + (i + 1)).val();
    }

    /* Tune
    ------------------------ */
    /* Not necessary since it's just calculated in tick() */
}

function storeSettings() {
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('font', settings.font);
    localStorage.setItem('periods', JSON.stringify(settings.periodNames));
    localStorage.setItem('tune', settings.tune);
}

await init();