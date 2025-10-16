let periodCount;

let settings = {
    theme: null,
    customtheme: null,
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
let skipStore = false;

let id = getCookie("id");
if (!id) {
    id = Math.floor(Math.random() * 9999) + 1;
    document.cookie = `id=${id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

$('.right-sidebar-toggle,.right-sidebar-exit').click(function () {
    sidebarOpened = !sidebarOpened;
    if (sidebarOpened) {
        displaySchedule(schedule);
    }

    $('#app-container').toggleClass('sidebar-opened');
    $('#settings.button').toggleClass('sidebar-opened');
    $('#feedback.button').toggleClass('sidebar-opened');
    $('#right-sidebar-container').toggleClass('sidebar-opened');
});

$('#settings').click(function () {
    $('#settings-container').show();
    setTimeout(function () {
        $('#app-container').hide();
    }, 600);
    
    settingsOpened = true;
    $('#app-container').addClass('settings-opened');
    $('#settings.button').addClass('settings-opened');
    $('#feedback.button').addClass('settings-opened');
    $('#popup-container').addClass('settings-opened');
    $('#right-sidebar-container').addClass('settings-opened');
    $('#settings-container').addClass('settings-opened');

    $('#select-theme').val(settings.theme);
    $('#select-font').val(settings.font);
    $('#select-tune').val(settings.tune);
    if ($('#select-theme').val() == "custom") {
        $("#custom-theme-creator-content").css("display", "");
    }
    else {
        $("#custom-theme-creator-content").css("display", "none");
    }

    for (let i = 0; i < periodCount; i++) {
        $('.user-interactable#input-period-' + (i + 1)).val(settings.periodNames[i] || 'Period ' + (i + 1));
    }
});

$('#close-settings').click(function () {
    // Set settings
    settings.theme = $('#select-theme').val();
    settings.font = $('#select-font').val();
    settings.periodNames = [];
    for (let i = 0; i < periodCount; i++) {
        settings.periodNames.push($('.user-interactable#input-period-' + (i + 1)).val());
    }
    settings.tune = Math.min(Math.max($('#select-tune').val(), -60), 60);

    // Update UI
    $('#app-container').show();
    setTimeout(function () {
        $('#settings-container').hide();
    }, 600);

    settingsOpened = false;
    $('#app-container').removeClass('settings-opened');
    $('#settings.button').removeClass('settings-opened');
    $('#feedback.button').removeClass('settings-opened');
    $('#popup-container').removeClass('settings-opened');
    $('#settings-container').removeClass('settings-opened');
    $('#right-sidebar-container').removeClass('settings-opened');

    applySettings();
    tick();

    displaySchedule(schedule);
});

$('#select-schedule').change(function () {
    schedule = { name: $(this).val(), periods: schedules[$(this).val()].periods };

    displaySchedule(schedule);

    tick();
});

$('#select-theme').change(function () {
    if ($('#select-theme').val() == "custom") {
        $("#custom-theme-creator-content").css("display", "");
    }
    else {
        $("#custom-theme-creator-content").css("display", "none");
    }
});

$('.notification-close').click(function () {
    localStorage.setItem($(this).closest('.notification').attr('id'), 1);
    $(this).closest('.notification').hide();
});

$('#clear-settings').click(function () {
    localStorage.clear();
    skipStore = true;
    location.reload();
});

$('#feedback-modal').on('submit', function(e) {
    e.preventDefault();
    
    $('#feedback-modal').hide();
    $('#modals').hide();

    let feedbackText = $('#feedback-modal-textarea').val().trim();
    if(feedbackText.length > 0 &&
    ![888, 616, 7748].includes(id)) {
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'feedback',
                'feedback-modal': `id${id}: ${feedbackText}`
            })
        });
    }

    $('#feedback-modal-textarea').val("");
});

$('#feedback-modal .exit').click(function() {
    $('#feedback-modal').hide();
    $('#modals').hide();

    $('#feedback-modal-textarea').val("");
});

$('#feedback').click(function() {
    $('#modals').show();
    $('#feedback-modal').show();
});

function displaySchedule(s) {
    $('.schedule-list').empty();
    for (let p of s.periods) {
        if (p.name.startsWith('Period')) {
            p.name = settings.periodNames[p.name.split(' ')[1] - 1];
        }

        let sh = p.start[0].toString().padStart(2, '0');
        let sm = p.start[1].toString().padStart(2, '0');
        let eh = p.end[0].toString().padStart(2, '0');
        let em = p.end[1].toString().padStart(2, '0');

        let item = `<tr style="font-family: ${settings.font};" class="schedule-item">
            <td class="schedule-item-time">${sh}:${sm} - ${eh}:${em}</td>
            <td class="schedule-item-name">${p.name}</td>
        </tr>`;

        $('.schedule-list').append(item);
    };
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return value;
    }
    return null;
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
    settings.customtheme = localStorage.getItem('customtheme') || {
        'backgroundcolor': "#000000",
        'color': "#ffffff",
        'settingsimagebrightness': "1",
        'sidebarbackgroundcolor': "#eaedf3",
        'arcbackgroundcolor': "#dddddd"
    };
    settings.font = localStorage.getItem('font') || '\'Inter\', sans-serif';
    
    settings.periodNames = JSON.parse(localStorage.getItem('periods') || '[]');

    settings.periodNames = settings.periodNames.map(p => (p || ''));

    for (let i = 0; i < periodCount; i++) {
        if (!settings.periodNames[i]) {
            settings.periodNames[i] = `Period ${i + 1}`;
        }
    }

    settings.tune = Number(localStorage.getItem('tune') || '8');

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
    $('#select-schedule').empty();
    let keys = Object.keys(schedules);
    for (let i = 0; i < keys.length; i++) {
        if (schedules[keys[i]].special) {
            $('#select-schedule').append(`<option value="${keys[i]}" hidden>${keys[i]}</option>`);
        }
        else {
            $('#select-schedule').append(`<option value="${keys[i]}">${keys[i]}</option>`);
        }
    }
    $('#select-schedule').val(schedule.name);

    /* Populate period name inputs
    ------------------------ */
    $('.settings-column.periods > .settings-item').empty();
    $('.settings-column.periods > .settings-item').append('<label>Period Names</label>');

    for (let i = 0; i < periodCount; i++) {
        $('.settings-column.periods > .settings-item').append(`
            <label class="label-input-periods" for="input-period-${i + 1}">Period ${i + 1}</label>
            <input maxlength="16" type="text" id="input-period-${i + 1}" class="user-interactable" value="${settings.periodNames[i]}" placeholder="Period ${i + 1}">
        `);
    }

    /* Hide all viewed notifications
    ------------------------ */
    $('.notification').each(function () {
        if (localStorage.getItem($(this).attr('id'))) {
            $(this).hide();
        }
    });

    /* On page close, save all settings to localStorage
    ------------------------ */
    window.addEventListener('beforeunload', storeSettings);

    /* Update page to have localStorage settings applied
    ------------------------ */
    applySettings();

    tick();
    setInterval(tick, 1000); // 1 second
    setInterval(pollForUpdate, 5 * 60 * 1000); // 5 minutes
}

function pollForUpdate() {
    fetch("https://chimewebsite.netlify.app/manifest.json", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
        if (version !== data.ver) { 
            window.location.reload();
        }
    })
    .catch(err => console.error("Version check failed", err));
}

function tick() {
    /* Skip tick if sidebar is opened
    ------------------------ */
    if (sidebarOpened && window.innerWidth <= 750) {
        return;
    }

    /* Get current time with tune offset
    ------------------------ */
    now = new Date(new Date().getTime() + settings.tune * 1000);

    /* Get current minute of the day
    ------------------------ */
    let minutesSinceMidnight = 60 * now.getHours() + now.getMinutes();

    /* Get current period
    ------------------------ */
    let currentPeriod = schedule.periods.find(period => {
        let periodStart = period.start[0] * 60 + period.start[1];
        let periodEnd = period.end[0] * 60 + period.end[1];
        return minutesSinceMidnight >= periodStart && minutesSinceMidnight < periodEnd;
    });
    
    /* If there is no current period
    ------------------------ */
    if (!currentPeriod) {
        let nextPeriod = schedule.periods.find(period => {
            let periodStart = period.start[0] * 60 + period.start[1];
            return periodStart > minutesSinceMidnight;
        });

        // If schedule is over
        if (nextPeriod === undefined) {
            currentPeriod = {
                start: schedule.periods[schedule.periods.length - 1].end,
                end: [24, 0],
                name: 'Free'
            };
        }

        // Make passing period
        else {
            let previousPeriod = schedule.periods[schedule.periods.indexOf(nextPeriod) - 1];

            currentPeriod = {
                start: previousPeriod.end,
                end: nextPeriod.start,
                name: 'Passing to ' + nextPeriod.name
            };
        }
    }
    if (currentPeriod.name.startsWith('Period ')) {
        const periodNameNumber = currentPeriod.name.split(' ')[1];
        currentPeriod.name = settings.periodNames[parseInt(periodNameNumber) - 1];
    }

    let time = {
        'hours': null,
        'minutes': null,
        'seconds': null,
        'string': '',
    }

    let periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentPeriod.start[0], currentPeriod.start[1], 0);
    let periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentPeriod.end[0], currentPeriod.end[1], 0);
    let periodDuration = periodEnd - periodStart;
    let periodRemaining = periodEnd - now;
    let periodPercentage = periodRemaining / periodDuration;

    time.hours = Math.floor(periodRemaining / (1000 * 60 * 60));
    time.minutes = Math.floor((periodRemaining % (1000 * 60 * 60)) / (1000 * 60));
    time.seconds = Math.floor((periodRemaining % (1000 * 60)) / 1000);

    time.string += time.hours > 0 ? `${time.hours}:` : '';
    time.string += `${time.minutes.toString().padStart(2, '0')}:`;
    time.string += `${time.seconds.toString().padStart(2, '0')}`;

    let favicon;
    if (periodRemaining >= 15 * 60 * 1000) {
        favicon = 'green';
    }
    else if (periodRemaining >= 5 * 60 * 1000) {
        favicon = 'yellow';
    }
    else if (periodRemaining >= 2 * 60 * 1000) {
        favicon = 'orange';
    }
    else if (periodRemaining < 2 * 60 * 1000) {
        favicon = 'red';
    }
    else {
        favicon = 'gray';
    }
    $('.favicon').attr('href', `/lib/favicon/${favicon}.png`);

    $('#timer-time').text(time.string);
    $('#timer-period').text(currentPeriod.name);
    $('#timer-schedule').text(schedule.name);
    if ($('#app-date').text() != now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })) {
        $('#app-date').text(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        schedule.name = schoolData.calendar[now.getDay()];

        overrides = schoolData.overrides;

        let overrideKey = `${now.getMonth() + 1}-${now.getDate()}`;
        if (overrides[overrideKey]) {
            schedule.name = overrides[overrideKey];
        }
        schedule.periods = schedules[schedule.name].periods;
    }

    let cx = 100, cy = 100, r = 100;
    let d;
    if (periodPercentage >= 1) { // Full circle (2 arcs)
        d = `
            M${cx},${cy}
            L${cx},${cy - r}
            A${r},${r} 0 1,1 ${cx},${cy + r}
            A${r},${r} 0 1,1 ${cx},${cy - r}
            Z
        `;
    }
    else { // 1 arc
        let angle = periodPercentage * 360;
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
    document.title = `${time.string} | ${currentPeriod.name}, ${schedule.name}`;
}

function applySettings() {
    /* Theme
    ------------------------ */
    $('html').attr('data-theme', settings.theme);

    // Custom Theme
    settings.customtheme = {
        'backgroundcolor': $('#custom-theme-creator-backgroundcolor').val() || "#f9f9f9",
        'color': $('#custom-theme-creator-color').val() || "#202124",
        'settingsimagebrightness': $('#custom-theme-creator-settingsimagebrightness').val() || "0",
        'sidebarbackgroundcolor': $('#custom-theme-creator-sidebarbackgroundcolor').val() || "#f2f4f8",
        'arcbackgroundcolor': $('#custom-theme-creator-arcbackgroundcolor').val() || "#e5e6eb"
    };

    if (settings.theme == 'custom') {
        $('html').css({
            '--background-color': settings.customtheme.backgroundcolor,
            '--color': settings.customtheme.color,
            '--image-on-bg-brightness': settings.customtheme.settingsimagebrightness,
            '--sidebar-background-color': settings.customtheme.sidebarbackgroundcolor,
            '--radial-background-color': settings.customtheme.arcbackgroundcolor,
        });
    } else {
        $('html').css({
            '--background-color': '',
            '--color': '',
            '--sidebar-toggle-background-color': '',
            '--sidebar-toggle-hover-background-color': '',
            '--image-on-toggle-brightness': '',
            '--image-on-bg-brightness': '',
            '--sidebar-background-color': '',
            '--radial-background-color': ''
        });
    }

    /* Font
    ------------------------ */
    $('#timer-time, #timer-period, #timer-schedule, #app-date').css('font-family', settings.font);
    
    /* Periods
    ------------------------ */
    settings.periodNames = settings.periodNames.map(period => period.trim());
    for (let i = 0; i < periodCount; i++) {
        settings.periodNames[i] = $('.user-interactable#input-period-' + (i + 1)).val();
        if (settings.periodNames[i] === '') {
            settings.periodNames[i] = `Period ${i + 1}`;
        }
    }

    /* Tune
    ------------------------ */
    /* Not necessary since it's just calculated in tick() */
}

function storeSettings() {
    if (skipStore) {
        return;
    }

    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('customtheme', JSON.stringify(settings.customtheme));
    localStorage.setItem('font', settings.font);
    localStorage.setItem('periods', JSON.stringify(settings.periodNames));
    localStorage.setItem('tune', settings.tune);
}

await init();
