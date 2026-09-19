/**
 * Live countdown. Timezone-safe: kickoff times carry an explicit UTC
 * offset (see config.js), so `new Date(...).getTime()` resolves to the
 * same instant in UTC no matter where the visitor's browser clock/locale
 * is set. Every visitor sees the same remaining duration.
 *
 * Exposes window.HawkieCountdown.start(kickoffMs, postHeadline, postSubtext)
 * so season.js can re-point this same countdown at the Grand Final once
 * this match finishes, without a page reload.
 */
(function () {
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

  let intervalId = null;
  let activeKickoffMs = null;
  let activePostHeadline = HAWKIE_CONFIG.postCountdownHeadline;
  let activePostSubtext = HAWKIE_CONFIG.postCountdownSubtext;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render() {
    const remainingMs = activeKickoffMs - Date.now();

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
    const postHeadlineEl = document.getElementById("post-headline");
    const postSubtextEl = document.getElementById("post-subtext");
    if (postHeadlineEl) postHeadlineEl.textContent = activePostHeadline;
    if (postSubtextEl) postSubtextEl.textContent = activePostSubtext;
    if (els.live) els.live.textContent = activePostHeadline;
  }

  function tick() {
    const stillCounting = render();
    if (!stillCounting) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function start(kickoffMs, postHeadline, postSubtext) {
    activeKickoffMs = kickoffMs;
    activePostHeadline = postHeadline;
    activePostSubtext = postSubtext;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (els.preKickoff) els.preKickoff.hidden = false;
    if (els.postCountdown) els.postCountdown.hidden = true;

    // Render immediately so there's no flash of "00:00:00:00" before the
    // first interval fires, then update every second.
    const stillCounting = render();
    if (stillCounting) {
      intervalId = setInterval(tick, 1000);
    }
  }

  window.HawkieCountdown = { start: start };

  start(
    new Date(HAWKIE_CONFIG.kickoffISO).getTime(),
    HAWKIE_CONFIG.postCountdownHeadline,
    HAWKIE_CONFIG.postCountdownSubtext
  );
})();
