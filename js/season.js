/**
 * Post-match branching. Called once by livescore.js when the live game
 * reaches full time (see window.HAWKIE_ON_FULL_TIME below). Decides
 * between two end states based on the winner:
 *
 *  - Hawthorn win  -> restart the countdown (via window.HawkieCountdown,
 *    exposed by countdown.js) pointed at HAWKIE_CONFIG.grandFinal.
 *  - Hawthorn loss -> hide the countdown/scoreboard/match-details and
 *    show the season-over message instead.
 *
 * Runs automatically for every visitor's own browser — no manual step,
 * no page reload.
 */
(function () {
  if (typeof HAWKIE_CONFIG === "undefined") return;

  function switchToGrandFinal() {
    const gf = HAWKIE_CONFIG.grandFinal;
    if (!gf || !window.HawkieCountdown) return;

    const headlineEl = document.querySelector("#pre-kickoff .headline");
    if (headlineEl) {
      headlineEl.innerHTML =
        'IT\'S ALMOST<br /><span class="accent">GRAND FINAL TIME</span>';
    }

    const opponentBadge = document.getElementById("opponent-badge");
    const opponentNameEl = document.getElementById("opponent-name");
    if (opponentBadge) opponentBadge.hidden = true;
    if (opponentNameEl) {
      opponentNameEl.hidden = false;
      opponentNameEl.textContent = gf.opponent.toUpperCase();
    }

    const fieldMap = {
      round: gf.round,
      venue: gf.venue,
      date: gf.displayDate,
      kickoff: gf.displayKickoff,
    };
    Object.keys(fieldMap).forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.textContent = fieldMap[id];
    });

    const scoreboard = document.getElementById("scoreboard");
    if (scoreboard) scoreboard.hidden = true;

    window.HawkieCountdown.start(
      new Date(gf.kickoffISO).getTime(),
      gf.postCountdownHeadline,
      gf.postCountdownSubtext
    );
  }

  function showSeasonOver() {
    const seasonOver = document.getElementById("season-over");
    const preKickoff = document.getElementById("pre-kickoff");
    const postCountdown = document.getElementById("post-countdown");
    const scoreboard = document.getElementById("scoreboard");
    const gameDetails = document.getElementById("game-details");
    const msg = HAWKIE_CONFIG.seasonOverMessage;

    if (preKickoff) preKickoff.hidden = true;
    if (postCountdown) postCountdown.hidden = true;
    if (scoreboard) scoreboard.hidden = true;
    if (gameDetails) gameDetails.hidden = true;

    if (seasonOver && msg) {
      const headlineEl = document.getElementById("season-over-headline");
      const subtextEl = document.getElementById("season-over-subtext");
      if (headlineEl) headlineEl.textContent = msg.headline;
      if (subtextEl) subtextEl.textContent = msg.subtext;
      seasonOver.hidden = false;
    }

    const liveEl = document.getElementById("cd-live");
    if (liveEl && msg) liveEl.textContent = msg.headline;
  }

  let handled = false;

  window.HAWKIE_ON_FULL_TIME = function (winnerTeamName) {
    if (handled) return;
    handled = true;

    if (/hawthorn/i.test(winnerTeamName || "")) {
      switchToGrandFinal();
    } else {
      showSeasonOver();
    }
  };
})();

