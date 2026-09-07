/**
 * Live countdown. Timezone-safe: `kickoffISO` carries an explicit UTC
 * offset (see config.js), so `new Date(...).getTime()` resolves to the
 * same instant in UTC no matter where the visitor's browser clock/locale
 * is set. Every visitor sees the same remaining duration.
 */
(function () {
  const kickoffMs = new Date(HAWKIE_CONFIG.kickoffISO).getTime();

  // Populate match details from the single config source so index.html
  // never needs to duplicate these values.
  const fieldMap = {
    round: HAWKIE_CONFIG.round,
    venue: HAWKIE_CONFIG.venue,
    date: HAWKIE_CONFIG.displayDate,
    kickoff: HAWKIE_CONFIG.displayKickoff,
    "post-headline": HAWKIE_CONFIG.postCountdownHeadline,
    "post-subtext": HAWKIE_CONFIG.postCountdownSubtext,
  };
  Object.keys(fieldMap).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = fieldMap[id];
  });

  // Opponent shows a "TBC" graphic badge until HAWKIE_CONFIG.opponent.confirmed
  // is set to true, at which point the badge is swapped for the opponent name.
  const opponentBadge = document.getElementById("opponent-badge");
  const opponentName = document.getElementById("opponent-name");
  if (HAWKIE_CONFIG.opponent && HAWKIE_CONFIG.opponent.confirmed) {
    if (opponentBadge) opponentBadge.hidden = true;
    if (opponentName) {
      opponentName.hidden = false;
      opponentName.textContent = HAWKIE_CONFIG.opponent.name;
    }
  } else if (opponentBadge) {
    opponentBadge.setAttribute(
      "aria-label",
      "Opponent " + (HAWKIE_CONFIG.opponent ? HAWKIE_CONFIG.opponent.name.toLowerCase() : "to be confirmed")
    );
  }

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
    live: document.getElementById("cd-live"),
    preKickoff: document.getElementById("pre-kickoff"),
    postCountdown: document.getElementById("post-countdown"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render() {
    const remainingMs = kickoffMs - Date.now();

    if (remainingMs <= 0) {
      showPostCountdown();
      return false;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);

    if (els.live) {
      els.live.textContent =
        days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds remaining until kickoff";
    }

    return true;
  }

  function showPostCountdown() {
    if (els.preKickoff) els.preKickoff.hidden = true;
    if (els.postCountdown) els.postCountdown.hidden = false;
    if (els.live) els.live.textContent = HAWKIE_CONFIG.postCountdownHeadline;
  }

  function tick() {
    const stillCounting = render();
    if (!stillCounting) {
      clearInterval(intervalId);
    }
  }

  // Render immediately so there's no flash of "00:00:00:00" before the
  // first interval fires, then update every second.
  const stillCounting = render();
  let intervalId = null;
  if (stillCounting) {
    intervalId = setInterval(tick, 1000);
  }
})();
