/**
 * HawkieTime.com — single source of truth for game details.
 *
 * Edit the values below to update the countdown. Nothing else in the
 * codebase needs to change.
 *
 * IMPORTANT — timezone handling:
 * `kickoffISO` MUST include an explicit UTC offset (e.g. "+10:00" for
 * AEST, "+11:00" for AEDT). With an explicit offset, every visitor's
 * browser computes the same remaining time regardless of their own
 * local timezone. Do NOT remove the offset.
 *
 * AFL finals in September are before daylight saving starts (first
 * Sunday in October), so Victoria/Tasmania venues are AEST (+10:00).
 * Double-check the offset if the venue is in a different state or if
 * daylight saving is active by kickoff.
 */
const HAWKIE_CONFIG = {
  // TODO: confirm/replace once the opponent is known. While `confirmed`
  // is false, the page shows a "TBC" graphic badge instead of `name`.
  // Flip `confirmed` to true and set `name` once the opponent is set —
  // no other file needs to change.
  opponent: {
    name: "Brisbane",
    confirmed: true,
  },
  round: "Preliminary Final",
  venue: "MCG",

  // ISO 8601 datetime WITH UTC offset. Date is still a placeholder —
  // confirm once the fixture is locked in. Kickoff time/venue confirmed.
  kickoffISO: "2026-09-19T17:15:00+10:00",

  // Human-readable strings shown under the countdown (kept separate
  // from kickoffISO so display formatting can differ from the ISO value).
  displayDate: "Saturday 19 September 2026",
  displayKickoff: "5:15 PM AEST (Melbourne)",

  // Shown once the countdown reaches zero. Safe to edit any time.
  postCountdownHeadline: "IT'S HAWKIE TIME.",
  postCountdownSubtext: "Go Hawks.",

  // Live score, once kickoff has passed. This is the Squiggle
  // (api.squiggle.com.au) game ID for this exact match — set to null
  // to turn the live scoreboard off entirely (e.g. between seasons).
  squiggleGameId: 38727,

  // Once this match reaches full time, season.js checks the winner and
  // switches automatically to one of the two states below — no reload,
  // no manual step. If Hawthorn wins, the countdown restarts targeting
  // this Grand Final. If not, the season-over message displays instead.
  grandFinal: {
    opponent: "Fremantle",
    round: "Grand Final",
    venue: "MCG",
    kickoffISO: "2026-09-26T14:30:00+10:00",
    displayDate: "Saturday 26 September 2026",
    displayKickoff: "2:30 PM AEST (Melbourne)",
    postCountdownHeadline: "IT'S GRAND FINAL TIME.",
    postCountdownSubtext: "Go Hawks.",
  },

  // Shown instead, in place of the countdown, if Hawthorn loses.
  seasonOverMessage: {
    headline: "HAWKIETIME IS OVER FOR 2026",
    subtext: "Bigger, better, and Hawkier in 2027.",
  },
};
