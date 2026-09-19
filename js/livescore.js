/**
 * Live score polling. Fetches through our own /api/score relay (never
 * directly from the upstream data provider — see api/score.js for why),
 * starting exactly at kickoff and stopping once the match is complete.
 * Fails silently and leaves the last known score on screen if a poll
 * fails, rather than showing a broken UI.
 */
(function () {
  if (!window.HAWKIE_CONFIG || !HAWKIE_CONFIG.squiggleGameId) return;

  const kickoffMs = new Date(HAWKIE_CONFIG.kickoffISO).getTime();
  const gameId = HAWKIE_CONFIG.squiggleGameId;
  const POLL_MS = 20000;

  const board = document.getElementById("scoreboard");
  const statusText = document.getElementById("score-status-text");
  const homeEl = document.getElementById("score-home");
  const awayEl = document.getElementById("score-away");
  const awayNameEl = document.getElementById("score-away-name");

  if (!board || !statusText || !homeEl || !awayEl) return;

  if (HAWKIE_CONFIG.opponent && HAWKIE_CONFIG.opponent.confirmed && awayNameEl) {
    awayNameEl.textContent = HAWKIE_CONFIG.opponent.name.toUpperCase();
  }

  let pollId = null;

  function setStatus(text) {
    statusText.textContent = text;
  }

  function applyScore(data) {
    // Match scores to Hawthorn/opponent regardless of which side the
    // data source lists as home vs away.
    const hawthornIsHome = /hawthorn/i.test(data.hteam || "");
    const hawthornScore = hawthornIsHome ? data.hscore : data.ascore;
    const opponentScore = hawthornIsHome ? data.ascore : data.hscore;

    homeEl.textContent = hawthornScore != null ? hawthornScore : 0;
    awayEl.textContent = opponentScore != null ? opponentScore : 0;

    if (data.complete >= 100) {
      setStatus(data.timestr || "FULL TIME");
      stopPolling();
    } else if (data.timestr) {
      setStatus(data.timestr.toUpperCase());
    } else {
      setStatus("LIVE");
    }
  }

  function fetchScore() {
    fetch("/api/score?gameId=" + gameId)
      .then(function (res) {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then(applyScore)
      .catch(function () {
        // Leave whatever was last shown on screen; retry next interval.
      });
  }

  function startPolling() {
    board.hidden = false;
    fetchScore();
    pollId = setInterval(fetchScore, POLL_MS);
  }

  function stopPolling() {
    if (pollId) {
      clearInterval(pollId);
      pollId = null;
    }
  }

  const now = Date.now();
  if (now >= kickoffMs) {
    startPolling();
  } else {
    setTimeout(startPolling, kickoffMs - now);
  }
})();
